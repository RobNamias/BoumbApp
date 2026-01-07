
import requests
import json
import time

# Configuration
API_URL = "http://localhost:8002/api/v1/generate"

def test_smart_intent_analysis():
    """
    Verifies that the API correctly identifies 'Japanese' style => 'Hirajoshi' scale
    and overrides the default Major scale.
    """
    print("--- [TEST] Smart Intent Analysis (Style Override) ---")
    
    payload = {
        "prompt": "Authentic Japanese traditional melody koto style",
        "bpm": 80,
        "global_key": {"root": "C", "scale": "Major"} # Context says Major
    }
    
    start = time.time()
    try:
        print(f"Sending Probe: {json.dumps(payload)}")
        response = requests.post(API_URL, json=payload, timeout=60)
        duration = time.time() - start
        
        if response.status_code == 200:
            data = response.json()
            analysis = data.get("analysis", {})
            notes = data.get("notes", [])
            
            print(f"Response ({round(duration,2)}s): OK")
            print(f"Detected Scale: {analysis.get('scale_type')}")
            print(f"Detected Root: {analysis.get('root')}")
            print(f"Notes Generated: {len(notes)}")
            
            # Assertion: Smart Override
            # Qwen 3B should detect 'Japanese' -> 'Hirajoshi' (or possibly Insen/Iwato)
            # It should NOT be 'Major'
            scale = analysis.get('scale_type', '').lower()
            if "hirajoshi" in scale or "insen" in scale or "iwato" in scale:
                print("✅ PASS: Smart Override Successful (Exotic Scale Detected)")
            elif "major" in scale:
                print("❌ FAIL: Still using Global Key (Major). Smart Override failed.")
            else:
                print(f"⚠️ WARN: Generated scale '{scale}' (Acceptable if plausible)")

            # Assertion: Melody Content
            if len(notes) >= 16:
                 print("✅ PASS: Melody Length OK")
            else:
                 print("❌ FAIL: Melody too short")

        else:
            print(f"❌ FAIL: API Error {response.status_code}")
            print(response.text)

    except Exception as e:
        print(f"❌ CRITICAL: Test Failed to Connect - {e}")

if __name__ == "__main__":
    test_smart_intent_analysis()
