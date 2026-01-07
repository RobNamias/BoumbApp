# Synthèse Recherche & Intégration IA

**Date** : 06/12/2025
**Objet** : Définition de la stratégie technique pour l'IA générative musicale suite aux POCs.

## 1. Bilan des POCs

Nous avons mené deux expérimentations distinctes pour valider la génération de mélodies :

### A. POC Gemini (Cloud)
*   **Approche** : API Google Gemini 2.0 Flash + Tone.js.
*   **Résultats** :
    *   Excellent rendu musical grâce à un **System Prompt** très travaillé (densité, variations, syncopes).
    *   Architecture simple (Proxy Node.js).
    *   **Limites** : Dépendance à une clé API, coût potentiel, données sortantes.

### B. POC LLM Local (Ollama)
*   **Approche** : Modèle Mistral/Llama en local via Ollama + Script Python.
*   **Résultats** :
    *   Indépendance totale (Fonctionne hors ligne une fois le modèle téléchargé).
    *   Gratuité.
    *   **Limites** : Nécessite une infrastructure plus lourde (Service Python + Ollama).

## 2. Solution Retenue : "Local First, Python Brain"

Pour allier la qualité du POC Gemini à l'indépendance du POC Local, nous choisissons une architecture hybride.

### Architecture Cible
1.  **Moteur d'Inférence** : **Ollama** (Docker) hébergeant des modèles quantifiés (ex: `mistral:7b-instruct` ou `phi-3`).
2.  **Cerveau (API Intermédiaire)** : **FastAPI (Python)**.
    *   *Pourquoi Python ?* Pour bénéficier de l'écosystème IA (LangChain, Pydantic) et faciliter une future évolution RAG.
    *   *Rôle* : C'est ici que sera injecté le **System Prompt** évolué du POC Gemini. Il fera l'interface entre Symfony et Ollama.
3.  **Orchestrateur** : **Symfony**. Gère la sécurité, les quotas par utilisateur et transmet la demande à l'API Python.
4.  **Client** : **React** (Tone.js) pour le playback.

## 3. Impact Technique

### Nouvelle Stack
*   Ajout du conteneur `boumbapp_ai_engine` (Ollama).
*   Ajout du conteneur `boumbapp_ai_api` (FastAPI).

### Standardisation
Le prompt "Secret Sauce" validé sur Gemini sera adapté pour les modèles locaux (Llama/Mistral) et stocké dans le code Python, garantissant que même en local, la qualité musicale reste élevée.

## 4. Analyse Critique & Perspectives

Cette architecture "lourde" (Symfony + Python + Ollama) a été choisie en conscience pour répondre à une ambition élevée.

### 4.1 Sécurité : Le Pattern "Bunker"
*   **Architecture** : Le service Python et Ollama sont isolés dans le réseau interne Docker. Ils ne sont **pas exposés** sur Internet.
*   **Contrôle** : Seul Symfony (le Backend principal) a le droit d'appeler l'API Python. C'est Symfony qui gère l'Authentification (JWT) et le Rate Limiting (Quotas).
*   **Avantage** : Protection totale du modèle et de l'API d'inférence contre les abus externes.

### 4.2 Extensibilité : Une API "Multi-Expert"
Le choix de Python (FastAPI) comme middleware permet de créer des endpoints spécialisés avec des prompts dédiés, sans polluer le code PHP :
*   `POST /v1/melody` : Prompt "Compositeur de Mélodie".
*   `POST /v1/drums` : Prompt "Batteur Expert" (Structure différente, pas de notes mais des hits percussifs).
*   `POST /v1/chat` : Prompt "Assistant RAG" (pour interroger la documentation technique).

### 4.3 Compromis (Trade-offs)
*   **Performance (RAM/CPU)** : Faire tourner 3 stacks + un LLM en local demande une machine robuste (16Go RAM recommandés).
*   **Maintenance** : Nécessite de maintenir du code dans 3 langages (JS, PHP, Python). **C'est le coût de l'indépendance et de la flexibilité.**
