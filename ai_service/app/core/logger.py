
import csv
import os
import json
from datetime import datetime
import logging

# Standard Python logger for application events (startup, errors)
app_logger = logging.getLogger("boumbapp.core")

class DualLogger:
    """
    Handles separate logging streams:
    1. Audit Log (CSV): High-level metrics for Production/Monitoring.
    2. Debug Log (JSONL): Full request/response traces for Development.
    """
    def __init__(self, log_dir="app/logs"):
        self.log_dir = log_dir
        self.audit_file = os.path.join(log_dir, "audit.csv")
        self.trace_file = os.path.join(log_dir, "trace.jsonl")
        self._ensure_paths()

    def _ensure_paths(self):
        os.makedirs(self.log_dir, exist_ok=True)
        
        # Init Audit CSV with Headers if new
        if not os.path.exists(self.audit_file):
            with open(self.audit_file, mode='w', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow(["Timestamp", "RequestID", "Prompt", "Status", "Duration", "Model", "NotesCount"])

    def log_audit(self, request_id: str, prompt: str, status: str, duration: float, model: str, notes_count: int):
        """Write kpi metrics to CSV"""
        try:
            timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            with open(self.audit_file, mode='a', newline='', encoding='utf-8') as f:
                writer = csv.writer(f)
                writer.writerow([timestamp, request_id, prompt, status, round(duration, 3), model, notes_count])
        except Exception as e:
            app_logger.error(f"Audit Log Failed: {e}")

    def log_trace(self, request_id: str, details: dict):
        """Write full debug payload to JSONL"""
        try:
            payload = {
                "timestamp": datetime.now().isoformat(),
                "request_id": request_id,
                **details
            }
            with open(self.trace_file, mode='a', encoding='utf-8') as f:
                f.write(json.dumps(payload) + "\n")
        except Exception as e:
            app_logger.error(f"Trace Log Failed: {e}")

    def add_user_feedback(self, request_id: str, rating: int, comment: str):
        """Append feedback to a separate feedback log or update audit (Complex for CSV, appending to feedback file is safer)"""
        # For simplicity in V2, we append to a dedicated feedback file
        feedback_file = os.path.join(self.log_dir, "feedback.csv")
        is_new = not os.path.exists(feedback_file)
        
        with open(feedback_file, mode='a', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            if is_new:
                writer.writerow(["Timestamp", "RequestID", "Rating", "Comment"])
            
            writer.writerow([datetime.now().isoformat(), request_id, rating, comment])
