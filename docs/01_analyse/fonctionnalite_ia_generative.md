# Fonctionnalité : Génération de Mélodies par IA (Prompt-to-MIDI)

## 1. Description

Cette fonctionnalité permet à l'utilisateur de générer des séquences musicales (mélodies, lignes de basse) pour les synthétiseurs en décrivant son intention en langage naturel (ex: "Une basse funky rapide en Do mineur").

## 2. Architecture Technique

### 2.1 Flux de Données

### 2.1 Flux de Données (Architecture V2 - Direct)

1.  **Frontend (React)** :
    *   Interface utilisateur : `AIPrompt` (Input + Badges BPM/Key).
    *   Envoi direct de la requête à l'API Python (`POST /api/v1/generate`).
2.  **Service IA (Python FastAPI)** :
    *   **PromptAnalyzer** : Analyse l'intention (Mood -> Mode) et fusionne avec la `GlobalKey` du projet.
    *   **MusicTheoryService (Music21)** : Calcule les notes valides (Gamme, Accords) pour contraindre l'IA.
    *   **PromptFactory** : Construit un *System Prompt* strict avec les contraintes théoriques.
    *   **LLM (Ollama)** : Génère le pattern rythmique/mélodique (JSON).
    *   **Validation** : Vérifie la structure et la cohérence musicale.
3.  **Frontend (Playback)** :
    *   Reçoit la séquence (`GenerateResponse`).
    *   Met à jour le Store (`setClip`).
    *   Feedback visuel immédiat sur le Piano Roll.

### 2.2 Format de Données (Contrat JSON)
L'API renvoie une séquence unique validée et les métadonnées de l'analyse.

```json
{
  "request_id": "uuid-1234",
  "analysis": {
    "root": "C",
    "scale_type": "Minor",
    "bpm": 120
  },
  "notes": [
    { "start": 0, "duration": 4, "pitch": "C3", "velocity": 100 },
    { "start": 4, "duration": 4, "pitch": "Eb3", "velocity": 90 }
    // ... 32 steps max
  ]
}
```

*   **analysis** : Contexte musical utilisé (déduit ou forcé).
*   **notes** : Tableau des événements MIDI.
    *   **start** : Position en 16èmes de double-croche (Steps 0-31).
    *   **duration** : Durée en steps.
    *   **pitch** : Note standard (Scientific Pitch Notation).

### 2.3 Moteur Hybride
Le système utilise une approche hybride pour garantir la musicalité :
*   **Music21 (Python)** : "Cerveau Gauche" (Théorie, Règles, Gammes, Justesse).
*   **LLM (Ollama/Mistral)** : "Cerveau Droit" (Créativité, Rythme, Variation, Style).

### 2.4 Stack Technique
*   **Moteur IA** : **Ollama** (Local) - Modèle `qwen2.5` ou `mistral`.
*   **Backend IA** : **FastAPI (Python 3.11)** + Pydantic + Music21.
*   **Frontend** : React + Zustand + `aiService` (Fetch).

### 2.5 Pré-requis Techniques (Ollama)
> [!IMPORTANT]
> Pour que le conteneur Docker puisse contacter Ollama sur l'hôte, Ollama doit écouter sur toutes les interfaces :
> **Windows/Mac/Linux** : Lancez Ollama avec `OLLAMA_HOST=0.0.0.0 ollama serve`.
> Par défaut, Ollama n'écoute que sur `127.0.0.1`, ce qui bloque l'accès depuis Docker (`host.docker.internal`).

### 2.6 Mécanismes de Sécurité & Validation
Afin de garantir la cohérence des données générées, plusieurs couches de validation sont appliquées :
1.  **Strict Prompt Constraints** : Le prompt system interdit explicitement l'utilisation de l'index "32" (hors limite).
2.  **Modulo-32 Wrap** : Si l'IA génère malgré tout un `start` >= 32, il est modulo-isé (`start % 32`) pour assurer une boucle valide.
3.  **Strict Pitch Enforcement** : Chaque note générée est vérifiée contre la gamme théorique (`TheoryService`). Toute note hors-gamme est silencieusement rejetée.
4.  **Exceptions Typées** : Gestion centralisée des erreurs via `LLMGenerationError`.

### 2.7 Traçabilité (Logging)
Toutes les transactions sont enregistrées dans un fichier CSV local pour analyse :
*   **Fichier** : `ai_service/app/logs/request_history.csv`
*   **Données** : Timestamp, RequestID, Prompt, Context (BPM/Key), SystemPrompt, ResponseJSON, Durée.
*   **Utilisation** : Permet de debugger les performances (durée de génération) et la qualité (hallucinations).
