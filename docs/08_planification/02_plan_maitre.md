# Plan Maître de Développement

Ce document est la source de vérité pour l'avancement global du projet Boumb'App.

## 🏁 Phase 1 : Socle Technique & API (En Cours)

Cette phase vise à avoir un Backend solide capable de servir le Frontend.

- [x] **Initialisation Environnement**
    - [x] Docker Stack (FrankenPHP, Postgres, React).
    - [x] Configuration CI/CD (Tests, Qualité).
- [x] **Base de Données**
    - [x] Modélisation Entités (Code First).
    - [x] Migrations SQL.
    - [x] Fixtures (Données de test "Usine").
- [x] **API Backend (MVP)**
    - [x] **Authentification** :
        - [x] Installation JWT (Lexik).
        - [x] Endpoint `/api/login_check`.
    - [x] **Exposition Données (API Platform / Controllers)** :
        - [x] `GET /samples` & `GET /presets` (Catalogue).
        - [x] `GET /projects` (Liste User).
        - [x] `GET /projects/{id}` (Chargement Studio).
        - [x] `POST /projects` (Sauvegarde).
    - [x] **Tests API** : Validation fonctionnelle des Endpoints.

## 🎨 Phase 2 : Studio UI (Frontend Core)

Mise en place de l'interface graphique "Coquille vide" mais navigable.

- [x] **Architecture React**
    - [x] Setup Store (Zustand) & Router.
    - [x] Design System (Tokens CSS, Composants de base).
- [ ] **Navigation & Global**
    - [ ] Page de Login / Register.
    - [ ] Dashboard : Liste des Projets (Fetch API).
    - [ ] Layout Studio : Navbar, Sidebar (En cours).
- [ ] **Intégration API**
    - [ ] Hook d'authentification (Token management).
    - [ ] Services API (Axios/Fetch wrappers).

## 🎹 Phase 3 : Moteur Audio & Séquenceur

Le cœur du DAW. On donne vie à l'interface.

- [x] **Moteur Audio (Tone.js)**
    - [x] `AudioEngine` Singleton (TypeScript).
    - [x] Hook `useProjectAudio` (Pont React & Store).
    - [x] Instrument : Sampler (Chargement fichiers WAV & Mappings).
    - [x] Instrument : PolySynth (Gestion Presets).
    - [x] Synchronisation Transport & Song Mode.
- [x] **Séquenceur UI**
    - [x] Grille Piano Roll (Notes, Durée).
    - [x] Step Sequencer (JuicyBox / DrumLane).
    - [x] Synchronisation Visuel <-> Audio.

## 🧠 Phase 4 : Intelligence Artificielle (TERMINÉ)

La "Killer Feature" : génération assistée.

- [x] **Backend IA**
    - [x] Bridge Symfony <-> Python Service.
    - [x] Service Python : Prompt Engineering pour Ollama.
    - [x] Service Client `AIService.ts` (Frontend).
    - [x] **Intégration RAG Hybride** : [13_integration_rag_hybride.md](03_plans_detailles/13_integration_rag_hybride.md)
    - [x] Endpoint `/api/ai/generate` avec support Contextuel.
- [x] **Frontend IA**
    - [x] Composant `AIPrompt` (TopBar).
    - [x] Feedback Loop "Live Research".

## ️ Phase 5 : Migration TypeScript (TERMINÉ)
*(Voir historique)*

## 🎛️ Phase 6 : Refonte Audio & Rack (En Cours)

Architecture V2 du moteur audio.

- [x] **Architecture Bus**
    - [x] Création `busJuicy` (Drums) et `busSynth` (Melody).
    - [x] Contrôles TopBar dédiés.
- [ ] **JuicyBox V2 (Rack)** (Mis en pause)
    - [ ] Tracks dynamiques.
    - [ ] Effets (Insert FX).

## 🏙️ Phase 7 : Skyline Refinement (A Venir)

Amélioration du mode Song / Arrangement.

## 🚀 Phase 8 : Stabilisation & Déploiement

- [ ] Optimisation Perfs (Lazy loading samples).
- [ ] Tests E2E (Cypress/Playwright).
- [ ] Build & Deploy (Docker Prod).
