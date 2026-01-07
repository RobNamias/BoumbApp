# Spécification API Interne : Service IA (Python)

**Objectif** : Cette API (FastAPI) sert de "Cerveau" intermédiaire. Elle orchestre la communication entre le Frontend, le LLM (Ollama/Qwen) et le moteur de génération musicale (Magenta).

## 1. Endpoints Spécialisés

### 1.1 Génération de Mélodie (Hybrid Orchestrator)
*   **URL** : `POST /api/v1/generate` (Anciennement `/v1/melody`)
*   **Moteur** : Hybride (Qwen "Primer" -> Magenta "Continuation")
*   **Description** : Génère des séquences mélodiques cohérentes de 32 pas (2 mesures).

#### Request
```json
{
  "prompt": "Cyberpunk Acid Bass",
  "bpm": 128,
  "global_key": {
      "root": "C",
      "scale": "minor"
  },
  "options": {
      "temperature": 1.0,
      "density": "high"
  }
}
```

#### Response (Succès 200)
```json
{
  "request_id": "mag-gen-1736068...",
  "notes": [
      { "pitch": "C3", "start": 0, "duration": 2, "velocity": 100 },
      { "pitch": "Eb3", "start": 2, "duration": 2, "velocity": 90 },
      ... (Total ~16-32 notes)
  ],
  "analysis": { ... }
}
```

### 1.2 Génération de Batterie (Drumbox)
*   **URL** : `POST /v1/drums`
*   **Status** : Legacy (LLM Pur) - À migrer vers Magenta Drums plus tard.
*   **Description** : Génère des patterns rythmiques (Kick, Snare, HiHat).

## 2. Logique de "Chain of Thought" (Orchestration)

Pour garantir la qualité musicale, le service utilise une stratégie en deux temps :

1.  **Primer (L'Intention)** :  
    Le service demande à **Qwen** de générer seulement *4 à 8 notes* (un "Seed"). 
    *Prompt*: "Generate a SHORT musical idea (PRIMER)..."

2.  **Continuation (La Musique)** :
    Ce Seed est passé à **Google Magenta (Attention RNN)** qui "écoute" le début et improvise la suite sur 32 temps.

## 3. Communication avec Ollama
Le service Python appelle Ollama sur `http://boumbapp_ai_engine:11434`.
*   **Modèle** : `qwen2.5:3b` (Optimisé pour la rapidité/instruction).

