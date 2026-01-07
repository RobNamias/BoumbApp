import asyncio
import os
import logging
from rag_pipeline.perplexity_client import PerplexityClient
from librarian import update_category_index

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("Bulk-Librarian")

# Helper for async file I/O to avoid blocking the loop
async def async_write(path, content, mode="w"):
    def _write():
        with open(path, mode, encoding="utf-8") as f:
            f.write(content)
    loop = asyncio.get_running_loop()
    await loop.run_in_executor(None, _write)

async def async_read_lines(path):
    def _read():
        with open(path, "r", encoding="utf-8") as f:
            return f.readlines()
    if not os.path.exists(path):
        return []
    loop = asyncio.get_running_loop()
    return await loop.run_in_executor(None, _read)

async def async_touch(path):
    def _touch():
        if not os.path.exists(path):
            open(path, 'a').close()
    loop = asyncio.get_running_loop()
    await loop.run_in_executor(None, _touch)
    
async def process_topic(client, line, base_output_dir, affected_dirs):
    line = line.strip()
    if not line or line.startswith("#"):
        return

    # Parse category
    if ":" in line:
        category, topic = line.split(":", 1)
        category = category.strip().lower()
        topic = topic.strip()
    else:
        category = "styles" # Default
        topic = line

    logger.info(f"⏳ Processing: [{category}] '{topic}'...")
    
    # Define output subfolder
    output_dir = os.path.join(base_output_dir, category)
    os.makedirs(output_dir, exist_ok=True)

    try:
        # Sanitize filename
        filename = "".join(x for x in topic if x.isalnum() or x in " -_").lower().replace(" ", "_") + ".md"
        filepath = os.path.join(output_dir, filename)

        if os.path.exists(filepath):
            logger.info(f"⏭️ Skipping '{topic}' (File exists: {filename})")
            return

        content = await client.fetch_theory(topic)
        
        file_content = f"# {topic}\n\n> Source: Perplexity Sonar | Batch Import | Category: {category}\n\n{content}"
        await async_write(filepath, file_content)
        
        logger.info(f"✅ Saved: {category}/{filename}")
        affected_dirs.add(output_dir)

        # Update Glossary
        glossary_path = os.path.join(base_output_dir, "glossaire.md")
        rel_path = f"{category}/{filename}"
        glossary_entry = f"- **{topic}**: [{rel_path}]({rel_path})\n"
        try:
            await async_write(glossary_path, glossary_entry, mode="a")
        except Exception:
             pass # Fail silently for bulk to keep moving
        
    except Exception as e:
        logger.error(f"❌ Failed '{topic}': {e}")

async def main():
    inbox_file = "inbox.txt"
    archive_file = "archive.txt"
    output_dir = "knowledge_base"
    
    # Create inbox if missing
    await async_touch(inbox_file)
    if not os.path.exists(inbox_file): # Double check after creation
         logger.info(f"📥 Created empty {inbox_file}")

    # Create output dir
    os.makedirs(output_dir, exist_ok=True)

    client = PerplexityClient()
    affected_dirs = set()
    
    # Read Inbox
    lines = await async_read_lines(inbox_file)

    pending_items = [line for line in lines if line.strip() and not line.strip().startswith("#")]

    if not pending_items:
        logger.info("📭 Inbox is empty. Nothing to do.")
        return

    logger.info(f"📨 Found {len(pending_items)} items in Inbox. Processing...")
    
    successful_lines = []

    for line in pending_items:
        try:
            await process_topic(client, line, output_dir, affected_dirs)
            successful_lines.append(line)
            # Be nice to the API
            await asyncio.sleep(1)
        except Exception as e:
            logger.error(f"❌ Error processing line '{line.strip()}': {e}")
            # We do NOT add to successful_lines, so it stays in inbox? 
            # Actually process_topic logs error but doesn't throw usually. 
            # If it throws, we keep it in inbox.

    # Smart Index Update
    if affected_dirs:
        logger.info("📑 Updating Directory Indexes...")
        for d in affected_dirs:
            update_category_index(d)

    # Archive & Cleanup
    if successful_lines:
        import datetime
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        
        # Append to Archive
        archive_content = "".join([f"[{timestamp}] {line}" for line in successful_lines])
        await async_write(archive_file, archive_content, mode="a")
        
        # Rewrite Inbox (Keep only what failed/was skipped)
        remaining_lines = [l for l in lines if l not in successful_lines]
        new_inbox_content = "".join(remaining_lines)
        await async_write(inbox_file, new_inbox_content)
            
        logger.info(f"📦 Archived {len(successful_lines)} items. Inbox updated.")

    logger.info("🎉 Bulk Import Cycle Complete!")

if __name__ == "__main__":
    asyncio.run(main())
