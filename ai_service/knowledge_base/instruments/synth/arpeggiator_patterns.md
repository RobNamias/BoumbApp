# Arpeggiator Patterns

> Source: Perplexity Sonar | Batch Import | Category: instruments

Arpeggiator patterns are sequences that play chord tones as repeating rhythmic lines; below are concise, sequencer-ready descriptions for each requested category.

1) Rhythm & Groove (Syncopation, Swing)
- Basic grid: arpeggiators commonly run on 16th-note subdivisions (1/16) or faster (1/32) for “machine‑gun” feels; slower rates (1/8, dotted 1/8) produce more spacious arps[1][2].[1]  
- Typical step lengths: 4‑, 8‑ or 16‑step patterns map directly to 16th‑note grids (4 steps = quarter‑note cycle, 16 steps = one bar of 4/4 at 16ths)[4][7].[4]  
- Syncopation: create off‑beat emphasis by shifting which chord tones fall on the downbeat vs. the 2nd/4th 16th (e.g., accent on the 3rd or 5th 16th gives backbeat‑like syncopation); use uneven step‑placement or skipped steps to produce displaced accents[1][4].[1]  
- Polyrhythms: run two arps at different step counts or rates (e.g., 7 steps against 8, or 1/16 vs 1/12 feel via triplet divisions) to produce cross‑rhythms[4][5].[4]  
- Swing: apply a swing/quantize that delays every 2nd 16th (triplet swing) to push the “&” (second 16th in pair) later by a percentage (typ. 55–75% swing) for a humanized groove; many arpeggiators expose a swing knob or triplet rate option[1][2].[2]

2) Harmony & Scales
- Input model: arpeggiators output the individual notes of an input chord (triad, seventh, sus, extended chords) in user‑defined orders (up, down, up/down, as‑played, random)[2][1].[2]  
- Common scale/interval sets: major (1–3–5), minor (1–b3–5), dominant 7 (1–3–5–b7), major/minor 7, sus2/sus4, and modal (Dorian, Mixolydian) are used to keep arp lines diatonic to the progression[3][1].[3]  
- Extended/altered colors: include 9ths/11ths/13ths by voicing those intervals into the chord before arpeggiation; octave spread (±1–3 octaves) increases melodic range and harmonic density[1][2].[1]  
- Pattern orders: ascending emphasizes tension build, descending emphasizes release; broken and skipping patterns (e.g., 1–5–3–1) and randomized or “as‑played” orders alter implied harmony and melodic contour[2][3].[2]

3) Typical Instruments & Patterns (Kick, Snare, Bass)
- Role separation: arpeggiators typically occupy the melodic/harmonic rhythmic role (high‑mid frequency synths, plucks, bells, arps) while drums (kick, snare) and bass provide low‑end rhythmic/harmonic grounding[4][1].[4]  
- Kick placement: standard 4/4 pattern places kick on 1 and 3 (or 1, 1.5, 2.5 etc. for house/techno); align or offset arp root hits with kicks to reinforce pulse or deliberately avoid kicks to create counterpoint[4].[4]  
- Snare/clap placement: snare/clap on 2 and 4 is common; place arp strong beats between snares for forward motion or let arp reinforce snare hits for punchy stabs[4].[4]  
- Bass interaction: basslines either follow the arp’s root notes (lock to root on downbeats) or outline complementary rhythms (sparse 16th‑note bass stabs on offbeats) — choose one to avoid low‑frequency masking[4][1].[1]  
- Typical arp instrument choices: bright pluck/lead synths, digital bell/metallic timbres, plucked electric/hybrid patches, and layered pad + sequenced pluck stacks for stereo width[1][5].[1]  
- Pattern examples (16th grid notation; X = note on):  
  - “Straight up” 4‑step (one bar = repeat): X . . . | X . . . | X . . . | X . . . (notes on beats 1,2,3,4).[2][2]  
  - “Machine‑gun” 16th run: X X X X | X X X X | X X X X | X X X X (continuous 16ths)[1][1]  
  - Syncopated: X . X . | . X . X | X . X . | . X . X (accents on 1, 1.5, 2.5, etc.)[1][4]  
  - Triplet/swing feel: use 1/8 triplet division or swing to transform pairs of 16ths into long–short within the 16th grid[2][1]

4) Velocity dynamic range
- Typical MIDI velocity ranges for arpeggiators: 20–100 (out of 127) is common; map velocity to note amplitude, filter cutoff, or envelope attack for expressive variation[5][1].[5]  
- Static vs. dynamic: fixed‑velocity arps (single velocity value) produce mechanical consistency; use velocity randomness/spread or step‑velocity lanes to create micro‑dynamics and prevent fatigue[5][1].[5]  
- Recommended settings (practical sequencer targets):  
  - Lead/bright arp: base velocity 80–110 with ±10–20 randomization to keep presence without clipping.  
  - Textural/ambient arp: base 30–70 with slow velocity LFO or note‑gate envelopes for clouded dynamics.  
  - Percussive pluck arp: higher velocity on strong beats (90–127) and lower on passing 16ths (30–70) to mimic accent patterns.  
- Velocity mapping: route velocity to filter cutoff for timbral accents and to amplitude for loudness accents; combine with gate length variation for perceived dynamic contrast[1][5].[1]

If you want, I can convert any of the above pattern examples into explicit MIDI step lists (16‑step arrays of pitch, gate length, velocity) tailored to a chosen scale and tempo.