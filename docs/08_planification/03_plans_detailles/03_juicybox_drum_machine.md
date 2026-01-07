# Plan Détaillé : JuicyBox (Boîte à Rythmes)

Ce document détaille l'implémentation complète du composant `JuicyBox` (Drum Machine), cœur rythmique de Boumb'App.

## 1. Objectifs & Périmètre
Implémenter l'Organisme `JuicyBox` en suivant une approche incrémentale stricte (Ligne -> Matrice -> Globaux) pour garantir la stabilité du flux audio et de l'UI.

**Référence Specs :** `specifications_mvp.md` (Sections 5.2 et 5.4.1.bis).

## 2. Architecture des Composants

### 2.1 Hiérarchie Atomic Design
*   **Organisme** : `JuicyBox` (Conteneur Principal).
*   **Molécule** : `DrumLane` (Une ligne de piste).
    *   **Zone Contrôle** (`TrackHeader`) : Nom Sample, Volume, Pan, Mute, Solo.
    *   **Zone Séquence** (`Sequencer`) : Le composant Organism existant (16 steps).
*   **Data** : `steps` (Array 16), `sample` (Path), `params` (Vol, Pan, Mute).

## 3. Plan d'Implémentation Incrémental

### Phase 1 : La Ligne Unique (DrumLane)
**Objectif :** Valider l'affichage et le contrôle d'une seule piste complète.

1.  **Création `DrumLane`** (Molécule/Organisme composite).
    *   Props : `trackData` (id, name, color, steps...), `onUpdate`.
    *   Layout : Flex Row [Header (20%)] + [Sequencer (80%)].
2.  **Implémentation `TrackHeader`**.
    *   Affichage Nom du Sample (ex: "Kick 808").
    *   Contrôles : Volume (`Knob` ou `Fader`), Bypass (`Switch` ou `Button` Mute), Output Select (`Select` routing Mixer).
3.  **Intégration `Sequencer`**.
    *   Connecter le `Sequencer` existant à la `DrumLane`.
    *   S'assurer que les data remontent bien.
4.  **Test Isolé** : `DrumLane.test.jsx`.

### Phase 2 : La Matrice (Multi-Lignes) - **TERMINE**
**Objectif :** Gérer l'affichage de plusieurs lignes et la cohérence visuelle.

** Architecture Retenue (Split Layout) :**
Plutôt qu'un tableau unique, utilisation de deux colonnes flex distinctes pour garantir des headers fixes.
*   **Colonne Gauche (`.juicy-box__headers`)** : Empilement des `TrackHeader`. Fixe en largeur.
*   **Colonne Droite (`.juicy-box__sequencers`)** : Empilement des `Sequencer`. Scrollable horizontalement (`overflow-x: auto`).
*   **Gestion du Scroll (TDD Fix)** :
    *   Le conteneur `.juicy-box__sequencers` est le **seul** élément scrollable.
    *   Les composants enfants `.sequencer` sont forcés en `overflow: visible` et `max-width: none` pour s'étendre totalement et déclencher le scroll du parent uniquement.
*   **Synchro** : Alignement strict des hauteurs de ligne (`60px`).

1.  **Création `JuicyBox`** (Organisme).
    *   State : Liste de `tracks` (Array).
    *   Render : Map de `DrumLane`.
2.  **Test de Charge (UI)**.
    *   Afficher 3 lignes (Kick, Snare, Hat).
    *   Vérifier l'alignement vertical des pas (Grille stricte).
    *   Vérifier le scrolling horizontal si écran étroit (fl-studio style).
3.  **Gestion des Samples**.
    *   Chargement mocké (ou réel si prêt) des samples par défaut.

### Phase 3 : Contrôles Globaux & Validation - **TERMINE**
**Objectif :** Finaliser l'instrument avec ses contrôles maîtres.

1.  **Global Controls**.
    *   [x] Connexion au `useTracksStore` pour la gestion Volume/Mute/Solo.
    *   [x] Volume Master JuicyBox (VCA).
    *   [x] Bypass Master JuicyBox.
2.  **Validation Finale**.
    *   [x] Vérification du Flux Audio théorique (UI seulement pour l'instant).
# Plan Détaillé : JuicyBox (Boîte à Rythmes)

Ce document détaille l'implémentation complète du composant `JuicyBox` (Drum Machine), cœur rythmique de Boumb'App.

## 1. Objectifs & Périmètre
Implémenter l'Organisme `JuicyBox` en suivant une approche incrémentale stricte (Ligne -> Matrice -> Globaux) pour garantir la stabilité du flux audio et de l'UI.

**Référence Specs :** `specifications_mvp.md` (Sections 5.2 et 5.4.1.bis).

## 2. Architecture des Composants

### 2.1 Hiérarchie Atomic Design
*   **Organisme** : `JuicyBox` (Conteneur Principal).
*   **Molécule** : `DrumLane` (Une ligne de piste).
    *   **Zone Contrôle** (`TrackHeader`) : Nom Sample, Volume, Pan, Mute, Solo.
    *   **Zone Séquence** (`Sequencer`) : Le composant Organism existant (16 steps).
*   **Data** : `steps` (Array 16), `sample` (Path), `params` (Vol, Pan, Mute).

## 3. Plan d'Implémentation Incrémental

### Phase 1 : La Ligne Unique (DrumLane)
**Objectif :** Valider l'affichage et le contrôle d'une seule piste complète.

1.  **Création `DrumLane`** (Molécule/Organisme composite).
    *   Props : `trackData` (id, name, color, steps...), `onUpdate`.
    *   Layout : Flex Row [Header (20%)] + [Sequencer (80%)].
2.  **Implémentation `TrackHeader`**.
    *   Affichage Nom du Sample (ex: "Kick 808").
    *   Contrôles : Volume (`Knob` ou `Fader`), Bypass (`Switch` ou `Button` Mute), Output Select (`Select` routing Mixer).
3.  **Intégration `Sequencer`**.
    *   Connecter le `Sequencer` existant à la `DrumLane`.
    *   S'assurer que les data remontent bien.
4.  **Test Isolé** : `DrumLane.test.jsx`.

### Phase 2 : La Matrice (Multi-Lignes) - **TERMINE**
**Objectif :** Gérer l'affichage de plusieurs lignes et la cohérence visuelle.

** Architecture Retenue (Split Layout) :**
Plutôt qu'un tableau unique, utilisation de deux colonnes flex distinctes pour garantir des headers fixes.
*   **Colonne Gauche (`.juicy-box__headers`)** : Empilement des `TrackHeader`. Fixe en largeur.
*   **Colonne Droite (`.juicy-box__sequencers`)** : Empilement des `Sequencer`. Scrollable horizontalement (`overflow-x: auto`).
*   **Gestion du Scroll (TDD Fix)** :
    *   Le conteneur `.juicy-box__sequencers` est le **seul** élément scrollable.
    *   Les composants enfants `.sequencer` sont forcés en `overflow: visible` et `max-width: none` pour s'étendre totalement et déclencher le scroll du parent uniquement.
*   **Synchro** : Alignement strict des hauteurs de ligne (`60px`).

1.  **Création `JuicyBox`** (Organisme).
    *   State : Liste de `tracks` (Array).
    *   Render : Map de `DrumLane`.
2.  **Test de Charge (UI)**.
    *   Afficher 3 lignes (Kick, Snare, Hat).
    *   Vérifier l'alignement vertical des pas (Grille stricte).
    *   Vérifier le scrolling horizontal si écran étroit (fl-studio style).
3.  **Gestion des Samples**.
    *   Chargement mocké (ou réel si prêt) des samples par défaut.

### Phase 3 : Contrôles Globaux & Validation - **TERMINE**
**Objectif :** Finaliser l'instrument avec ses contrôles maîtres.

1.  **Global Controls**.
    *   [x] Connexion au `useTracksStore` pour la gestion Volume/Mute/Solo.
    *   [x] Volume Master JuicyBox (VCA).
    *   [x] Bypass Master JuicyBox.
2.  **Validation Finale**.
    *   [x] Vérification du Flux Audio théorique (UI seulement pour l'instant).
    *   Vérification Responsive.
    *   [x] Tests d'intégration `JuicyBox.test.jsx`.

### Phase 4 : Finalisation & Polish (Post-Migration) - **A FAIRE**
**Objectif :** Rendre l'expérience utilisateur fluide et corriger les bugs de jeunesse.

4.  **Layout & CSS** - **TERMINE**
    - [x] Implémenter le "Split Layout" (CSS Grid ou Flexbox complexe).
    - [x] Full Width & Centrage (Support Grands Écrans).
5.  **Navigation Hybride (Scroll + Ancres)**.
    - [x] Structure : Grille unique de 128 steps (scrollable).
    - [x] Pagination : Boutons 1-4 servant d'ancres (Beats 1, 9, 17, 25).
    - [x] Auto-Scroll : Suivi de la tête de lecture (Mode Page).
    - [x] **Modes de Lecture** :
        -   *Pattern* : Boucle complète (8 mesures).
        -   *Page* : Boucle sur la page active (2 mesures).
6.  **Corrections Fonctionnelles**.
    - [ ] **Visualisation Lecture** : S'assurer que le `playingStep` illumine bien la colonne active.
    *   [ ] **Feedback Visuel** : S'assurer que les Mute/Solo mettent visiblement les pistes en retrait/avant.

## 4. Workflows & Commandes
*   Utiliser `npm test` fréquemment.
*   Valider chaque phase avant de passer à la suivante.
