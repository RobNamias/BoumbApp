# Plan de Migration & Initialisation (Checklist)

Ce document est la référence unique pour l'exécution de la migration.
Chaque étape doit être cochée après validation.

## 1. Infrastructure (Docker)
**Objectif :** Basculer de MySQL vers PostgreSQL.

- [x] **Arrêt des services**
    - [x] `docker compose down -v` (Suppression volumes MySQL)
- [x] **Nettoyage Conflits**
    - [x] Supprimer `app/compose.yaml` (Généré par Flex, redondant avec docker-compose.yml racine).
- [x] **Modification `docker-compose.yml`**
    - [x] Supprimer le service `db` (MySQL).
    - [x] Supprimer le service `phpmyadmin`.
    - [x] Ajouter le service `database` (PostgreSQL 16).
        ```yaml
        database:
          image: postgres:16-alpine
          container_name: symfony_db
          environment:
            POSTGRES_DB: app
            POSTGRES_PASSWORD: ChangeMe123!
            POSTGRES_USER: app
          ports:
            - "5432:5432"
          volumes:
            - dbdata:/var/lib/postgresql/data
        ```
    - [x] Mettre à jour `app` : `depends_on: [database]`.
- [x] **Modification `Dockerfile`**
    - [x] Ajouter paquet système : `postgresql-dev` (pour la compilation).
    - [x] Remplacer extension PHP : `pdo_mysql` -> `pdo_pgsql`.
- [x] **Renommage Conteneurs**
    - [x] `symfony_app` -> `boumbapp_backend`
    - [x] `symfony_db` -> `boumbapp_database`
    - [x] `symfony_mailpit` -> `boumbapp_mailpit`
- [x] **Redémarrage & Build**
    - [x] `docker compose build --no-cache` (À vérifier via Smoke Test si pas fait explicitement)
    - [x] `docker compose up -d`
- [ ] **Vérification (Smoke Tests)**
    - [ ] **ST-01** : `docker compose ps` -> Services `app` et `database` UP.
    - [ ] **ST-02** : `docker compose exec app php -m | grep pgsql` -> Retourne `pdo_pgsql`.
    - [ ] **ST-03** : `docker compose exec app bin/console dbal:run-sql "SELECT 1"` -> Retourne `1`.

## 2. Backend (Symfony)
**Objectif :** Installer la stack API.

- [x] **Nettoyage Configuration**
    - [x] Modifier `.env` : `DATABASE_URL="postgresql://app:ChangeMe123!@boumbapp_database:5432/app?serverVersion=16&charset=utf8"`
- [x] **Installation Core API**
    - [x] `docker compose exec boumbapp_backend composer require api-platform/core symfony/serializer symfony/validator nelmio/cors-bundle ramsey/uuid-doctrine`
- [x] **Installation Sécurité**
    - [x] `docker compose exec boumbapp_backend composer require symfony/security-bundle lexik/jwt-authentication-bundle`
- [x] **Installation Dev Tools**
    - [x] `docker compose exec boumbapp_backend composer require --dev symfony/maker-bundle doctrine/doctrine-fixtures-bundle zenstruck/foundry`
- [x] **Configuration**
    - [x] Générer clés JWT : `docker compose exec boumbapp_backend php bin/console lexik:jwt:generate-keypair`
    - [x] Configurer `config/packages/security.yaml` (Stateless).
    - [x] Configurer `config/packages/nelmio_cors.yaml` (Allow Origin: `http://localhost:5173`).

## 3. Frontend (React)
**Objectif :** Initialiser le client Vite.

- [x] **Création Projet**
    - [x] `npm create vite@latest client -- --template react-ts`
- [x] **Installation Dépendances**
    - [x] `cd client && npm install`
    - [x] `npm install tone zustand axios sass lucide-react clsx tanstack/react-query`
- [x] **Configuration Vite**
    - [x] Modifier `vite.config.ts` (Proxy API vers `http://localhost:8080`).

## 4. Validation Finale
- [x] Accès Swagger : `http://localhost:8080/api` (ou 8001 selon port hôte).
- [x] Accès Front : `http://localhost:5173`.
