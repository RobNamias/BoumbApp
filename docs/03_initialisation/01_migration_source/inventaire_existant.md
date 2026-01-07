# Inventaire de l'Existant

État des lieux du projet au démarrage de la phase d'initialisation.

## 1. Infrastructure (Docker)
*   **Conteneur App** : `dunglas/frankenphp:1-php8.3-alpine` (Serveur Web + PHP).
*   **Base de Données** : `mysql:8.0` (Attention : La stack cible mentionnait PostgreSQL, à migrer ou valider).
*   **Outils** :
    *   `phpmyadmin` (Gestion BDD).
    *   `mailpit` (Capture emails dev).
*   **Ports** :
    *   Web : `8001` -> `8080`
    *   MySQL : `3306`
    *   PMA : `8080` -> `80` (Conflit potentiel avec le port interne du conteneur app ?)

## 2. Backend (Symfony)
*   **Version** : Symfony 7.3.
*   **Dépendances Actuelles** (`app/composer.json`) :
    *   `doctrine/orm` (ORM).
    *   `symfony/maker-bundle` (Générateur).
    *   `symfony/twig-bundle` (Moteur de template).
    *   `symfony/monolog-bundle` (Logs).
*   **Manquants Critiques** (pour le MVP) :
    *   ❌ `api-platform/core` (API REST).
    *   ❌ `symfony/security-bundle` (Authentification JWT).
    *   ❌ `lexik/jwt-authentication-bundle` (Token JWT).
    *   ❌ `symfony/serializer` (Sérialisation JSON).
    *   ❌ `symfony/validator` (Validation données).

## 3. Frontend (React)
*   **État** : Inexistant.
*   **Fichiers** : Pas de `package.json` valide à la racine ou dans `app/`.
*   **Action requise** : Initialiser un projet Vite + React.

## 4. Structure de Fichiers
*   `app/` : Contient le code source Symfony.
*   `docker-compose.yml` : Orchestration.
*   `docs/` : Documentation (Analyse & Conception).

## 5. Conclusion & Plan d'Action
Le socle est partiel. Il faut :
1.  **Migrer DB** : Passer de MySQL à PostgreSQL (conformément à `choix_stack.md`).
2.  **Installer Dépendances Back** : API Platform, Security, JWT.
3.  **Initialiser Front** : Créer le projet React (Vite).
