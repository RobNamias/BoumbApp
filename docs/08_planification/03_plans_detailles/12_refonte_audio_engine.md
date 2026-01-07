# Plan Détaillé : Refonte Moteur Audio & Data Model (Track-First)

**Référence** : `docs/02_conception/01_architecture/architecture_review.md`
**Workflow** : `[/withdoc]` (Zero Debt), `[/tdd]` (Tests first).

## 1. Objectifs
Moderniser et stabiliser l'architecture Audio en adoptant le modèle standard des DAW ("Digital Audio Workstation").
Cette refonte vise à résoudre les problèmes de **synchronisation**, de **conflits de Drag & Drop** et de **limitations structurelles** (ex: patterns batterie cloisonnés).

## 2. Philosophie "Track-First"
Le changement fondamental est la séparation entre l'**Instrument** (qui produit le son) et la **Partition** (qui dit quand jouer).
*   **Avant** : Le Pattern contenait les instruments.
*   **Après** : Les instruments sont sur des Pistes Globales. Les Patterns ne sont que des notes.

## 3. Architecture des Données (Nouvelle)

### 3.1 Pistes Globales (`project.drumTracks`)
Désormais, le projet maintient une liste dynamique de pistes audio de batterie.
*   Chaque piste possède son propre Samples et ses réglages Mixer (Volume, Pan, Mute).
*   **Limite MVP** : L'interface sera initialisée avec 6 pistes (Kick, Snare, HH Closed, HH Open, Perc 1, Perc 2), mais la structure permet N pistes.

### 3.2 Patterns Riches (`project.drumPatterns`)
Les patterns contiennent une grille de notes.
*   **Note** : `{ time, velocity, fill, active }`
*   Le Pattern référence l'ID de la Piste Globale (ex: "Joue Note C4 sur Piste UUID-KICK").

### 3.3 Audio Engine (Single Source of Truth)
L'AudioEngine ne sera plus piloté "live" par React.
Il recevra les données (`drumTracks`, `synthTracks`) et exposera des méthodes de haut niveau :
*   `loadSong(project)` : Instancie les Tone.Sampler / Tone.Synth.
*   `schedulePattern(patternId)` : Programme la boucle de lecture.

## 4. Phases de Développement

### Phase 1 : Data Model Migration (Store)
**Impact Critique** : Va casser l'application temporairement.
1.  **Interfaces** : Mettre à jour `ProjectData`, `AudioTrack`, `Pattern`.
2.  **Store** : Réécrire les actions `createPattern`, `addTrack`, `updateTrack`.
3.  **Migration** : Adapter `DEFAULT_PROJECT` au nouveau format (6 pistes par défaut).

### Phase 2 : Audio Engine Simplification
1.  **Refactoring** : Nettoyer `AudioEngine.ts` pour utiliser la liste unifiée de pistes.
2.  **Scheduling** : Implémenter la méthode `schedulePattern` qui lit la nouvelle structure.
3.  **Synchronisation** : Mettre à jour `useProjectAudio.ts` pour qu'il soit un simple pont React <-> Engine.

### Phase 3 : Composants UI
1.  **JuicyBox** :
    *   Header (Gauche) : Affiche la liste `project.drumTracks`.
    *   Grid (Centre) : Affiche les notes du pattern actif.
    *   Mixer : Contrôle `drumTrack.mixer`.
2.  **Timeline** :
    *   Adaptation du rendu des pistes pour correspondre aux pistes globales.
    *   Correction du Drag & Drop (Vérification de type stricte).

### Phase 4 : Vérification & TDD
Nous validerons les fonctionnalités suivantes :
1.  **Playback Batterie** : Vérifier que Volume/Mute/Solo affecte toutes les notes, quel que soit le pattern.
2.  **Switch Pattern** : Vérifier que le changement de pattern est instantané (pas de rechargement de sample).
3.  **Sample Swap** : Vérifier qu'on peut changer le sample d'une piste (Kick 808 -> Kick 909).

## 5. Fichiers Impactés (Doc Checklist)
*   `docs/02_conception/01_architecture/state_management.md` (Fait)
*   `docs/02_conception/01_architecture/architecture_generale.md` (Fait)
*   `client/src/store/projectStore.ts`
*   `client/src/audio/AudioEngine.ts`
*   `client/src/components/organisms/JuicyBox/JuicyBox.tsx`

---
**Note** : Ce plan remplace les anciennes spécifications relatives à la gestion des patterns de batterie dans `03_juicybox_drum_machine.md`.

## 6. Analyse d'Impact (Deep Dive)

### 6.1 Impact API & Backend
*   **Payloads** : La structure JSON change radicalement (`api_payloads.md` mis à jour).
    *   `tracks` (anciennement liste unifiée ou nested) -> Devient `drumTracks` + `melodicTracks`.
    *   `drumPatterns` -> Ne contient plus `tracks` mais `clips`.
*   **Backend Symfony** :
    *   Les entités utilisent `JSONB`, donc **pas de migration de schéma SQL** requise.
    *   **Attention** : Les validateurs Symfony (si existants) vérifiant la structure du JSON devront être mis à jour.
*   **Compatibilité** : Les anciens projets en base ne pourront plus être chargés. (Breaking Change assumé pour le MVP).

### 6.2 Impact Tests (Frontend)
*   **`projectStore.test.ts`** :
    *   Les tests actuels vérifient `pattern.tracks[...]`. Tout va casser.
    *   **Action** : Réécriture complète des tests pour vérifier `project.drumTracks[...]` et `pattern.clips[...]`.
*   **`useProjectAudio.test.ts`** :
    *   La logique de playback va changer. Les tests unitaires du séquenceur devront mocker le nouveau store.
