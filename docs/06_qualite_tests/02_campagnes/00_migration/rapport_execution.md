# Rapport des Tests de Migration

Ce document recense les tests effectués et validés au cours des différentes phases de la migration.

## Phase 1 : Docker (Migration MySQL -> PostgreSQL)

| ID | Test | Commande / Action | Résultat | Date |
| :--- | :--- | :--- | :--- | :--- |
| **ST-01** | État des services | `docker compose ps` | ✅ OK (Tous les services UP) | 02/12/2025 |
| **ST-02** | Driver PHP PostgreSQL | `php -m \| grep pgsql` | ✅ OK (`pdo_pgsql` présent) | 02/12/2025 |
| **ST-03** | Connexion BDD | `dbal:run-sql "SELECT 1"` | ✅ OK (Retourne `1`) | 02/12/2025 |
| **FIX-01** | Volume MySQL persistant | `docker compose down -v` | ✅ OK (Volume recréé pour PG) | 02/12/2025 |

## Phase 2 : Backend (Symfony)

| ID | Test | Commande / Action | Résultat | Date |
| :--- | :--- | :--- | :--- | :--- |
| **CONF-01** | Clés JWT | Vérification présence fichiers | ✅ OK (`private.pem`, `public.pem`) | 03/12/2025 |
| **CONF-02** | Bundles installés | `cat config/bundles.php` | ✅ OK (Security, JWT, Cors activés) | 03/12/2025 |
| **CONF-03** | Configuration .env | Vérification manuelle | ✅ OK (URL PG & CORS corrects) | 03/12/2025 |

## Phase 3 : Frontend (React)

| ID | Test | Commande / Action | Résultat | Date |
| :--- | :--- | :--- | :--- | :--- |
| **FRONT-01** | Création Projet | `npm create vite` | ✅ OK (Template React-TS) | 03/12/2025 |
| **FRONT-02** | Config Proxy | Vérification `vite.config.ts` | ✅ OK (Proxy /api -> 8080) | 03/12/2025 |
| **FRONT-03** | Installation Deps | `npm install` | ✅ OK (Terminé) | 03/12/2025 |
