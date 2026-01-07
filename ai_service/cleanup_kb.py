import os
import shutil
import logging
from librarian import update_category_index

# Configure Logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger("KB-Cleanup")

BASE_DIR = "knowledge_base"

# Mapping Rules: (Keyword -> Subfolder)
# Order matters! Specific terms first.
RULES = {
    "styles": [
        ("dubstep", "dubstep"),
        ("trance", "trance"),
        ("trap", "trap"),
        ("reggaeton", "reggaeton"),
        ("house", "house"),
        ("lo-fi", "lofi"),
        ("acid", "acidcore"), # acidcore or techno/acid? Let's go acidcore for now or techno
        ("techno", "techno"),
        ("dnb", "dnb"),
        ("drum_and_bass", "dnb"),
        ("hip_hop", "hiphop"),
        ("hiphop", "hiphop"),
        ("ambient", "ambient"),
    ],
    "instruments": [
        ("piano", "keys"),
        ("keyboard", "keys"),
        ("bass", "bass"),
        ("808", "bass"),
        ("string", "strings"),
        ("drum", "drums"),
        ("hats", "drums"),
        ("arpeggiator", "synth"),
    ],
    "theory": [
        ("blues", "blues"),
        ("dorian", "scales"),
        ("pentatonic", "scales"),
        ("scale", "scales"),
        ("chord", "harmony"),
        ("circle_of_fifths", "harmony"),
    ],
    "synth_settings": [
        ("supersaw", "leads"),
        ("pluck", "leads"),
        ("pad", "pads"),
        ("acid", "bass"),
        ("reese", "bass"),
        ("bass", "bass"),
    ]
}

def cleanup():
    if not os.path.exists(BASE_DIR):
        logger.error(f"Base dir {BASE_DIR} not found.")
        return

    changes_made = False

    for category, mappings in RULES.items():
        cat_path = os.path.join(BASE_DIR, category)
        if not os.path.exists(cat_path):
            continue

        # List files in category root
        files = [f for f in os.listdir(cat_path) if f.endswith(".md") and f != "index.md"]
        
        for filename in files:
            moved = False
            for keyword, subfolder in mappings:
                if keyword in filename:
                    # Move it
                    dest_dir = os.path.join(cat_path, subfolder)
                    if not os.path.exists(dest_dir):
                        os.makedirs(dest_dir)
                        logger.info(f"Created dir: {dest_dir}")
                    
                    src = os.path.join(cat_path, filename)
                    dst = os.path.join(dest_dir, filename)
                    
                    shutil.move(src, dst)
                    logger.info(f"Moved {filename} -> {subfolder}/")
                    moved = True
                    changes_made = True
                    break # Stop after first match
            
            if not moved:
                # Optional: Log files that didn't match any rule
                # logger.warning(f"No rule for: {filename}")
                pass

    if changes_made:
        logger.info("Re-indexing categories...")
        for category in RULES.keys():
            update_category_index(os.path.join(BASE_DIR, category))
    else:
        logger.info("No files needed moving.")

if __name__ == "__main__":
    cleanup()
