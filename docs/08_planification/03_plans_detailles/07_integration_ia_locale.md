# Plan Détaillé 07 : Intégration IA Locale (Ollama)

**Statut** : Validé & Implémenté (V1.1 "Lite")
**Date** : 09/12/2025
**Dépendances** : Docker, Ollama (Local), Python 3. Modèle: `qwen2.5:1.5b`.

## 1. Objectifs
Connecter le SynthLab à une Intelligence Artificielle générative locale pour créer des séquences mélodiques à la volée.
Le système doit être gratuit, privé (local) et performant (faible latence).

## 2. Architecture Technique

### 2.1 Backend : Microservice Python (`ai_service`)
Nous utilisons un service Python léger (FastAPI) pour faire l'interface entre le client React et le moteur Ollama.

*   **Rôle** : Proxy, Validation, Prompt Engineering.
*   **Conteneur** : `boumbapp_ai_api`.
*   **Port** : 8002 (Host) -> 8000 (Container).
*   **Stack** :
    *   `fastapi`, `uvicorn` : Serveur API asynchrone.
    *   `httpx` : Client HTTP asynchrone robuste (remplace `requests` pour éviter les timeouts Docker).
    *   `pytest`, `httpx` : Suite de tests (TDD).

### 2.2 Moteur IA : Ollama (`boumbapp_ai_engine`)
*   **Image** : `ollama/ollama:latest`.
*   **Modèle** : `qwen2.5:1.5b` (Migration depuis Mistral pour perf).
*   **Ressources** : Utilise le GPU/CPU de l'hôte.

### 2.3 Frontend : Client React
*   **Service** : `AIService.ts`.
*   **Composant** : `AIPrompt.tsx` (Input + Bouton).
*   **Flux** : `Prompt Utilisateur` -> `AIService` -> `Python API` -> `Ollama` -> `JSON Notes` -> `AudioEngine`.

## 3. Stratégie de Prompting ("Hybrid Lite V2")

Pour garantir des résultats sur des machines modestes (CPUs), la stratégie a été optimisée (V1.1 -> V2) :

1.  **Format Réduit** : Génération de **2 Mesures** (32 steps).
2.  **Règles Musicales Strictes** :
    *   **Densité** : Minimum 8 notes imposé (évite le "vide").
    *   **Notation** : Force les Dièses (#) et interdit les Bémols (b) pour compatibilité Frontend.
    *   **Groove** : Syncope et Vélocité variable demandés.
3.  **Contraintes Techniques** :
    *   Modèle : `qwen2.5:1.5b` (Ultra-rapide).
    *   Timeout : 300s (Sécurité).

## 4. Protocole de Test (TDD) & Docker

Le développement suit le workflow **TDD** STRICT.
La particularité est l'environnement Dockerisé.

### Stratégie "In-Docker Testing"
Plutôt que de gérer un venv local potentiellement divergent, nous exécutons les tests DANS le conteneur.

1.  **Installation** : Dépendances de test (`pytest`, `httpx`) ajoutées à `requirements.txt`.
2.  **Exécution** :
    ```bash
    docker-compose exec boumbapp_ai_api pytest
    ```
3.  **Boucle de Dev** :
    *   Modifier code (Host) -> Volume monté (Container) -> Lancer Test (Container).

## 5. Étapes d'Implémentation

1.  **Backend Hardening** (Terminé) :
    *   TDD sur `main.py`.
    *   Implémentation CORS.
    *   Migration vers `httpx` (Fix connexion).
    *   Optimisation "Lite Mode".
2.  **Frontend Client** (Terminé) :
    *   Service TypeScript avec gestion d'erreurs détaillée (Backend Logs).
    *   Composant `AIPrompt`.
3.  **UI & Intégration** (Terminé) :
    *   Ajout du panneau IA dans `SynthLab`.
    *   Connexion au Sequencer (`AudioEngine` & `Store`).

## 6. Prochaines Étapes : Optimisation
Voir : `docs/08_planification/03_plans_detailles/08_optimisation_ia.md`
