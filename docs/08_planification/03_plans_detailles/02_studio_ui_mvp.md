# Plan d'Implémentation : Studio UI (Phase 2)

Ce plan détaille la construction de l'interface React, en se basant sur les maquettes et l'inventaire des composants.

## 1. Inventaire & Stratégie
L'inventaire complet des composants UI est défini dans **[`docs/02_conception/04_interface_ui/ui_composants.md`](../../02_conception/04_interface_ui/ui_composants.md)**.
Nous ne listerons ici que l'ordre de fabrication technique.

**Stratégie** : Atomic Design (Atoms -> Molecules -> Organisms -> Templates).

## 2. Socle Technique (Architecture)
Avant de faire du joli, on fait du solide.

- [x] **Setup Store & Router**
    - [x] `Zustand` : Créer `useAppStore` (pour l'instant vide).
    - [x] `React Router` : Configurer les routes `/`, `/login`, `/studio`.
- [x] **Design System (Fundations)**
    - [x] Variables CSS (`index.css`) : Couleurs (Palette Dark), Typos, Spacings.
    - [ ] Reset CSS & Utilitaires.

## 3. Implémentation des Composants (Ordre Logique)

### A. Atoms (Base)
*D'après `ui_composants.md`*
- [x] `Button` (Primary, Secondary, Icon).
- [x] `Knob` (Potentiomètre rotatif SVG).
- [x] `Fader` (Slider vertical).
- [x] `Led` (Témoin lumineux).
- [x] `Switch` (Interrupteur).

### B. Molecules (Fonctionnel)
- [x] `TransportControls` (Play/Stop + BPM).
- [x] `TrackHeader` (Nom piste + Mute/Solo).
- [x] `StepCell` (Case multi-mode).
- [x] `Pagination` (Navigation Séquenceur).
- [x] `DrumLane` (Ligne complète).
- [ ] `Pad` (Drum Pad interactif).

### C. Organisms (Complexes)
- [x] `JuicyBox` (Boîte à rythmes complète).
- [x] `Sequencer` (Grille logique).
- [ ] `Rack` (Conteneur d'effets/synthés).
- [ ] `PianoRoll` (Grille de notes - *Gros morceau*).
- [ ] `Mixer` (Ensemble des Faders).

## 4. Pages & Layouts
- [ ] **Login Page** : Formulaire simple connectée à l'API Auth.
- [ ] **Project List (Overlay)** : Modale de démarrage (Liste des projets User).
- [ ] **Studio Layout** : L'écran principal (Navbar + Sidebar + Main Area).

## 5. Connexion API (Intégration)
- [ ] Service `auth.ts` : Login/Logout + Stockage Token.
- [ ] Service `projects.ts` : Fetch & Create.
