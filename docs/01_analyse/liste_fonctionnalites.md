# Liste Exhaustive des Fonctionnalités (Checklist)

Ce document recense toutes les fonctionnalités attendues pour le MVP, organisées par thème et importance (MoSCoW).
Il sert de référence pour vérifier que chaque fonction dispose d'un composant UI associé.

## 1. Interface & Navigation (UI/UX)
Structure globale de l'application (Layout).

| ID | Fonctionnalité | Priorité | Description | Composant UI Associé |
| :--- | :--- | :--- | :--- | :--- |
| **UI-01** | **Layout Studio** | **MUST** | Structure 3 colonnes (Left, Main, Right) avec navigation par Onglets. | `StudioLayout` |
| **UI-02** | **Left Panel (Contextuel)** | **MUST** | Panneau rétractable gauche. Contenu change selon la vue active. | `SidePanel` (Left) |
| **UI-03** | **Right Panel (Contextuel)** | **MUST** | Panneau rétractable droit. Contenu change selon la vue active. | `SidePanel` (Right) |
| **UI-04** | **Thèmes** | **SHOULD** | Support Dark/Light/Red Core via `data-theme`. | `ThemeSwitcher` |
| **UI-05** | **Notifications** | **SHOULD** | Toasts pour feedback (Save, Undo, Error, IA Loading). | `ToastContainer` |
| **UI-06** | **Responsive Mobile** | **COULD** | Adaptation basique (Masquer panels, Stack layout). | `MediaQuery` |

## 2. Gestion Utilisateur (User)
Compte, Identité et Préférences.

| ID | Fonctionnalité | Priorité | Description | Composant UI Associé |
| :--- | :--- | :--- | :--- | :--- |
| **US-01** | **Inscription / Connexion** | **MUST** | Formulaire JWT (Email/Pass). | `AuthForm` |
| **US-02** | **Profil Utilisateur** | **SHOULD** | Édition Username, Email. | `UserProfileForm` |
| **US-03** | **Préférences** | **SHOULD** | Choix Langue (FR/EN) et Thème par défaut. | `PreferencesPanel` |
| **US-04** | **Avatar** | **COULD** | Placeholder ou Gravatar. | `Avatar` |

## 3. Gestion Projet (Project)
Cycle de vie des créations.

| ID | Fonctionnalité | Priorité | Description | Composant UI Associé |
| :--- | :--- | :--- | :--- | :--- |
| **PR-01** | **Créer / Sauvegarder** | **MUST** | Nouveau projet, Save (CTRL+S). | `ProjectMenu` |
| **PR-02** | **Charger** | **MUST** | Liste des projets personnels. | `ProjectList` |
| **PR-03** | **Historique Versions** | **SHOULD** | Liste des sauvegardes précédentes (Restore). | `VersionHistory` |
| **PR-04** | **Undo / Redo** | **SHOULD** | Annuler/Rétablir (20 niveaux). | `UndoRedoControls` |
| **PR-05** | **Fork (Dupliquer)** | **COULD** | Créer une copie d'un projet existant. | `Button` (Fork) |

## 4. Vue "Drum Machine" (Séquenceur)
Contexte : Création de rythmes.

| ID | Fonctionnalité | Priorité | Description | Composant UI Associé |
| :--- | :--- | :--- | :--- | :--- |
| **DM-01** | **Grille 16 pas** | **MUST** | Matrice de cellules activables. | `SequencerGrid` |
| **DM-02** | **Browser Samples (Gauche)** | **MUST** | Arborescence Samples/Kits. Drag & Drop. | `FileBrowser` |
| **DM-03** | **Routing Audio (Droite)** | **SHOULD** | Sélection sortie (Master/Bus) par piste. | `RoutingPanel` |
| **DM-04** | **Mute/Solo Piste** | **MUST** | Contrôle rapide par piste. | `TrackHeader` |
| **DM-05** | **Pages (16-32-48-64)** | **SHOULD** | Navigation entre les mesures. | `Pagination` |

## 5. Vue "Synthétiseur" (Mélodie)
Contexte : Création de mélodies et design sonore.

| ID | Fonctionnalité | Priorité | Description | Composant UI Associé |
| :--- | :--- | :--- | :--- | :--- |
| **SY-01** | **Piano Roll** | **MUST** | Éditeur notes (Hauteur/Temps). Zoomable. | `PianoRoll` |
| **SY-02** | **Prompt IA (Gauche)** | **MUST** | Zone texte + Bouton Générer. | `AIPromptPanel` |
| **SY-03** | **IA Feedback** | **MUST** | Loader "Génération..." + Erreurs. | `Loader`, `Toast` |
| **SY-04** | **IA Variations** | **MUST** | Choix entre 3 propositions (A/B/C) avec écoute. | `VariationSelector` |
| **SY-05** | **Oscillateurs** | **MUST** | Choix Waveform (Sine, Square, Saw). | `WaveformSelect` |
| **SY-06** | **Enveloppe ADSR** | **MUST** | 4 Knobs (A,D,S,R) + Graphe interactif. | `ADSRGraph`, `Knob` |
| **SY-07** | **Filtre** | **SHOULD** | Cutoff + Resonance (Knobs). | `FilterControls` |
| **SY-08** | **Routing Audio (Droite)** | **SHOULD** | Sélection sortie. | `RoutingPanel` |

## 6. Vue "Mixer" (Table de Mixage)
Contexte : Équilibrage et Effets.

| ID | Fonctionnalité | Priorité | Description | Composant UI Associé |
| :--- | :--- | :--- | :--- | :--- |
| **MX-01** | **Faders Volume** | **MUST** | Contrôle volume (-inf à +6dB). | `Fader` |
| **MX-02** | **Panoramique** | **MUST** | Contrôle stéréo (L/R). | `Knob` |
| **MX-03** | **Mute/Solo** | **MUST** | Isolation piste. | `Button` |
| **MX-04** | **Vumètres** | **SHOULD** | Visualisation niveau audio (Peak). | `Vumeter` |
| **MX-05** | **FX Chain (Droite)** | **MUST** | Liste effets insert (Reverb, Delay). | `FXChainPanel` |
| **MX-06** | **FX Bypass** | **MUST** | On/Off par effet. | `Switch` |
| **MX-07** | **FX Params** | **MUST** | Knobs contextuels selon l'effet. | `FXCard` |

## 7. Transport & Global
Fonctions transverses.

| ID | Fonctionnalité | Priorité | Description | Composant UI Associé |
| :--- | :--- | :--- | :--- | :--- |
| **GL-01** | **Play/Stop/Rec** | **MUST** | Contrôle lecture (Barre espace). | `TransportBar` |
| **GL-02** | **BPM / Swing** | **MUST** | Réglage tempo global. | `BpmInput` |
| **GL-03** | **Master Volume** | **MUST** | Limiteur sortie générale. | `MasterFader` |
| **GL-04** | **Analyse Spectrale** | **COULD** | Visualisation fréquences (Canvas). | `SpectrumAnalyzer` |
