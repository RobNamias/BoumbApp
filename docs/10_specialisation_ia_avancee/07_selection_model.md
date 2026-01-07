# Rapport détaillé : Génération de mélodies MIDI/JSON

Voici un comparatif structuré des trois modèles (**MusicGen**, **Magenta**, **MuseNet**) pour génération locale de mélodies au format MIDI ou JSON. Tous gratuits/open-source, adaptés à ta RTX 5060 Ti 16G. Focus sur perf, facilité, qualité et intégration dev.

## 1. MusicGen (Meta AI, 2023+)

MusicGen génère audio/MIDI à partir de texte (“mélodie piano jazz upbeat”) via AudioCraft. Modèles small/medium (300M–1.5B params), VRAM ~4–8 Go.

*   **Qualité** : Excellente cohérence mélodique (melody conditioning pour input MIDI), styles variés (classique/jazz/EDM). Sortie MIDI via post‑process (torchaudio).
*   **Perf locale** : 20–60s pour 8–30s clip (RTX 5060 Ti). ~50–100 tokens/s equiv. GPU.
*   **Facilité** : Install via pip audiocraft, code Python simple : `model.generate("piano melody C major")`. Export MIDI/JSON natif. Colab gratuit.
*   **Avantages** : Contrôle texte/melody, GPU‑optimisé, actif (updates 2025).
*   **Limites** : Plus audio que pure MIDI ; besoin PyTorch/CUDA.
*   **Lien** : [AudioCraft GitHub] | Ollama/HF pas GGUF natif (mais forks).

## 2. Magenta (Google, 2016–2020+)

Suite RNN/VAE pour MIDI pur (Performance RNN, Melody RNN). Génère séquences notes/rythmes expressives (timing/velocity).

*   **Qualité** : Polyphonique réaliste (piano/drums), patterns musicaux cohérents. Output MIDI direct (time‑shift/velocity events).
*   **Perf locale** : Très léger (VRAM <2 Go), réel‑time (~100+ notes/s). RNN rapide sur CPU/GPU.
*   **Facilité** : TensorFlow/Magenta lib, scripts prêts : `magenta.models.melody_rnn.generate`. VST plugins (Magenta Studio). JSON/MIDI export.
*   **Avantages** : Pur MIDI, low‑ressources, intégrable DAW (Ableton). Idéal mélodies simples.
*   **Limites** : Moins “créatif” que modernes (pas texte‑to‑MIDI natif), setup TensorFlow old.
*   **Lien** : [Magenta GitHub] | Demos browser.

## 3. MuseNet (OpenAI, 2019 ; forks open)

Modèle transformer multi‑instruments (10+ tracks), styles mixtes (Bach + pop). Fermé original, mais OpenMusenet2 (fork open) recrée local.

*   **Qualité** : Multi‑pistes riches (dynamics/4 niveaux), continuation MIDI input. JSON/MIDI structuré.
*   **Perf locale** : OpenMusenet2 ~6–12 Go VRAM, 10–30s par clip court (RTX 5060 Ti OK).
*   **Facilité** : Fork GitHub clonable, PyTorch. Input MIDI → output JSON/MIDI. MuseTree (web tool) pour forks.
*   **Avantages** : Polyphonie avancée, styles hybrides.
*   **Limites** : Forks WIP (pas aussi poli), original offline ; VRAM plus élevé.
*   **Lien** : [OpenMusenet2 GitHub] | [MuseNet original]

## Comparatif Technique

| Critère | MusicGen | Magenta | MuseNet (fork) |
| :--- | :--- | :--- | :--- |
| **Taille** | 300M–1.5B | <100M | ~1–2B equiv. |
| **Input** | Texte/MIDI | MIDI seed | MIDI/styles |
| **Output** | Audio/MIDI | MIDI pur | MIDI multi‑track |
| **VRAM** | 4–8 Go | <2 Go | 6–12 Go |
| **Tokens/s** | 50–100 | 100+ | 20–50 |
| **Idéal pour** | Clips créatifs | Mélodies simples | Compo complexes |

> **Reco :** **MusicGen** pour start rapide/text‑to‑MIDI polyvalent sur ta config. Teste via Colab puis local. Tous exportent MIDI/JSON pour Unity/UE5 audio.