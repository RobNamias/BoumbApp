# Comparatif : Stack actuel vs Stack cible DAW

## 1. Synthèse des deux stacks

### Stack actuel (Symfony)
- **Backend** : Symfony 7.3, Doctrine ORM, Twig, Monolog
- **Base de données** : MySQL 8 (Docker)
- **DevOps** : Docker, Docker Compose, FrankenPHP, Caddy
- **Frontend** : Aucun frontend JS moderne (pas de React, Vite, etc.)
- **API** : Pas d’API REST/GraphQL, structure orientée serveur classique

### Stack cible (DAW)
- **Frontend** : React (Hybride/Vite), TypeScript, WebAudio API, gestion d’état (Zustand), React Router, Tailwind CSS, Radix UI
- **Backend** : Symfony API, PostgreSQL (JSONB), JWT (auth)
- **DevOps** : Docker, Docker Compose, GitHub Actions (CI/CD)
- **Bonus** : Storybook, ESLint, Prettier

---

## 2. Points de choix importants

Tout au long de la migration, plusieurs choix structurants devront être faits :
- Dossier frontend : **`/front`** (Séparation claire à la racine)
- Backend : Symfony API Platform ou Express.js/Node
- Gestion d’état : Redux Toolkit ou Zustand
- UI : MUI ou Radix UI
- CSS : Styled Components ou Tailwind CSS
- Base de données : PostgreSQL (recommandé) ou SQLite (dev)
- Outils de test d’API : REST Client, Thunder Client, Postman…
- Outil d’administration BDD : pgAdmin, DBeaver…
- Stratégie de migration de la base : progressive ou rupture

---

## 3. Plan d’action détaillé (checklist)

### 1. Nettoyer le projet actuel
- [ ] Lister tous les contrôleurs qui ne servent qu’au rendu de vues HTML
- [ ] Supprimer le dossier `app/templates/`
- [ ] Désinstaller `symfony/twig-bundle` et retirer la config Twig
- [ ] Supprimer ou désactiver les routes qui ne servent qu’au rendu de vues
- [ ] Supprimer la config et les outils liés à `symfony/asset` si non utilisés côté API
- [ ] Supprimer les assets statiques inutiles dans `public/` (hors build React futur)
- [ ] Désinstaller les bundles Composer inutiles (Twig, Asset, etc.)
- [ ] Nettoyer le `docker-compose.yml` (phpMyAdmin, MySQL si passage à PostgreSQL)

### 2. Réorganiser la structure du projet
- [ ] **CHOIX** :
    - [ ] Choisir le dossier pour le frontend (`/front` ou `/client`)
    - [ ] Choisir si le backend reste en Symfony (API Platform) ou migration vers Express.js/Node
- [ ] Créer le dossier frontend choisi
- [ ] Adapter la structure du backend pour n’exposer que des routes API
- [ ] Mettre à jour le `docker-compose.yml` pour ajouter un service frontend (Vite/React)
- [ ] Prévoir les ports nécessaires (ex : 3000 pour React, 8000/8001 pour API)
- [ ] Centraliser la documentation dans `/docs`

### 3. Ajouter les packages et dépendances nécessaires
- [ ] **CHOIX** :
    - [ ] Choisir la solution de gestion d’état (Redux Toolkit ou Zustand)
    - [ ] Choisir le framework UI (MUI ou Radix UI)
    - [ ] Choisir le framework CSS (Styled Components ou Tailwind CSS)
    - [ ] Choisir le backend (API Platform/Symfony ou Express.js/Node)
    - [ ] Choisir la base de données (PostgreSQL recommandé, SQLite possible pour dev)
- [ ] Initialiser le projet React avec **Vite et TypeScript** dans `/front` (TypeScript recommandé pour robustesse et DX)
- [ ] Installer les dépendances React, gestion d’état, navigation, UI, style, ESLint, Prettier, Storybook
- [ ] Installer côté backend les packages nécessaires selon le choix (voir section dépendances)
- [ ] Installer PostgreSQL (ou SQLite pour dev)

### 4. Mettre en place les outils externes
- [ ] **CHOIX** :
    - [ ] Choisir l’outil de test d’API (REST Client, Thunder Client, Postman…)
    - [ ] Choisir l’outil d’administration BDD (pgAdmin, DBeaver…)
- [ ] Configurer GitHub Actions pour CI/CD (tests, build, lint, déploiement)
- [ ] Configurer Storybook pour la documentation UI (compatible TypeScript)
- [ ] Configurer ESLint et Prettier pour le lint et le formatage du code (TypeScript inclus)
- [ ] Installer et configurer pgAdmin (PostgreSQL) ou autre outil choisi

### 5. Centraliser la documentation et la configuration
- [ ] Documenter l’architecture, les choix techniques, les conventions dans `/docs` (y compris les choix TypeScript)
- [ ] Centraliser les variables d’environnement dans des fichiers `.env` (un par service)
- [ ] Documenter les ports, endpoints, variables d’environnement
- [ ] Ajouter des scripts npm/yarn pour le frontend (dev, build, lint, test, storybook, typage TypeScript)
- [ ] Ajouter des scripts makefile ou composer pour le backend

### 6. Migrer la base de données
- [ ] **CHOIX** :
    - [ ] Choisir la stratégie de migration (progressive ou rupture)
- [ ] Exporter les données existantes si besoin
- [ ] Installer et configurer PostgreSQL (adapter la config Doctrine ou Prisma)
- [ ] Adapter les entités/schémas et les scripts de migration
- [ ] Tester la migration et la connexion à la nouvelle base

---

## 4. Packages et dépendances à ajouter

### Frontend (React)
- `react`, `react-dom`, `vite`, `typescript`, `@types/react`, `@types/react-dom`
- `redux-toolkit` ou `zustand` (gestion d’état)
- `react-router-dom` (navigation)
- `styled-components` ou `tailwindcss` (style)
- `@mui/material` ou `@radix-ui/react-*` (UI)
- `eslint`, `prettier` (qualité code)
- `storybook` (documentation UI)

### Backend (si Express.js)
- `express`, `prisma`, `@prisma/client`, `jsonwebtoken`, `bcrypt`, `cors`, `dotenv`
- `nodemon` (dev), `jest` (tests)

### Backend (si Symfony API)
- `api-platform/api-pack` (API REST/GraphQL)
- `lexik/jwt-authentication-bundle` (JWT)
- `nelmio/cors-bundle` (CORS)
- `phpunit/phpunit` (tests)

### Base de données
- **PostgreSQL** (recommandé) ou SQLite (dev/proto)

---

## 5. Outils externes à utiliser

- **GitHub Actions** : CI/CD pour automatiser tests, build, déploiement
- **Docker/Docker Compose** : Orchestration multi-services (front, back, BDD)
- **Storybook** : Documentation interactive des composants React
- **ESLint/Prettier** : Qualité et formatage du code
- **phpMyAdmin** (MySQL) ou **pgAdmin** (PostgreSQL) : administration BDD

---

## 6. Centralisation des informations

- **Documentation** :
  - Centraliser dans `/docs` : choix techniques, architecture, API, conventions, guides d’installation
  - Utiliser Storybook pour la documentation UI (accessible en local ou déployée)
- **Configuration** :
  - Centraliser les variables d’environnement dans des fichiers `.env` (un par service)
  - Documenter les ports, endpoints, et variables dans `/docs`
- **Scripts** :
  - Ajouter des scripts npm/yarn pour le frontend (dev, build, lint, test)
  - Ajouter des scripts makefile ou composer pour le backend

---

## 7. Détail : ce qui peut être supprimé du projet actuel

Lors de la transition vers la stack cible, tu peux envisager de supprimer ou désactiver les éléments suivants pour alléger et clarifier ton projet :

- **Twig et les templates serveur**
  - Dossier `app/templates/`
  - Dépendances liées à Twig (`symfony/twig-bundle`, fichiers de config Twig)
  - Toute logique de rendu côté serveur (contrôleurs qui renvoient des vues)

- **Assets gérés côté Symfony**
  - Configurations et outils liés à `symfony/asset` si tout le front est géré par Vite/React

- **Code ou config orienté “full-stack” Symfony**
  - Contrôleurs qui ne servent qu’à afficher des pages HTML
  - Routes qui ne servent qu’au rendu de vues

- **phpMyAdmin** (optionnel)
  - Si tu passes à PostgreSQL, tu n’auras plus besoin de ce service

- **Tout ce qui concerne le rendu ou la logique front dans Symfony**
  - CSS, JS, images statiques dans `public/` (sauf si tu veux servir les builds React ici)

- **Packages Composer inutiles**
  - `symfony/twig-bundle`, `symfony/asset`, et tout bundle lié au rendu serveur
  - Certains bundles de dev si tu utilises d’autres outils (ex : Storybook, ESLint côté front)

- **Configuration Docker liée à des services non utilisés**
  - Services, variables ou volumes qui ne servent plus (ex : phpMyAdmin, configs MySQL si tu passes à PostgreSQL)

En résumé : tout ce qui concerne le rendu de pages HTML côté Symfony, la gestion d’assets côté PHP, et les outils/services qui ne correspondent plus à ta stack cible peuvent être supprimés ou désactivés. Avant de supprimer, vérifie les dépendances croisées et fais des sauvegardes.

---

## 8. Extensions utiles à installer

Voici une sélection d’extensions (principalement pour VS Code, mais aussi navigateur) qui peuvent accélérer le développement, améliorer la qualité ou le confort :

### Extensions VS Code
- **ES7+ React/Redux/React-Native snippets** : Raccourcis pour générer rapidement du code React/Redux.
- **Prettier - Code formatter** : Formatage automatique du code (JS, TS, CSS, etc.).
- **ESLint** : Affichage et correction des erreurs de lint en temps réel.
- **Tailwind CSS IntelliSense** : Autocomplétion et documentation pour Tailwind CSS.
- **Prisma** : Highlight, autocomplétion et navigation dans les schémas Prisma.
- **Jest** : Intégration des tests unitaires Jest (résultats, couverture, etc.).
- **GitLens** : Historique Git avancé, annotations, blame, etc.
- **Docker** : Gestion visuelle des conteneurs, images, volumes, etc.
- **REST Client** : Tester des requêtes HTTP directement depuis VS Code.
- **Thunder Client** : Alternative légère à Postman pour tester les APIs.
- **Markdown All in One** : Outils pour éditer, prévisualiser et structurer le Markdown.
- **Path Intellisense** : Autocomplétion des chemins de fichiers.
- **Bracket Pair Colorizer 2** : Coloration des paires de parenthèses/accolades.

### Extensions navigateur
- **React Developer Tools** : Inspection de l’arbre de composants React, props, state, etc.
- **Redux DevTools** : Debug et visualisation de l’état Redux.
- **Apollo Client Devtools** : Pour le debug des requêtes GraphQL (si usage d’Apollo).
- **Postman** : Pour tester et documenter les APIs REST/GraphQL.

### Autres outils
- **pgAdmin** : Interface graphique pour PostgreSQL.
- **DBeaver** : Client universel pour bases de données (SQL, NoSQL).

N’hésite pas à adapter cette liste selon tes besoins et ton workflow !
