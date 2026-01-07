# Besoins Cibles & Stack Technique

Ce document définit la "Liste de Courses" idéale pour l'initialisation du projet.
Il sert de référence pour l'installation des dépendances et la configuration de l'environnement.

## 1. Infrastructure (Docker)
L'environnement de développement doit fournir :

*   **Serveur Web / PHP** : `dunglas/frankenphp` (PHP 8.3+).
    *   *Extensions requises* : `intl`, `pdo_pgsql`, `zip`, `opcache`.
*   **Base de Données** : `postgres:16-alpine`.
    *   *Pourquoi ?* Support natif du JSONB (essentiel pour le stockage des projets DAW).
*   **Node.js** : `node:20-alpine` (pour le build Frontend).

### Optionnel (Évolutions)
*   **Mercure** : Pour les fonctionnalités temps réel (Collaboration, Chat).
*   **Redis** : Pour le cache ou les sessions si charge élevée.

## 2. Backend (Symfony 7.3+)
Le moteur API REST.

### Core & API
*   `api-platform/core` : Framework API REST/GraphQL.
*   `symfony/serializer` : Transformation JSON <-> Objets.
*   `symfony/validator` : Validation des données entrantes.
*   `nelmio/cors-bundle` : Gestion des requêtes Cross-Origin (Front -> Back).

### Base de Données
*   `doctrine/orm` : Gestion des entités.
*   `doctrine/doctrine-migrations-bundle` : Versionning du schéma BDD.
*   `ramsey/uuid-doctrine` : Support des UUIDs pour les IDs.

### Sécurité & Auth
*   `symfony/security-bundle` : Socle de sécurité Symfony.
*   `lexik/jwt-authentication-bundle` : Authentification par Token JWT (Stateless).

### Dev & Qualité
*   `symfony/maker-bundle` : Générateur de code.
*   `doctrine/doctrine-fixtures-bundle` : Données de test (Faux utilisateurs, Projets démo).
*   `zenstruck/foundry` : Factories pour les fixtures (plus fluide).
*   `phpunit/phpunit` : Tests unitaires et d'intégration.

## 3. Frontend (React + Vite)
L'interface utilisateur riche (SPA).

### Core
*   `react`, `react-dom` : Version 18+.
*   `vite` : Bundler rapide.
*   `typescript` : Typage statique (Recommandé).

### Audio & Logique
*   `tone` : Moteur Audio Web (Tone.js).
*   `zustand` : Gestion d'état global (Store léger).

### UI & Design
*   `sass` : Préprocesseur CSS (Architecture SCSS + CSS Modules).
*   `lucide-react` : Icônes vectorielles légères.
*   `clsx`, `tailwind-merge` : Utilitaires de classes CSS (si besoin).

### Communication API
*   `axios` : Client HTTP (Gestion native des Intercepteurs pour JWT).
*   `tanstack/react-query` : Gestion du cache serveur et des états de chargement.

## 4. Intelligence Artificielle (Externe)
*   `symfony/http-client` : Pour appeler les APIs IA (OpenAI, HuggingFace).

## 5. Résumé du Plan d'Installation
1.  **Docker** : Remplacer MySQL par PostgreSQL dans `docker-compose.yml`.
2.  **Symfony** :
    *   `composer require api-platform/core symfony/security-bundle lexik/jwt-authentication-bundle`
    *   `composer require --dev symfony/maker-bundle doctrine/doctrine-fixtures-bundle`
3.  **React** :
    *   `npm create vite@latest .`
    *   `npm install tone zustand lucide-react`
