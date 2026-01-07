# Spécialisation IA : Le Fine-Tuning (Modèle Spécialiste)

**Statut** : Vision Long Terme (P3)
**Complexité** : Élevée (Data Engineering + Training)
**Gain** : Performance & Qualité Absolue

## 1. Le Principe
Au lieu d'utiliser un modèle généraliste (Mistral, Qwen) qui sait parler anglais, coder en Python et faire des poèmes, et de le *forcer* à faire du JSON musical via un Prompt complexe, on crée notre propre modèle.

On prend un "petit" modèle (SLM - Small Language Model) et on le ré-entraîne massivement pour qu'il ne comprenne qu'une seule langue : le **JSON Musical**.

## 2. Architecture Technique

### Le Dataset (Le Nerf de la Guerre)
Le challenge n'est pas de trouver la musique, mais de la formater.
1.  **Source** : Dataset MAESTRO (Google Magenta) ou LAKH MIDI Dataset. (Des millions de fichiers MIDI).
2.  **ETL (Extract Transform Load)** :
    *   Script Python pour parser les fichiers `.mid`.
    *   Quantization (Alignement sur une grille rythmique).
    *   Conversion en JSON compatible BoumbApp (`{note: "C2", time: "0:0:0"...}`).
    *   Augmentation de données (Transposition dans toutes les tonalités).
3.  **Résultat** : Un fichier `training_data.jsonl` de plusieurs Go.

### L'Entraînement (LoRA)
On utilise la technique **LoRA (Low-Rank Adaptation)** qui permet de fine-tuner un modèle sans ré-entraîner tous les paramètres (coût GPU réduit).
*   **Base Model** : `TinyLlama-1.1B` ou `Qwen-1.5B` (Très légers).
*   **Plateforme** : Google Colab (Gratuit/Pro) ou RunPod (Cloud GPU à la demande).
*   **Format** : Chat (`User: "Basse Funky" -> Assistant: {JSON}`).

## 3. Analyse Avantages / Inconvénients

| Avantages | Inconvénients |
| :--- | :--- |
| **Vitesse Foudroyante** : Plus besoin de prompt système complexe. Le modèle "sait" faire. | **Coût Initial** : Temps humain pour créer le dataset + Coût GPU. |
| **Robustesse** : Le modèle ne fera jamais d'erreur de syntaxe JSON. | **Perte de Polyvalence** : Le modèle ne saura plus rien faire d'autre (chat, explication). |
| **Taille Réduite** : Un modèle 1B spécialisé bat un modèle 7B généraliste. | **Mise à jour** : Si on change le format JSON, il faut tout ré-entraîner. |

## 4. Plan d'Action (Roadmap)
1.  **Phase Exploratoire** : Écrire le convertisseur `MIDI_to_BoumbAppJSON.py`.
2.  **Proof of Concept** : Convertir 100 fichiers MIDI et tester un fine-tuning rapide sur Colab.
3.  **Production** : Entraîner un modèle complet et le publier sur HuggingFace pour l'utiliser dans BoumbApp via Ollama.
