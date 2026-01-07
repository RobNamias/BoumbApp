
import logging
import time
from fastapi import APIRouter
from app.models.requests import GenerateRequest, GenerationParams
from app.models.responses import GenerateResponse
from app.services.prompt_analyzer import PromptAnalyzer
from app.services.theory_service import MusicTheoryService
from app.services.prompt_factory import PromptFactory
from app.services.llm_service import LLMService
from app.core.logger import DualLogger
from app.services.magenta_service import MagentaService


logger = logging.getLogger(__name__)
router = APIRouter()

llm = LLMService() 
analyzer = PromptAnalyzer(llm_service=llm)
theory = MusicTheoryService()
factory = PromptFactory()
logger_service = DualLogger()

def _parse_notes_from_response(llm_response) -> list:
    """Parse notes from LLM response (List or Dict support)."""
    if isinstance(llm_response, list):
        logger.info(f"LLM returned a LIST of {len(llm_response)} items.")
        return llm_response
    elif isinstance(llm_response, dict):
        if "notes" in llm_response:
             logger.info("LLM returned a DICT with 'notes' key.")
             return llm_response["notes"]
        elif "melody" in llm_response:
             logger.info("LLM returned a DICT with 'melody' key.")
             return llm_response["melody"]
        else:
             # NEW: Handle Dict-Map (keys are indices/times) e.g. {"0": {...}, "4": {...}}
             keys = list(llm_response.keys())
             # Check if keys are digits (stringified ints)
             if len(keys) > 0 and all(str(k).isdigit() for k in keys):
                 logger.info(f"LLM returned a Dict-Map with numeric keys ({keys[:5]}...). Extracting values.")
                 return list(llm_response.values())

             logger.warning(f"LLM returned a DICT without known keys: {keys}")
             # Check if it looks like a note
             if "pitch" in llm_response and "start" in llm_response:
                  return [llm_response]
    else:
        logger.error(f"LLM returned unknown type: {type(llm_response)}")
    return []

import music21

def _sanitize_and_validate_notes(raw_notes: list, valid_pitches: list, params: GenerationParams) -> list:
    """Sanitize note properties and filter invalid pitches using MIDI comparison."""
    validated = []
    
    # Pre-calculate valid MIDI numbers to handle enharmonics (Eb vs D#)
    valid_midis = set()
    for p_str in valid_pitches:
        try:
            n = music21.note.Note(p_str)
            valid_midis.add(n.pitch.midi)
        except:
            pass
            
    for n in raw_notes:
        # Sanitize Start Time (Wrap to 32 steps)
        if "start" in n:
             original = n["start"]
             SAFE_START = 0
             try:
                 SAFE_START = int(original)
             except: pass
                 
             n["start"] = SAFE_START % 32
             if n["start"] != original:
                 pass # Squelch warning for brevity
         
        # Sanitize Duration (Min 1)
        if "duration" in n:
             try:
                n["duration"] = max(1, int(n["duration"]))
             except: n["duration"] = 1
        
        # Validate Pitch (Robust MIDI check + Octave Correction)
        if "pitch" in n:
            p_str = n["pitch"]
            try:
                candidate = music21.note.Note(p_str)
                cand_midi = candidate.pitch.midi
                
                if cand_midi in valid_midis:
                    validated.append(n)
                else:
                    # Attempt Octave Correction
                    # Check if pitch class is valid (e.g. F is allowed, regardless of octave)
                    # We need to know permissible PCs from valid_midis
                    allowed_pcs = {m % 12 for m in valid_midis}
                    if cand_midi % 12 in allowed_pcs:
                        # Find nearest valid MIDI
                        # precise match for PC? 
                        # We want the valid_midi with same PC that is closest to cand_midi
                        same_pc_valid_midis = [m for m in valid_midis if m % 12 == cand_midi % 12]
                        if same_pc_valid_midis:
                           # Pick closest
                           best_match = min(same_pc_valid_midis, key=lambda m: abs(m - cand_midi))
                           shift = best_match - cand_midi
                           
                           # Apply shift
                           new_note_obj = music21.note.Note(candidate.pitch) # Copy
                           new_note_obj.pitch.midi = best_match
                           
                           # Update note
                           n["pitch"] = new_note_obj.nameWithOctave
                           logger.warning(f"Auto-Corrected Octave: {p_str} -> {n['pitch']}")
                           validated.append(n)
                        else:
                            logger.warning(f"Dropped note {p_str} (Invalid Pitch Class)")
                    else:
                        logger.warning(f"Dropped note {p_str} (MIDI {cand_midi} not in allowed)")
            except Exception as e:
                logger.warning(f"Invalid pitch string: {p_str} ({e})")
                
    return validated

@router.post("/generate", response_model=GenerateResponse)
async def generate_melody(request: GenerateRequest):
    start_time = time.time()
    
    # 0. Service Init
    magenta = MagentaService()

    # 1. Analyze Intent
    if request.options:
        params = request.options
    else:
        params = await analyzer.analyze_intent(request.prompt, request.global_key)
    
    params.bpm = request.bpm
    logger.info(f"ANALYZED PARAMS: {params}")

    # 2. Theory (Get Valid Notes)
    scale_notes = theory.get_scale_notes(params.root, params.scale_type)
    valid_pitches = theory.get_valid_pitches(scale_notes, params.octave_range[0], params.octave_range[1])
    
    # 3. Primer Generation (LLM)
    # We ask LLM for a small seed (4-8 notes) instead of full melody
    primer_prompt = factory.build_primer_prompt(params, valid_pitches, request.prompt)
    
    logger.info(f"Generating Primer (LLM): Prompt='{request.prompt}'")
    
    try:
        # LLM Call
        llm_response = await llm.generate(primer_prompt, f"Context: {params.root} {params.scale_type} {params.bpm}BPM. Request: {request.prompt}")
        raw_primer = _parse_notes_from_response(llm_response)
        
        # Validate Primer
        validated_primer = _sanitize_and_validate_notes(raw_primer, valid_pitches, params)
        if not validated_primer:
            logger.warning("LLM Primer Failed/Empty. Using fallback C3.")
            validated_primer = [{"pitch": f"{params.root}3", "start": 0, "duration": 4, "velocity": 80}]

        # 4. Magenta Generation (Continuation)
        logger.info(f"Extending Primer with Magenta ({len(validated_primer)} notes)...")
        
        # Convert List[Dict] to format expected by MagentaService
        seconds_per_step = 60.0 / params.bpm / 4.0
        
        formatted_primer = []
        for n in validated_primer:
            try:
                # Resolve Pitch String to MIDI
                pObject = music21.note.Note(n["pitch"])
                midi_val = pObject.pitch.midi
                
                # Normalize Primer: Ensure it starts at 0
                # Find minimum start step
                min_start_step = min([int(n.get("start", 0)) for n in validated_primer], default=0)
                
                # Sanitize start/duration if missing
                SAFE_START = 0
                try: SAFE_START = int(n.get("start", 0)) - min_start_step # Shift
                except: pass
                
                SAFE_DUR = 1
                try: SAFE_DUR = int(n.get("duration", 1))
                except: pass

                start_s = float(SAFE_START) * seconds_per_step
                dur_s = float(SAFE_DUR) * seconds_per_step
                end_s = start_s + dur_s
                
                formatted_primer.append({
                    "pitch": midi_val,
                    "startTime": start_s,
                    "endTime": end_s,
                    "velocity": int(n.get("velocity", 80))
                })
            except Exception as e:
                logger.warning(f"Skipping primer note {n}: {e}")

        # Call Magenta
        magenta_result = magenta.generate_melody(
            primer_notes=formatted_primer,
            total_steps=32, # 2 bars of 16th notes
            temperature=1.0 
        )
        
        # 5. Convert Back (Seconds -> Steps)
        final_notes = []
        for n in magenta_result["notes"]:
            # Quantize to nearest 1/16th step
            start_step = round(n["startTime"] / seconds_per_step)
            end_step = round(n["endTime"] / seconds_per_step)
            duration_step = max(1, end_step - start_step)
            
            # Convert MIDI to Pitch String (e.g. 60 -> C4)
            pName = music21.note.Note(n["pitch"]).nameWithOctave
            
            final_notes.append({
                "pitch": pName,
                "start": start_step,
                "duration": duration_step,
                "velocity": n["velocity"]
            })
        
        # Strict Clamp: Remove notes that start >= 32
        final_notes = [n for n in final_notes if n["start"] < 32]
        
        # Clip duration for notes that wrap over 32
        for n in final_notes:
            if n["start"] + n["duration"] > 32:
                 n["duration"] = 32 - n["start"]
            
        validated_count = len(final_notes)
        logger.info(f"Magenta generated {validated_count} notes.")

        response = GenerateResponse(
            request_id="mag-gen-" + str(int(time.time())), 
            notes=final_notes,
            analysis=params
        )

         # LOGGING (Simplified)
        # LOGGING (Dual Strategy)
        duration = time.time() - start_time
        try:
             # 1. Audit Log (Prod)
             logger_service.log_audit(
                 request_id=response.request_id,
                 prompt=request.prompt,
                 status="SUCCESS",
                 duration=duration,
                 model="qwen-magenta-hybrid",
                 notes_count=validated_count
             )
             
             # 2. Trace Log (Debug)
             logger_service.log_trace(
                 request_id=response.request_id,
                 details={
                     "prompt": request.prompt,
                     "context": params.model_dump(),
                     "primer_prompt": primer_prompt,
                     "llm_response_raw": llm_response if 'llm_response' in locals() else "N/A",
                     "magenta_output_count": validated_count
                 }
             )
        except Exception as e:
            logger.error(f"Logging Failed: {e}")

        return response

    except Exception as e:
        logger.error(f"Orchestration Failed: {str(e)}")
        raise e

