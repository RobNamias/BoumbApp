# Plan de Migration TypeScript

**Objectif** : Convertir 100% de la base de code Frontend (`client/src`) de JSX vers TypeScript pour garantir la robustesse et la maintenabilité future.

## 1. Configuration & Socle
## 1. Configuration & Socle
- [x] **TS Config** : Vérifier `tsconfig.json` (Strict Mode activé) - *(Via references)*.
- [x] **Déclarations** : S'assurer que `declarations.d.ts` couvre les extensions nécessaires (`.svg`, etc.) le temps de la transition.
- [x] **Store** : Convertir `store/useAppStore.js` -> `store/useAppStore.ts` (Définir interface `AppState`) - *(Déjà fait)*.

## 2. Composants UI (Atoms)
Les briques fondamentales doivent être typées en premier pour propager les types vers le haut.
- [x] **Button** (`components/atoms/Button.jsx` -> `.tsx`)
    - Interface Props: `onClick`, `label`, `variant`, etc.
- [x] **Knob** (`components/atoms/Knob.jsx` -> `.tsx`)
    - Props: `value`, `min`, `max`, `onChange`.
- [x] **Fader** (`components/atoms/Fader.jsx` -> `.tsx`)
    - Props: `value`, `onChange`, `vertical`.
- [x] **Led** (`components/atoms/Led.jsx` -> `.tsx`)
    - Props: `active`, `color`, `onClick`.
- [x] **Switch** (`components/atoms/Switch.jsx` -> `.tsx`)
    - Props: `checked`, `onChange`.
- [x] **Select** (`components/atoms/Select.jsx` -> `.tsx`)
    - Props: `options` (Array<{label, value}>), `value`, `onChange`.
- [x] **DragInput** (`components/atoms/DragInput.jsx` -> `.tsx`)
    - Props: `value`, `onChange`, `label`.

## 3. Composants UI (Molecules)
- [x] **StepCell** (`components/molecules/StepCell.jsx` -> `.tsx`)
    - Typage strict des modes (`StepMode` enum ?).
- [x] **TransportControls** (`components/molecules/TransportControls.jsx` -> `.tsx`)
- [x] **TrackHeader** (`components/molecules/TrackHeader.jsx` -> `.tsx`)
- [x] **Pagination** (`components/molecules/Pagination.jsx` -> `.tsx`)
- [x] **DrumLane** (`components/molecules/DrumLane.jsx` -> `.tsx`)

## 4. Composants UI (Organisms)
- [x] **JuicyBox** (`components/organisms/JuicyBox.jsx` -> `.tsx`)
    - Intégration des types de `useAudioEngine` et `Track`.
- [x] **Sequencer** (`components/organisms/Sequencer.jsx` -> `.tsx`)

## 5. Pages & Routing
- [x] **DesignSystemPage** (`pages/DesignSystemPage.jsx` -> `.tsx`)
- [x] **SequencerTestPage** (`pages/SequencerTestPage.jsx` -> `.tsx`)
- [x] **App** (`App.tsx`) : Supprimer les `@ts-ignore` ou `any` temporaires une fois les pages converties.

## 6. Tests
- [x] Renommer tous les fichiers `*.test.jsx` en `*.test.tsx`.
- [x] Corriger les types dans les mocks Vitest.

## Stratégie d'Exécution
1.  On traite LOT par LOT (d'abord Atoms, puis Molecules...).
2.  Pour chaque fichier :
    -   Renommage `.jsx` -> `.tsx`.
    -   Création des interfaces `Props`.
    -   Correction des erreurs de compilation.
    -   Vérification des tests.
