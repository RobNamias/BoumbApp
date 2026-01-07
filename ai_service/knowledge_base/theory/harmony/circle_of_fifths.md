# Circle of Fifths

> Source: Perplexity Sonar | Batch Import | Category: theory

The phrase “Circle of Fifths” names a theoretical map of key/ chord relationships — it is not a musical genre with its own grooves — so I’ll translate how composers and arrangers use motion around the circle into precise, sequencer-friendly instructions for: 1) rhythmic behavior (16th-note grid), 2) harmonic/scalar content, 3) instrumental role patterns (kick/snare/bass etc.), and 4) velocity ranges. Citations show the theoretical facts about the circle itself where needed.[1][6][3]

1) Rhythm & Groove (16th‑note grid — syncopation and swing)
- Core statement: Use a steady 16th‑note grid as the reference; apply syncopation by delaying or accenting off‑beats that outline harmonic changes (roots/guide‑tones) when you move around adjacent fifths[1][5].  
- Typical 16th patterns:
  - Straight (no swing): 1 e & a | 2 e & a | — place primary chord/root attacks on beat 1 and the “&” of 2 to imply forward motion toward the next fifth.  
  - Syncopated fill (common): place accents on the “&” of 1 and the “e” of 2 (i.e., 1 & / e & ), giving rhythmic push toward harmonic resolution on the downbeat that follows.  
  - Circular propulsion pattern (to imply movement around the circle): root on downbeat, short staccato on the “&” (16th), then anticipation accents on the “a” (16th) of the preceding bar to imply leading into the next key.  
- Swing: apply a triplet subdivision where the first 16th pair is lengthened ≈2:1 (swing ratio ~2:1 to 1.8:1 depending on tempo) to any pair of 16ths on beats where a dominant → tonic motion occurs (emphasizes functional resolution expected in circle‑based progressions)[1][6].  
- Quantize/liveness:
  - Keep primary harmonic hits tightly quantized (0–10 ms jitter) to preserve sense of harmonic goal.  
  - Move ghost notes/percussive 16ths ±10–40 ms behind the grid to create laid‑back syncopation when resolving along the circle.

2) Harmony & Scales (names, intervals, and functional movement)
- Core statement: The circle orders keys by perfect fifths; progressions commonly move by descending fifths / ascending fourths (V → I motion and closely related keys differ by one sharp/flat)[1][6].  
- Intervals and functional motions:
  - Perfect fifth (P5) = 7 semitones; moving clockwise adds a sharp, counterclockwise adds a flat[1][6].  
  - Functional progression commonly used: ii → V → I (dominant motion is a descending fifth / ascending fourth), or sequences of root movement by descending fifths for cadential drive[1][2][5].  
- Scales to use over motions around the circle:
  - Over tonic (I): Major scale (Ionian) — intervals: 1, 2, 3, 4, 5, 6, 7.  
  - Over dominant (V): Mixolydian (for dominant seventh without raised 7) — intervals: 1, 2, 3, 4, 5, 6, b7.  
  - For ii (minor): Dorian or natural minor (depending on context) — Dorian intervals: 1, 2, b3, 4, 5, 6, b7.  
  - For minor key circle motion: natural minor (Aeolian) on tonic; harmonic minor over V when a strong dominant is required (raise 7) — harmonic minor intervals: 1, 2, b3, 4, 5, b6, 7.  
  - Tritone substitutions and chromatic approaches: use altered dominant scales (half‑whole diminished, altered scale / Superlocrian) when replacing a V with a tritone substitute — keep core tritone (3 and b7) intact to preserve dominant function[4].  
- Practical mapping for sequencer:
  - When moving one step clockwise (e.g., C → G), transpose harmonic instruments up 7 semitones; when moving CCW transpose down 7 semitones[1][3].  
  - For smooth voice‑leading, move guide‑tones (3rd and 7th of the chord) by minimal semitone steps when stepping around the circle.

3) Typical Instruments & Patterns (roles with precise 16th‑note behavior)
- Core statement: Instruments are assigned functional roles: harmonic movers (keys/guitar/pads), bass (root motion and approach notes), and rhythm section (kick/snare/percussion) that accentuates circle‑based resolutions.  
- Bass (electric/acoustic synth bass):
  - Role: state the root on downbeats; play connecting approach 16th notes (chromatic or diatonic passing tones) leading into the next root a 16th or 8th before the bar where the chord changes.  
  - Pattern examples (16th grid):
    - Root on 1, 16th passing on “&” of 1, tie on “e” and “&” of 2, new root on 3 (simple).  
    - Walking approach for descent by fifth: root on 1, approach on the “a” (16th) of preceding bar (anticipation), or run 4×16ths connecting old root → new root.  
- Kick:
  - Role: mark primary metric pulses and strong harmonic arrivals (I or tonic points).  
  - Pattern: kicks on 1 and the “&” of 3 (or 1 and 3) with occasional syncopated 16th kick on the “&” before a resolution to emphasize the next chord. Keep transient attack sharp (short decay) to preserve clarity.  
- Snare / Claps:
  - Role: backbeat and secondary harmonic punctuation.  
  - Pattern: snare on 2 and 4 standard; add ghost snare 16ths on the “e” of 2 or “a” of 3 to emphasize approach into a circle movement. Use lower velocity ghost snares for swing/groove.  
- Hi‑hat / Ride:
  - Role: subdivide 16ths, show swing or straight feel.  
  - Pattern: steady 16ths open hi‑hat accents on the “&” of 2 and “&” of 4 to push toward next chord change; in swing, use triplet swing on every pair of 16ths.  
- Chordal instruments (piano, guitar, pads):
  - Role: outline root and guide‑tones; use stabs on downbeats and tight 16th rhythmic comping for motion around the circle.  
  - Pattern: play chord stabs on 1 (full voicing), then 2×16th guide‑tone hits on the “&” and “a” as approach into the next chord. For voice‑leading, keep inner voices to 16th or 8th step motion.
- Example concise 2‑bar sequencing pattern (16ths):
  - Bar A: Kick(1), Snare(2), Kick(&3), Snare(4); Bass root(1), bass pass(&) → chord I on 1; Comp chords: stab on 1, guide‑tone on & and a.
  - Bar B (next chord a fifth away): anticipate new root on a (16th) of bar A, new root on 1 of Bar B; percussion accents on that anticipation.

4) Velocity / Dynamic ranges (sequencer values)
- Core statement: Map musical dynamic function to MIDI velocity ranges and apply micro‑dynamics per role for clarity of harmonic motion.  
- Recommended MIDI velocity zones (0–127):
  - Primary harmonic hits (tonic arrival, dominant resolution): 100–127 (accented).  
  - Regular chord comping & root notes: 80–100 (medium).  
  - Bass: 90–115 for presence; reduce to 70–85 for background passages.  
  - Kick: 100–127 for downbeat impact; 80–100 for secondary kicks.  
  - Snare (backbeat): 100–120 for main hits; ghost snares 35–70.  
  - Hi‑hat/ride: 50–95 — open hat accents 95–115 briefly.  
  - Pads/strings (sustains): 50–90 — raise to 100–110 only for swell on arrival points.  
- Dynamic programming tips:
  - Use velocity layering: map 2–3 samples per instrument with crossfades starting at 70 and 100 velocities to avoid abrupt timbral jumps.  
  - Automate small velocity variations ±5–12 across repeated 16ths to emulate humanization without losing harmonic clarity.  
  - When a chord progression moves around the circle for a cadence, raise velocities of guide‑tones and bass by +8–20 to signal resolution.

Limitations and concise mapping note
- The Circle of Fifths is a theoretical diagram organizing keys and typical functional motion; the rhythmic, instrumental, and velocity mappings above are prescriptive choices for sequencer implementation that exploit common harmonic behaviors described by the circle (V→I motion, adjacent keys differ by one accidental)[1][6][5]. Use the harmonic rules (root movement by P5, voice‑leading of 3rds/7ths) to place guide‑tone notes on the rhythmic accents specified above for clear functional sequencing[4][2].