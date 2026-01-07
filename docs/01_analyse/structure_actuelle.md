# Structure actuelle du projet "Symfony"

## Vue d'ensemble

Ce document présente la structure, l'architecture et les principaux composants du projet Symfony tel qu'il existe actuellement. Il détaille l'organisation des dossiers, les ressources, les services Docker, ainsi que les principaux packages et dépendances utilisés.

---

## 1. Arborescence principale

- `Dockerfile`, `docker-compose.yml`, `Caddyfile` : fichiers de configuration pour le déploiement et l'orchestration Docker (application, base de données, phpMyAdmin, serveur web).
- `docs/` : documentation du projet.
- `app/` : dossier principal de l'application Symfony.
    - `bin/` : scripts exécutables (console Symfony).
    - `config/` : configuration de Symfony (services, routes, bundles, packages).
    - `migrations/` : scripts de migration de base de données.
    - `public/` : point d'entrée HTTP (`index.php`).
    - `src/` : code source (contrôleurs, entités, repositories, kernel).
    - `templates/` : vues Twig.
    - `var/` : fichiers temporaires, cache, logs.
    - `vendor/` : dépendances PHP installées via Composer.
    - fichiers de configuration d'environnement (`.env`, `.env.dev`, etc.).
    - fichiers de configuration Docker spécifiques (`compose.yaml`, `compose.override.yaml`).
    - fichiers Composer (`composer.json`, `composer.lock`).

---

## 2. Architecture technique

### Backend (Symfony)

- **Symfony 7.3** : Framework PHP moderne, structure le projet selon le modèle MVC (Modèle-Vue-Contrôleur), fournit un système de routing, d’injection de dépendances, de gestion des services, de sécurité, de configuration et d’outillage CLI (console).
- **Doctrine ORM** : Permet la gestion des entités PHP et leur persistance en base de données relationnelle. Facilite les requêtes, la validation et la migration du schéma via des entités et repositories.
- **Doctrine DBAL** : Couche d’abstraction pour manipuler la base de données de façon indépendante du SGBD (MySQL, PostgreSQL, SQLite…).
- **Doctrine Migrations** : Gère l’évolution du schéma de la base de données via des scripts versionnés, reproductibles et traçables.
- **Twig** : Moteur de templates pour générer dynamiquement les vues HTML côté serveur, avec une syntaxe sécurisée et flexible.
- **Monolog** : Système de gestion des logs, centralise l’écriture des événements applicatifs (erreurs, alertes, infos) dans différents canaux (fichiers, emails, etc.).
- **Configuration YAML/PHP** : La configuration des services, routes, bundles et packages se fait principalement en YAML, mais peut aussi être faite en PHP pour plus de flexibilité.

### Base de données

- **MySQL 8 (Docker)** : SGBD relationnel robuste, utilisé ici en conteneur pour la persistance des données applicatives.
- **Doctrine** : Fait le lien entre les entités PHP et les tables SQL, gère les transactions, la validation et la synchronisation du schéma.

### DevOps & Infrastructure

- **Docker** : Permet d’isoler l’application, la base de données et les outils d’administration dans des conteneurs reproductibles, facilitant le déploiement et la montée en charge.
- **Docker Compose** : Orchestration multi-conteneurs, définit les services (app, db, phpmyadmin), leurs liens, variables d’environnement, volumes et ports exposés.
- **FrankenPHP** : Serveur web PHP moderne, performant, compatible Caddy, utilisé comme base d’image Docker pour l’application.
- **Caddy** : Reverse proxy intégré à FrankenPHP, gère le routage HTTP/HTTPS, la gestion des certificats et la configuration du serveur web.

---

---

## 3. Services Docker

- **app** :
    - Build à partir du Dockerfile (basé sur dunglas/frankenphp)
    - Volume monté sur `./app`
    - Exposé sur le port 8001 (redirigé vers 8080 dans le conteneur)
    - Variables d'environnement pour le mode dev, Xdebug, etc.
    - Dépend de la base de données

- **db** :
    - Image officielle MySQL 8
    - Volume persistant `dbdata`
    - Port 3306 exposé
    - Authentification simplifiée (mot de passe vide pour dev)

- **phpmyadmin** :
    - Interface web pour la gestion MySQL
    - Port 8080 exposé
    - Dépend de `db`

---

## 4. Principaux packages et dépendances (Composer)

### Symfony (noyau et extensions)

- **symfony/framework-bundle** : Fournit le cœur du framework (MVC, services, configuration, sécurité).
- **symfony/console** : Outils CLI pour automatiser les tâches (migrations, cache, génération de code, etc.).
- **symfony/dotenv** : Gestion des variables d’environnement via fichiers `.env`.
- **symfony/twig-bundle** : Intégration du moteur de templates Twig.
- **symfony/yaml** : Lecture et écriture de fichiers YAML (configuration).
- **symfony/asset** : Gestion des assets (CSS, JS, images) côté serveur.
- **symfony/orm-pack** : Pack facilitant l’intégration de Doctrine ORM.
- **symfony/maker-bundle** : Génération de code (entités, contrôleurs, formulaires) via CLI.
- **symfony/monolog-bundle** : Intégration avancée de Monolog pour la gestion des logs.

### Doctrine (accès et gestion des données)

- **doctrine/orm** : ORM principal, mapping objet-relationnel.
- **doctrine/dbal** : Couche d’abstraction pour les requêtes SQL.
- **doctrine/doctrine-bundle** : Intégration de Doctrine dans Symfony (configuration, services, CLI).
- **doctrine/doctrine-migrations-bundle** : Gestion des migrations de schéma.

### Outils de logs et debug

- **monolog/monolog** : Gestion centralisée des logs applicatifs.

### PSR et standards PHP

- **psr/cache** : Interface standard pour la gestion du cache.
- **psr/container** : Interface standard pour les conteneurs d’injection de dépendances.
- **psr/log** : Interface standard pour la gestion des logs.

### Autres utilitaires

- **nikic/php-parser** : Analyseur syntaxique PHP, utilisé par certains outils de génération ou d’analyse de code.

### Packages additionnels (via vendor/)

- **symfony/cache**, **symfony/config**, **symfony/dependency-injection**, **symfony/event-dispatcher**, **symfony/filesystem**, **symfony/process**, etc. : Fournissent des fonctionnalités avancées pour la gestion du cache, la configuration, l’injection de dépendances, la gestion des événements, le système de fichiers, l’exécution de processus externes, etc.

---

## 5. Points particuliers

- **Configuration** :
    - Utilisation de YAML pour la plupart des configurations (services, routes, packages)
    - Surcharge possible via fichiers `.env` et variables d'environnement Docker
- **Organisation du code** :
    - Respect des conventions Symfony (PSR-4, structure MVC)
    - Dossiers dédiés pour les entités, contrôleurs, repositories
- **Déploiement** :
    - Prêt pour un environnement Dockerisé (dev ou prod)
    - Utilisation de FrankenPHP pour de meilleures performances PHP

---

## 6. À compléter/évoluer

- Pas de frontend JS moderne (React, Vite, etc.) dans la structure actuelle
- Pas de gestion d’API REST ou GraphQL pour l’instant (structure orientée Symfony classique)
- Possibilité d’ajouter des tests, une CI/CD, ou d’autres services selon l’évolution du projet

---

*Document généré automatiquement le 20/11/2025.*
