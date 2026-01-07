# Plan Détaillé 14 : Refonte Audio & Rack (V2)

**Statut** : 🟢 Terminé (Intégré dans Plan 15)
**Date** : 27/12/2025
**Réf. Architecture** : `docs/05_reference_technique/architecture_frontend.md`

## 1. Vision & Objectifs
Passer d'un moteur audio "à plat" (toutes les pistes vers le Master) à une architecture de **Mixage structuré** (Groupes/Bus) et modulaire (**Rack**).

### Objectifs Clés
1.  **Architecture de Bus** : Drums -> JuicyBus, Synths -> SynthBus. Volumes indépendants.
2.  **Modularité** : Chaque piste doit pouvoir accueillir une chaîne d'effets (Insert FX).
3.  **Flexibilité** : Lever la limite des 6 pistes pour JuicyBox (Dynamic Tracks).

## 2. État Avancement

### 2.1 Architecture de Bus (Terminé)
Implémenté le 17/12/2025.
*   **AudioEngine** :
    *   `busJuicy` : Reçoit toutes les pistes de type `sampler`.
    *   `busSynth` : Reçoit toutes les pistes de type `synth`.
    *   Les deux bus routent vers le `Master`.
*   **Contrôle Global** :
    *   Knobs dédiés dans la `TopBar`.
    *   State `juicyVolume` / `synthVolume` dans `useAppStore`.

### 2.2 Rack & Effets (En Pause / A Venir)
Ce chantier a été mis en pause pour prioriser la **Skyline**.
*   **Modèle de Données** : Ajouter `effects: FX[]` dans `TrackMixer`.
*   **UI** : Créer le composant `EffectRack`.
*   **AudioEngine** : Implémenter le chaînage dynamique Tone.js.

### 2.3 Dynamic Tracks (En Pause)
Ce chantier dépend de l'implémentation d'un **Browser de Samples** (Left Panel) pour avoir du sens UX.

## 3. Plan d'Action Restant (Backlog)

### Phase A : Rack FX
- [ ] Définir interface `AudioEffect` (Type, Params).
- [ ] Implémenter logique `rebuildChain()` dans `AudioEngine` track sync.
- [ ] UI : Bouton "FX" sur la piste -> Ouvre Modal ou Panel Latéral.

### Phase B : Dynamic Tracks
- [ ] UI : Bouton "Add Track" dans JuicyBox.
- [ ] Store : Action `addTrack(type)`.
- [ ] Gestion suppression et ré-indexation des patterns.
