# Fiche d'Identité Technique & Contexte IA

Ce document résume l'état technique du projet **Boumb'App**. Il doit être utilisé pour charger le contexte technique avant toute intervention.

## 1. Stack Technique

| Composant | Technologie | Version | Note |
| :--- | :--- | :--- | :--- |
> **Note** : Le Frontend utilise un Proxy Vite (`/api` -> `http://localhost:8080`) pour éviter les problèmes de CORS en dev.

## 3. Arborescence du Projet

```text
/ (Racine Projet)
├── ai_service/             # Micro-service Python (Facultatif Phase 1)
│   ├── app/                # Code Application (FastAPI)
│   ├── Dockerfile          # Image Python 3.11
│   └── requirements.txt    # Dépendances (requests, uvicorn...)
│
├── app/                    # Code Source Backend (Symfony)
│   ├── config/             # Configuration (packages, routes, services)
│   ├── src/                # Code PHP (Entity, Controller, Service)
│   ├── .env                # Variables d'environnement (API)
│   └── composer.json       # Dépendances PHP
│
├── client/                 # Code Source Frontend (React)
│   ├── src/                # Code TSX (Components, Pages, Hooks)
│   ├── public/             # Assets statiques
│   ├── vite.config.ts      # Config Vite (Proxy)
│   └── package.json        # Dépendances JS (Locales au client)
│
├── docs/                   # Documentation du Projet
│   ├── 00_index_general.md # Point d'entrée
│   ├── 01_analyse/         # Spécifications & Besoins
│   ├── 02_conception/      # Architecture, BDD, API, UI
│   ├── 03_initialisation/  # Migration & Setup
│   ├── 04_agent_workflow/  # Méthodes de travail
│   └── 05_reference_technique/ # Fiche d'identité (Ce dossier)
│
├── docker-compose.yml      # Orchestration des services
├── Dockerfile              # Image Docker Backend (FrankenPHP)
├── .env                    # Config Globale (Chemin Modèles Ollama)
└── package.json            # Scripts Globaux (Outillage)
```

## 4. Commandes Usuelles (Globales)

Le fichier `package.json` à la racine sert de "Makefile" pour piloter le projet.

| Commande | Description | Équivalent Docker |
| :--- | :--- | :--- |
| `npm run up` | Démarrer la stack | `docker compose up -d` |
| `npm run down` | Arrêter la stack | `docker compose down` |
| `npm run logs` | Voir les logs | `docker compose logs -f` |
| `npm run sh` | Shell Backend | `docker compose exec boumbapp_backend sh` |
| **New** `npm run cc` | Vider le cache SF | `docker compose exec boumbapp_backend bin/console c:c` |
| `npm run db:reset` | Reset BDD (Drop/Create/Migrate/Fixtures) | *Multiples commandes* |

## 5. Configuration Clé (.env)

### Racine (`/.env`)
*   **OLLAMA_MODELS_PATH** : Chemin absolu vers le dossier des modèles `.gguf`.

### Backend (`app/.env`)
*   **DATABASE_URL** : `postgresql://JeanTreu:secret@boumbapp_database:5432/boumbappdb...`
*   **AI_API_URL** : `http://boumbapp_ai_api:8000` (URL interne du service Python).
*   **CORS_ALLOW_ORIGIN** : `'^https?://(localhost|127\.0\.0\.1)(:[0-9]+)?$'`
*   **JWT_SECRET_KEY** : `%kernel.project_dir%/config/jwt/private.pem`

### Frontend (`client/.env`)
*   *Non défini pour le moment (Proxy utilisé).*

## 6. Outillage Recommandé
*   **SonarLint** : Extension IDE indispensable pour l'analyse statique (Qualité & Sécurité) en temps réel.
*   **Postman / Insomnia** : Pour tester l'API manuellement.
*   **DBEaver** : Pour visualiser la base de données PostgreSQL.
