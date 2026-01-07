# Architecture Frontend (React/Vite)

## 1. Vue d'Ensemble
L'application frontend est une Single Page Application (SPA) construite avec **React** et **Vite**. Elle sert d'interface studio pour la création musicale, interagissant avec l'API Symfony pour la persistance des données.

## 2. Stack Technique
| Technologie | Usage |
| :--- | :--- |
| **React 18** | Bibliothèque UI (Hooks, Functional Components). |
| **TypeScript** | Typage statique strict (Zéro `any`). |
| **Vite** | Bundler & Dev Server (HMR rapide). |
| **Zustand** | Gestion d'état global (léger et flexible). |
| **React Router 6** | Navigation et Routing côté client. |
| **Sass (.scss)** | Préprocesseur CSS (Variables, Nesting). |
| **Vitest** | Framework de test (Compatible Jest). |
| **Testing Library** | Tests d'intégration composants. |

## 3. Structure du Projet
L'architecture de fichiers suit une approche hybride **Atomic Design** / **Fonctionnelle**.

```
client/src/
├── components/          # Composants UI (Atomic Design)
│   ├── atoms/           # Briques indivisibles (Button, Knob, Led...)
│   ├── molecules/       # Combinaisons simples (TransportControls, StepCell, AIPrompt...)
│   ├── organisms/       # Zones complexes (Sequencer, Mixer...)
│   └── templates/       # Mises en page (Layout.tsx...)
├── pages/               # Vues routées (SequencerTestPage, DesignSystemPage...)
├── services/            # Services API (aiService.ts...)
├── store/               # Stores Zustand (useAppStore, useProjectStore...)
├── styles/              # Styles globaux et partiels
│   ├── components/      # Partiels SCSS par composant (_knob.scss...)
│   ├── modules/         # Modules SCSS isolés (*.module.scss)
│   └── app.scss         # Point d'entrée styles
├── App.tsx              # Racine et Routing
└── main.tsx             # Point d'entrée DOM

client/public/
└── samples/             # Nomenclature Stricte :
    └── kits/            # /kits/[nomkit]/[nomkit]_[Element].ogg
*   **Props Down** : Le parent passe les données (`isActive`) et les callbacks (`onClick`).
*   **Events Up** : L'enfant notifie le parent via les callbacks.

## 5. Authentification & Sécurité (LexikJWT)
L'application gère l'authentification via un flux JWT standard.

### Composants Clés
*   **AuthStore (`authStore.ts`)** : Store Zustand persistant (localStorage) stockant le Token JWT et l'Utilisateur courant.
*   **Client API (`api/client.ts`)** : Wrapper Axios injectant automatiquement le header `Authorization: Bearer <token>`.
*   **Protection Routes** : Les pages protégées (Studio, Mixer) vérifient `isAuthenticated` et redirigent vers `/login`.

## 6. Communication Backend & Persistance
L'application dialogue avec une API **Symfony / API Platform**.

### Client HTTP (Axios)
*   Configuration globale dans `src/api/client.ts`.
*   Base URL : `/api` (Proxifié via Vite en Dev à `http://boumbapp_backend:8080`, Direct en Prod).

### Hydratation des Données (JSON-LD)
API Platform utilise le format **Hydra**. Le Frontend (`projectService.ts`) adapte ces réponses :
1.  **Collections** : Cherche `hydra:member` (ou `member`) pour extraire le tableau d'items.
2.  **Items** : Utilise directement l'objet JSON retourné.
3.  **Filtrage** : Les requêtes GET utilisent des Query Params standard (ex: `?project=1&order[versionNumber]=desc`).

### Services (Repository Pattern)
*   `projectService.ts` : Centralise les appels CRUD pour les projets et versions.
*   `aiService.ts` : Gestion des appels d'inférence.

## 7. Audio Engine & Sync (The Bridge)
L'intégration entre `ProjectStore` (Zustand) et `AudioEngine` (Tone.js) est assurée par le hook `useProjectAudio`.

### Modes de Lecture
1.  **Pattern Mode (MPC Style)** :
    *   **Architecture "Track-Type Global"** : Il n'y a qu'un seul pattern actif par TYPE d'instrument à un instant T.
    *   *Exemple* : Si on sélectionne "Pattern 2" pour la Mélodie, **tous** les instruments mélodiques (Lead, Bass, Pad) liront le contenu du Pattern 2.
    *   *Implication UX* : On ne peut pas avoir "Lead joue Pattern A" et "Bass joue Pattern B" simultanément en mode Pattern.
2.  **Song Mode (Timeline)** :
    *   Lit la séquence linéaire définie dans `project.timeline`.
    *   Assemble dynamiquement les clips pour chaque piste.

### Responsabilités Techniques
1.  **Sync Structurelle** : Création dynamique des Tracks/Samplers dans Tone.js quand le pattern actif change.
2.  **Sync Mixer** : Mise à jour réactive du Volume/Mute/Solo/Pan.
3.  **Boucle de Lecture** : `Tone.Transport` gère le temps réél.
4.  **Probability (Fill)** :
    *   Propriété `fill` (0.0 à 1.0) sur chaque note.
    *   Evaluée à chaque boucle : `if (Math.random() > fill) skipNote()`.
5.  **Ghost Pattern Prevention** :
    *   Nettoyage explicite (`part.dispose()`) lors du changement de pattern.
    *   Envoi de clips vides `[]` aux pistes inactives pour forcer le silence.
    *   **Sanitization** : Arrondi des temps (`totalSteps`) pour éviter les erreurs Tone.js (`RangeError`).

6.  **Mixer Architecture (3-Tier)** (New):
    *   **Tier 1: Tracks (Sources)**: Tous les instruments (Samplers/Synths). Route vers un Insert.
        *   _Structure_: `Instrument` -> `muteGain` (Gate) -> `Panner` -> `Destination (Insert Input)`.
    *   **Tier 2: Inserts (Processing)**: 10 Canaux de traitement (CI 1-10). Route vers un Groupe.
        *   _Chain_: `Input` -> `FX Chain` -> `ChannelStrip` -> `Group Input`.
    *   **Tier 3: Groups (Submix)**: 4 Bus de regroupement (CG 1-4).
        *   _Chain_: `Input` -> `FX Chain` -> `ChannelStrip` -> `Master Input`.
    *   **Master (Final Sum)**: Sortie globale + Limiter + Spectrum Analyzer.

7.  **Robustesse Audio**:
    *   **Vrai Mute**: Utilisation d'un `GainNode` dédié (`muteGain`) pour couper le signal audio (au lieu de stopper le séquenceur), gérant les "tails" et les triggers manuels.
    *   **Logic Solo**: Calcul de l'état "Effective Mute" -> Si un Solo est actif, tous les autres tracks sont mutés via leur `muteGain`.

## 8. Routing (React Router v6)

## 9. Styling (Theming)
*   **Variables CSS** : Définies dans `app.scss` (root et `[data-theme]`).
*   **Thèmes** : Support Dark (défaut) / Light via attribut `data-theme` sur `<body>`.
*   **Sass Modules** : Utilisés pour l'encapsulation (ex: `Sidebar.module.scss`, `TopBar.module.scss`). Migration progressive pour éliminer les conflits globaux.

## 10. Conventions
*   **Nommage Fichiers** : PascalCase pour composants (`StepCell.tsx`), camelCase pour utilitaires.
*   **Tests** : Fichier `.test.tsx` à côté du composant. `npm test` pour lancer.

## 11. Internationalisation (i18n)
L'application supporte le multi-langue (Français/Anglais) grâce à l'écosystème **i18next**.

### Stack
*   `i18next` : Cœur du système.
*   `react-i18next` : Hooks React (`useTranslation`).
*   `i18next-browser-languagedetector` : Détection automatique (Navigateur).

### Architecture
1.  **Configuration** : `src/i18n-setup.ts` initialise l'instance.
    *   *Note Importante* : `useSuspense: false` est configuré pour éviter les écrans blancs de chargement, car les ressources sont bundlées.
2.  **Ressources** : Fichiers JSON plats dans `src/locales/` (`en.json`, `fr.json`).
3.  **Usage** :
    ```typescript
    const { t, i18n } = useTranslation();
    // Affichage : {t('section.key')}
    // Changement : i18n.changeLanguage('fr')
    ```
4.  **Déploiement Docker** : Nécessite une attention particulière aux volumes `node_modules` pour s'assurer que les nouvelles dépendances sont bien présentes dans le conteneur.
