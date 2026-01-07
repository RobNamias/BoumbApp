import os
import logging
from typing import Optional

logger = logging.getLogger("RAG-Loader")

class RagLoader:
    """
    Simple file-based retrieval for the 'Hybrid RAG' architecture.
    Reads markdown files from the knowledge base.
    """
    def __init__(self, knowledge_dir: str = "knowledge_base"):
        # Resolve absolute path relative to the service root if needed
        self.knowledge_dir = knowledge_dir
        if not os.path.exists(self.knowledge_dir):
            logger.warning(f"Knowledge dir not found: {self.knowledge_dir}")

    def find_context(self, query: str) -> Optional[str]:
        """
        Recursive implementation:
        1. Checks if a file exactly matches the query.
        2. Scans all files in all subdirs (styles, theory...) for fuzzy match.
        """
        if not os.path.exists(self.knowledge_dir):
            return None

        normalized_query = query.lower().replace("_", " ")
        query_words = set(normalized_query.split())
        
        best_match = None
        best_score = 0

        # Walk through all directories
        for root, dirs, files in os.walk(self.knowledge_dir):
            for filename in files:
                if not filename.endswith(".md") or filename == "index.md" or filename == "glossaire.md":
                    continue
                
                
                score = self._calculate_match_score(filename, query_words)
                
                if score > best_score:
                    best_score = score
                    best_match = os.path.join(root, filename)
                    if score >= 1.0:
                         break 

        if best_match and best_score > 0.3: # Threshold
            logger.info(f"📚 RAG Hit (Score {best_score:.2f}): {os.path.basename(best_match)}")
            return self._read_file(best_match)
        
        logger.info(f"🕸️ RAG Miss for: '{query}'")
        return None

    def _calculate_match_score(self, filename: str, query_words: set) -> float:
        """
        Calculates a simple overlap score between filename keywords and query words.
        """
        # Cleanup filename to words
        topic_name = filename.replace(".md", "").replace("_", " ")
        topic_words = set(topic_name.split())
        
        if not topic_words:
            return 0.0

        # Intersection: How many topic words are in the query?
        intersection = query_words.intersection(topic_words)
        
        if not intersection:
            return 0.0

        # Score = Matches / Total Topic Words
        # "Acid Techno" (2 words) matched by "Acid" -> 0.5
        # "Acid" (1 word) matched by "Acid" -> 1.0
        return len(intersection) / len(topic_words)

    def _read_file(self, path: str) -> Optional[str]:
        try:
            with open(path, "r", encoding="utf-8") as f:
                return f.read()
        except Exception as e:
            logger.error(f"Failed to read knowledge file {path}: {e}")
            return None
