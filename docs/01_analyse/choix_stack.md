# Choix de Stack pour un Mini DAW en Ligne

## Objectif

Créer un mini DAW (Digital Audio Workstation) en ligne, avec une base de données, pour un projet personnel étudiant (CDA), en tenant compte de ressources limitées.

---

## 1. Symfony (API) + React (Front) + PostgreSQL/MySQL

**Avantages :**

- Séparation claire back/front (API REST ou GraphQL)
- React : composants réactifs, écosystème riche (audio, UI)
- Symfony : sécurité, ORM, migrations, gestion utilisateurs
- Facile à héberger (OVH, Render, Railway…)

**Inconvénients :**

- Deux projets à gérer (front et back)
- Build front à prévoir (npm, webpack/vite)
- Courbe d’apprentissage React si débutant

---

## 2. Symfony (Twig) + WebAudio API (JS natif) + PostgreSQL/MySQL

**Avantages :**

- Un seul projet à gérer (Symfony)
- Twig pour le rendu, JS natif pour l’audio (WebAudio API)
- Déploiement simple, peu de dépendances

**Inconvénients :**

- Moins d’outils modernes pour l’UI (pas de composants React)
- JS natif : plus de code à écrire pour l’interactivité
- Moins évolutif si besoin d’une SPA plus tard

---

## 3. Node.js (Express/NestJS) + React ou Vue + MongoDB

**Avantages :**

- Full JS (front et back), partage de code possible
- Beaucoup de ressources/tutos pour l’audio en JS
- MongoDB : flexible pour stocker des projets audio

**Inconvénients :**

- Moins “clé en main” que Symfony pour la sécurité/auth
- Hébergement Node parfois plus cher
- ORM/ODM parfois moins mature que Doctrine

---

## 4. Laravel (PHP) + Vue.js (ou React) + MySQL

**Avantages :**

- Laravel : très populaire, facile à prendre en main
- Vue.js : plus simple que React pour débuter
- Bonne documentation, communauté active

**Inconvénients :**

- Deux environnements à gérer (front/back)
- Moins d’outils audio natifs que sur React

---

## 5. Fullstack JS “tout-en-un” : Next.js (React SSR) + Prisma + PostgreSQL

**Avantages :**

- Un seul projet (monorepo), SSR/SSG possible
- Prisma : ORM moderne, typé
- Next.js : API routes intégrées, déploiement facile (Vercel)

**Inconvénients :**

- Next.js peut être complexe à configurer pour l’audio
- Moins de séparation front/back si besoin d’une API externe

---

## 6. Python (Django/Flask) + React ou Vue + PostgreSQL

**Avantages :**

- Django : admin intégré, sécurité, ORM
- Python : facile à apprendre, beaucoup de ressources

**Inconvénients :**

- Deux stacks à apprendre (Python + JS)
- Moins d’outils audio côté Python (tout se fait côté JS)

---

## 7. SvelteKit (front+API) + SQLite/PostgreSQL

**Avantages :**

- Svelte : très léger, rapide, facile à prendre en main
- SvelteKit : API et front dans le même projet
- Idéal pour petits projets, peu de config

**Inconvénients :**

- Moins de ressources/tutos que React/Vue
- Moins d’outils audio prêts à l’emploi

---

## 8. No-code/Low-code (Bubble, Appgyver, etc.)

**Avantages :**

- Pas de code à écrire, prototypage rapide
- Hébergement inclus

**Inconvénients :**
- Limité pour l’audio avancé
- Peu de contrôle, coût à terme

---

## Solution retenue : Symfony + PostgreSQL + React (Vite) + TypeScript (**Strict Mode**)

### Pourquoi ce choix ?
- **PostgreSQL** : Choisi pour sa robustesse et sa gestion native du type `JSONB`, idéale pour stocker les structures complexes d'un projet musical (pistes, notes, paramètres).



#### DevOps & Outils

- **Docker** : Outil de containerisation pour isoler et déployer facilement les différentes parties de l’application (front, back, BDD).

- **Docker Compose** : Permet d’orchestrer plusieurs conteneurs Docker (ex : front, back, base de données) avec une configuration centralisée.

- **Adminer** : Outil léger d'administration de base de données (alternative compatible PostgreSQL à phpMyAdmin), intégré directement au `docker-compose.yml`.

- **GitHub Actions** (optionnel) : Plateforme d’intégration et de déploiement continu (CI/CD) pour automatiser les tests, builds et déploiements.

#### Intelligence Artificielle (Locale)

- **Python (FastAPI)** : Choisi comme middleware pour l'IA. FastAPI est performant, typé, et s'intègre parfaitement à l'écosystème Data Science/IA (LangChain, etc.). Il servira de pont entre Symfony et le modèle local.
- **Ollama** : Solution légère et conteneurisée pour faire tourner des LLM (Large Language Models) comme Mistral en local, sans dépendance au cloud.

#### Bonus

- **Storybook** : Outil de documentation et de développement interactif pour les composants UI. Permet de visualiser, tester et documenter chaque composant React isolément.

- **ESLint + Prettier** : ESLint analyse le code pour détecter les erreurs et incohérences, Prettier formate automatiquement le code pour garantir une base propre et homogène.

#### Tests & Qualité
- **PHPUnit** : Le standard pour tester le backend Symfony.
- **Vitest** : Framework de test unitaire pour Vite/React (plus rapide que Jest).
- **Cypress** (ou Playwright) : Outil pour les tests E2E (End-to-End). Il lance un vrai navigateur et clique sur les boutons comme un utilisateur. Idéal pour tester les scénarios critiques (Login, Sauvegarde).

### Évolutions Futures (RAG / IA Avancée)
*   **Base de Données Vectorielle :** Utilisation de l'extension **`pgvector`** sur PostgreSQL pour stocker les embeddings (vecteurs) des projets et de la documentation.
*   **Embeddings :** Modèles légers (ex: `all-MiniLM-L6-v2`) pour transformer texte et MIDI en vecteurs.