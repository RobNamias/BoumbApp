# Plan Détaillé : Timeline (Arrangement View) & UI Shell

**Référence** : `docs/01_analyse/specifications_song_mode.md`
**Workflow** : `[/newcomponent]` (Atomic Design), `[/tdd]` (Tests first).

## 1. Objectifs
Créer le composant central de l'application "Song Mode" : la **Timeline**.
Elle permet de visualiser et d'éditer la structure temporelle du morceau (Clips, Patterns) sur une grille linéaire.

## 2. Shell & Architecture UI
Avant la Timeline, il faut stabiliser la "Coquille" qui l'héberge.

### 2.1 `MainLayout` (Organism)
*   Structure globale : Sidebar fixe + TopBar fixe + Content Area scrollable.
*   **TopBar** : Transport Global (Play/Stop, BPM, Time Display 0:0:0).
*   **Sidebar** : Navigation entre vues (Mixer, Sequencer, Arrangement).
*   **Content Area** : Affiche `Timeline` (Song Mode) ou `PatternEditor` (JuicyBox/SynthLab).

## 3. Composant Timeline (Organism)
*   **Chemin** : `client/src/components/organisms/Timeline/`
*   **Usage** : Affiche les Pistes (Lignes) et les Clips (Blocs).
*   **Propriétés** :
    *   `tracks`: Liste des pistes (`drums`, `melody`, etc.).
    *   `clips`: Liste des clips placés.
    *   `zoom`: Niveau de zoom (px par mesure).
    *   `onClipMove`: Handler pour déplacer/redimensionner.

### 3.1 Sous-Composants (Molecules/Atoms)
*   `TimelineHeader` : Liste des noms de pistes à gauche.
*   `TimelineGrid` : Fond grillagé (Mesures/Temps).
*   `TimelineRuler` : Règle temporelle en haut.
*   `TimelineClip` : Représentation visuelle d'un Pattern instancié.

## 4. Stratégie de Développement (TDD)

### Step 1: `Timeline.test.tsx` (RED)
1.  **Test Rendu** : Vérifier que le composant s'affiche sans crash.
2.  **Test Props** : Vérifier qu'il affiche bien 2 pistes si on lui passe 2 pistes.
3.  **Test Clip** : Vérifier qu'il affiche un Clip aux bonnes coordonnées (CSS left/width).

### Step 2: Implémentation (GREEN)
1.  Scaffolding `Timeline`, `Timeline.module.scss`.
2.  Logique de calcul :
    *   `posToPx(time)` : Convertit "1:0:0" en pixels `left`.
    *   `durationToPx(duration)` : Convertit "32 steps" en pixels `width`.

### Step 3: Intégration Store
1.  Connecter `MainLayout` au `projectStore`.
2.  Connecter `Timeline` à `projectStore.timeline` et `projectStore.melodicTracks`.

## 5. Tâches
1.  [x] **Scaffolding** : `MainLayout` (si pas encore fait/finalisé).
2.  [x] **Scaffolding** : `Timeline` folder struct.
3.  [x] **TDD** : `Timeline.test.tsx`.
4.  [x] **Impl** : `Timeline.tsx` (Grid + Ruler).
5.  [x] **Impl** : `TimelineTrack` & `TimelineClip`.
6.  [x] **Integration** : Affichage des données réelles du `projectStore`.

## 6. Song Mode Logic (Scheduler)
**Le Séquenceur Unifié** doit piloter l'AudioEngine selon deux modes distincts :

### 6.1 Dual Mode Scheduler
L'AudioEngine ne doit plus connaître la notion de "Pattern". Il doit simplement exécuter des notes qu'on lui fournit à chaque tick.
*   **Mode Pattern (Legacy/Loop)** :
    *   Le Scheduler lit uniquement le `activePattern` du store.
    *   Boucle sur 32 steps (2 mesures).
    *   Usage : Édition dans JuicyBox / SynthLab.
*   **Mode Song (Skyline)** :
    *   Le Scheduler lit la `timeline` du store.
    *   Il interroge `getActiveClipsAtStep(globalStep)` pour savoir quels patterns jouer.
    *   Le curseur avance linéairement (pas de reset à 32).

### 6.2 Decoupled View (Vue Découplée)
Pour une meilleure UX, l'affichage et l'audio sont découplés en Mode Song :
*   **Audio** : Joue ce qui est écrit sur la Timeline (ex: Pattern B).
*   **Visuel (JuicyBox)** : Affiche le pattern sélectionné par l'utilisateur (ex: Pattern A).
*   *Avantage* : Permet d'éditer un pattern spécifique pendant que le morceau entier joue en fond, sans que la vue ne "saute" constamment.

### 6.3 Algorithme (Pseudo-Code)
```typescript
onStep(globalStep) {
    if (mode === 'PATTERN') {
        const localStep = globalStep % 32;
        playNotesFrom(activePattern, localStep);
    } else { // SONG MODE
        const activeClips = getActiveClipsAtStep(timeline, globalStep);
        activeClips.forEach(clip => {
            const localStep = globalStep - clip.start;
            const sourcePattern = patterns[clip.patternId];
            playNotesFrom(sourcePattern, localStep);
        });
    }
}
```
