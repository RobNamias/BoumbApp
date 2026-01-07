# Plan de Refactoring : JuicyBox x ProjectStore

**Objectif** : Connecter le séquenceur rythmique (`JuicyBox`) au nouveau Store Global (`ProjectStore`).
**Enjeu** : Passer d'une liste de pistes statique à une gestion dynamique multi-patterns.

## 1. Analyse de l'Existant
*   **Composant Actuel** : `client/src/pages/SequencerTestPage.tsx` (sert de conteneur).
*   **Store Actuel** : `useTracksStore.ts` (Gère `tracks: Record<number, TrackState>`).
*   **Limitation** : Ne gère qu'un seul pattern implicite.

## 2. Architecture Cible
Le séquenceur ne doit plus "posséder" les données, il doit être une **Vue** sur le `ProjectStore`.

### 2.1 Notion de "Pattern Actif"
La JuicyBox doit afficher le pattern désigné par `project.activePatterns.drums`.
*   *Si aucun pattern actif ?* -> Afficher un état vide ou créer un pattern "Init" par défaut.

### 2.2 Mapping des Actions
| Action Utilisateur | Ancien Store (`useTracksStore`) | Nouveau Store (`useProjectStore`) |
| :--- | :--- | :--- |
| **Ajouter Note** | `addNote(trackId, note)` | `addNote('drums', activePatternId, trackId, note)` |
| **Mute Piste** | `setMute(trackId, true)` | `updateTrackMixer(...)` (À implémenter) |
| **Changer Pattern** | *N/A* | `setActivePattern('drums', newId)` |

## 3. Plan d'Implémentation (Steps)

### Étape 1 : Préparation du Store (Mixer Actions)
Le `ProjectStore` a besoin de méthodes pour manipuler le mixer d'une piste (Volume, Mute, Solo) car `TrackData` est maintenant imbriqué dans le Pattern.
*   [ ] Ajouter `updateTrackMixer(type, patternId, trackId, partialMixer)` dans `projectStore.ts`.

### Étape 2 : Le Conteneur Intelligent (`JuicyBoxContainer`)
Remplacer `SequencerTestPage` par un vrai conteneur propre.
*   [ ] Créer `client/src/components/organisms/JuicyBox/JuicyBox.tsx`.
*   [ ] **Logique d'initialisation** :
    *   Au montage, vérifier si `activePatterns.drums` est défini.
    *   Sinon, créer un pattern "Pattern 1" et l'activer.
*   [ ] **Sélection de Pattern** :
    *   Afficher 4 boutons [1] [2] [3] [4].
    *   Cliquer sur [2] crée/active le pattern 2.

### Étape 3 : Migration des Composants Enfants
Modifier `StepGrid` et `TrackList` pour accepter des **Props** au lieu de lire le Store directement.
*   `StepGrid` recevra `tracks` (du pattern actif) et `onToggleStep`.
*   `TrackList` recevra `tracks` et `onMixerChange`.

### Étape 4 : Connexion Audio (Engine)
*   [ ] Le `AudioEngine` doit s'abonner aux changements du `ProjectStore` pour jouer les sons.
*   *Note : Pour ce refactoring UI, on accepte que le son soit cassé temporairement le temps de migrer l'AudioEngine.*

## 4. Risques & Mitigations
*   **Risque** : Complexité du "Note Toggle" (Trouver la bonne note à supprimer).
*   **Solution** : Utiliser une comparaison simple par `time` ("0:0:0", "0:0:1"...) comme clé unique par pas pour le MVP.
