# Plan Détaillé - Phase 4 : Moteur Audio (Tone.js)

**Objectif** : Implémenter le cœur sonore de l'application en suivant le workflow TDD (@/tdd) et l'architecture validée (`docs/02_conception/05_moteur_audio/architecture_audio.md`).

## 1. Contexte & Dépendances
*   **Doc Architecture** : `docs/02_conception/05_moteur_audio/architecture_audio.md`
*   **Kit de Test** : `client/public/samples/kits/tribe/` (Vérifié).
*   **Librairie** : `tone` (Installée).

## 2. Stratégie de Développement (TDD)
Nous allons procéder brique par brique, en écrivant d'abord le test (Red), puis le code (Green).

### Étape 1 : Infrastructure AudioEngine (Singleton)
*   **Test (Red)** : `client/src/audio/AudioEngine.test.ts`
    *   Vérifier que `AudioEngine` est un objet unique (Singleton).
    *   Vérifier que `.initialize()` ne crash pas (mock Tone.js ?).
    *   Vérifier que `.getTrack(id)` retourne `undefined` avant initialisation.
*   **Implémentation (Green)** :
    *   Créer `client/src/audio/AudioEngine.ts`.
    *   Initialiser les maps `tracks`.

### Étape 2 : Chargement des Samples
*   **Test (Red)** :
    *   Mocker `Tone.Sampler`.
    *   Appeler `loadKit('tribe')`.
    *   Vérifier que les samples sont chargés aux URL correctes (`/samples/kits/tribe/tribe_Kick.wav`...).
*   **Implémentation (Green)** :
    *   Implémenter `_loadSamples()` dans `AudioEngine`.
    *   Utiliser `Promise.all` pour attendre le chargement.

### Étape 3 : Hook useAudioEngine
*   **Test (Red)** : `client/src/hooks/useAudioEngine.test.tsx` (React Testing Library).
    *   Vérifier que le hook retourne l'instance Engine.
    *   Vérifier qu'il réagit aux changements de volume (spy sur `engine.setVolume`).
*   **Implémentation (Green)** :
    *   Créer `client/src/hooks/useAudioEngine.ts`.
    *   Connecter aux stores Zustand `useAppStore`.

### Étape 4 : Séquençage (Transport)
*   **Test (Red)** :
    *   Configurer un BPM à 120.
    *   Lancer `start()`.
    *   Vérifier que le callback `scheduleRepeat` est appelé (Mock Timer).
*   **Implémentation (Green)** :
    *   Configurer `Tone.Transport`.
    *   Implémenter la boucle de lecture principale.

### Étape 5 : Contrôles & Mixage (Phase 5)
*   **Store** : Créer `useTracksStore` pour gérer Volume/Mute/Solo.
*   **AudioEngine** :
    *   Ajouter `setTrackVolume(id, db)`.
    *   Ajouter `muteTrack(id, bool)`.
    *   Ajouter `soloTrack(id, bool)`.
*   **Intégration** :
    *   Connecter `TrackHeader` au store.
    *   Synchroniser Store -> AudioEngine via `useAudioEngine`.

## 3. Liste des Tâches (Checklist)

- [x] **Setup Test Env** : Configurer Vitest pour mocker `tone` (éviter le contexte Audio Web inexistant en CI).
- [x] **AudioEngine** : Structure de classe et Singleton (`.ts`).
- [x] **Sample Loader** : Logique de construction des paths.
- [x] **Routing** : Channel Strips (Volume, Mute, Pan).
- [x] **Hook** : Connexion React (`.ts`).
- [x] **Intégration** : Test manuel dans `SequencerLab` (Via tests unitaires et store).

## 4. Points d'Attention
*   **Auto-Start** : [x] Le contexte Audio doit être démarré par un clic utilisateur (Géré via `setIsPlaying` + `Tone.start()`).
*   **Latence** : Attention au temps de chargement des samples, prévoir un état `isLoaded` dans le store.
