# Plan de Migration Phase 2 : Intégration Stack IA (Checklist)

Ce document détaille les étapes pour intégrer les services d'Intelligence Artificielle Locale dans l'infrastructure existante.

## 1. Structure du Projet (Service Python)
**Objectif :** Créer le squelette du micro-service Python.

- [x] **Création Dossier**
    - [x] Créer `ai_service/` à la racine du projet.
- [x] **Fichiers de Configuration**
    - [x] `ai_service/requirements.txt` (fastapi, uvicorn, requests, pydantic).
    - [x] `ai_service/Dockerfile` (Base python:3.11-slim).
    - [x] `ai_service/app/main.py` (Hello World endpoint /v1/melody).

## 2. Infrastructure (Docker)
**Objectif :** Ajouter les conteneurs IA au `docker-compose.yml`.

- [x] **Service Ollama (`boumbapp_ai_engine`)**
    - [x] Image : `ollama/ollama:latest`.
    - [x] Volume : `${OLLAMA_MODELS_PATH}:/root/.ollama` (Stockage modèles sur `D:/Dev/Models/Ollama`).
    - [x] Port : `11434` (Interne).
    - [x] Ressource : `deploy.resources.reservations.devices` (GPU si dispo, sinon CPU).

- [x] **Service Python (`boumbapp_ai_api`)**
    - [x] Build : `./ai_service`.
    - [x] Port : `8002:8000` (Exposé pour debug, interne pour prod).
    - [x] Env : `OLLAMA_HOST=http://boumbapp_ai_engine:11434`.

- [x] **Réseau**
    - [x] Vérifier que `backend`, `ai_api` et `ai_engine` partagent le même réseau.

- [x] **Variable d'Environnement (.env)**
    - [x] Vérifier présence : `OLLAMA_MODELS_PATH="D:/Dev/Models/Ollama"`

## 3. Initialisation Modèle (Ollama)
**Objectif :** Télécharger le LLM dans le volume.

- [x] **Premier Démarrage**
    - [x] `docker compose up -d boumbapp_ai_engine`
- [x] **Pull Model**
    - [x] `docker compose exec boumbapp_ai_engine ollama pull mistral` (ou `llama3` selon choix).
- [x] **Test Inférence Brute**
    - [x] `curl http://localhost:11434/api/generate -d '{"model":"mistral", "prompt":"Hello"}'`

## 4. Backend Symfony (Communication)
**Objectif :** Configurer Symfony pour parler à l'API Python.

- [x] **Configuration Env**
    - [x] Ajouter `AI_API_URL=http://boumbapp_ai_api:8000` dans `.env` (fait dans `app/.env`).
- [x] **Service HttpClient**
    - [x] Créer `AiGenerationService.php` qui injecte cette URL.

## 5. Validation Finale
- [x] **Start Full Stack** : `docker compose up -d`.
- [x] **Test End-to-End** :
    - [x] Appel Symfony `POST /api/generate` -> Appelle Python -> Appelle Ollama -> Retourne JSON.
