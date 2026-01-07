# Bibliothèque de Composants (Atomic Design)

Ce document recense l'ensemble des composants React nécessaires pour l'application. L'approche **Atomic Design** favorise la réutilisabilité et la cohérence.

## 1. Atoms (Composants Indivisibles)
Les briques élémentaires de l'interface.

| Composant | Description | Interface Props (TypeScript) |
| :--- | :--- | :--- |
| **`Avatar`** | Image de profil ronde ou placeholder. | `{ src?: string; alt: string; size?: 'sm' \| 'md' \| 'lg'; }` |
| **`Switch`** | Interrupteur binaire (ON/OFF). | `{ checked: boolean; onChange: (val: boolean) => void; label?: string; }` |
| **`Led`** | Indicateur lumineux d'état. | `{ active: boolean; color?: string; size?: number; onClick?: () => void; }` |
| **`Input`** | Champ de saisie texte standard. | `{ value: string; onChange: (val: string) => void; placeholder?: string; type?: string; }` |
| **`Select`** | Menu déroulant simple. | `{ options: { label: string; value: string }[]; value: string; onChange: (val: string) => void; }` |
| **`Knob`** | Potentiomètre rotatif. | `{ value: number; onChange: (val: number) => void; min?: number; max?: number; size?: number; label?: string; }` |
| **`Fader`** | Slider vertical. | `{ value: number; onChange: (val: number) => void; min?: number; max?: number; height?: number; label?: string; }` |
| **`Button`** | Bouton d'action standard. | `{ onClick?: () => void; variant?: 'primary' \| 'secondary' \| 'ghost'; size?: 'sm' \| 'md' \| 'lg'; disabled?: boolean; children: React.ReactNode; }` |
| **`DragInput`** | Input numérique contrôlé par glisser. | `{ value: number; onChange: (val: number) => void; min?: number; max?: number; label?: string; hideLabel?: boolean; sensitivity?: number; }` |
| **`FXSlot`** | Slot d'effet compact pour ChannelStrip. | `{ type: string; enabled: boolean; onClick: () => void; onToggle: () => void; }` |

## 2. Molecules (Combinaisons Simples)
Assemblage d'atomes pour former une fonction.

| Composant | Description | Composition |
| :--- | :--- | :--- |
| Composant | Description | Interface Props (TypeScript) |
| :--- | :--- | :--- |
| **`TransportControls`** | Barre de lecture + BPM + Mode. | `{ ... playMode?: 'PATTERN' \| 'SKYLINE'; ... }` <br> _Mode Switch: 🔁 PATTERN (Loop 4 bars) / 🏙️ SKYLINE (Song Mode / Linear)_ |
| **`Pagination`** | Navigation par Ancres (Scroll). | `{ totalPages: number; currentPage: number; playingPage: number; onPageSelect: (page: number) => void; }` <br> _Usage: Navigation rapide sur grille 128 steps (Ancres: 1, 33, 65, 97)_ |
| **`TrackHeader`** | En-tête de piste (Vol/Mute/Solo/Output). | `{ track: Track; onVolumeChange?: func; onMuteChange?: func; onSoloChange?: func; onOutputChange?: func; }` <br> _Output Selector: Glisser pour choisir l'Insert (CI 1-10)._ |
| **`DrumLane`** | Ligne complète (Header + Seq). | `{ track: Track; onUpdateTrack: (t: Track) => void; playingStep: number; }` |
| **`StepCell`** | Case unique. | `{ isActive?: boolean; isPlaying?: boolean; mode?: 'trigger' \| 'volume' \| 'fill'; value?: number; onClick?: () => void; isAltBeat?: boolean; }` <br> _Usage: Trigger (On/Off), Volume (Safe Click + Drag Vertical), Fill (Probability)_ |
| **`PianoRoll`** | Éditeur de notes midi (grille temps/hauteur). | `Canvas` interactif (Konva/Pixi) ou SVG. <br> **Important** : Doit supporter le scroll vertical ou le zoom pour afficher les octaves basses (C1) générées par l'IA. |
| **`StepSequencer`** | Grille rythmique pour drum machine (16 pas). | Boutons `Toggle` (On/Off) |répété |
| **`NoteItem`** | Note manipulable sur la grille. | `div` (Resizable), `onDrag` |
| **`ADSRGraph`** | Visualisation de l'enveloppe. | Canvas HTML5 + `Knob` values |
| **`WaveformSelect`** | Choix de la forme d'onde. | `Button` Group (Sine, Square, Saw...) |
| **`FilterControls`** | Réglages du filtre (Cutoff, Reso). | `Knob` x2 |
| **`FXCard`** | Carte de réglage d'un effet générique. | `type` (reverb, delay...), `params` (obj), `onUpdate` |
| **`FXInspector`** | Inspecteur complet des effets d'un channel. | `{ channelId: string; }` <br> _Gestion CRUD des effets + Paramètres temps réel (Reverb, Delay, Disto, Chorus)._ |
| **`EqualizerCard`** | Carte spécialisée EQ 5 bandes. | `bands` [low, lo-mid, mid, hi-mid, high], `Knob` x5 |
| **`TimeDisplay`** | Afficheur style LCD indiquant la position temporelle (Mesure:Temps:Pas). | `HTML5` |
| **`Toast`** | Notification flottante. | `message`, `type` (success/error) |
| **`VariationSelector`** | Choix de la variation IA (A/B/C). | `Button` Group + `AudioPreview` |
| **`SpectrumAnalyzer`** | Visualisation spectrale temps réel. | Canvas HTML5 (Frequency Domain) <br> _Échelle Logarithmique (20Hz-22kHz)._ |
| **`MiniScope`** | Petit visualiseur pour navbar/synthé. | Canvas HTML5 (Time/Frequency) |
| **`AIPrompt`** | Interface de prompt IA avec badges contextuels. | `{ onMelodyGenerated: (notes: Note[], reqId: string) => void; className?: string; }` <br> _Connecté au `ProjectStore` pour lire BPM/Key. Contient `Textarea` et bouton `Generate`._ |
| **`DropdownMenu`** | Menu déroulant contextuel. | `{ label: string; icon?: ReactNode; items: MenuItem[]; }` <br> _Usage: TopBar (File, Help)._ |
| **`ConfirmModal`** | Modale de confirmation destructrice. | `{ isOpen: boolean; onClose: func; onConfirm: func; title: string; message: string; }` <br> _Usage: Reset Project, Delete Track._ |
| **`ChannelStrip`** | Tranche de console complète. | `{ track: Track; }` <br> _Compose Fader (0-1), Pan Knob, Routing Selector et FX Slots._ |

## 3. Organisms (Zones Fonctionnelles)
Assemblage complexe formant une section de l'interface.

| Composant | Description | Interface Props (TypeScript) |
| :--- | :--- | :--- |
| **`TopBar`** | Barre supérieure purement globale. | `None` (Connecté au `useAppStore`). <br> _Contient `TransportControls`, `DropdownMenus` (Projet, Aide), User Info & Modals (Login, Save, Load, About)._ |
| **`JuicyBox`** | Séquenceur de batterie (Smart Container). | `None` (Self-managed). <br> _Contient sa propre `Toolbar` (Pattern & View Selectors) et la `JuicyBoxGrid`._ |
| **`SynthPanel`** | Panneau de contrôle Synthé (Rack). | `{ trackId: number; }` <br> _Connecté au Store Global. Header (Mute/Vol) + Enveloppe + OSC._ |
| **`AIComposerPopover`** | Popover compact pour la génération IA. | `{ onClose: func; onGenerated: func; triggerRef?: React.RefObject; }` <br> _ remplace la Modale. S'affiche sous le bouton déclencheur. Permet le playback pendant l'affichage._ |
| **`PianoRoll`** | Éditeur mélodique complet. | `{ trackId: number; currentPage: number; totalPages: number; onPageSelect: func; isPlaying?: boolean; playingStep?: number; onPlay?: func; onStop?: func; bpm?: number; }` <br> _Sticky Layout + Embedded Controls. Occupe la zone centrale de l'écran._ |
| **`MixerBoard`** | Table de mixage complète. | `None` (Connecté au Store). <br> _Architecture 3-Tier: Master (Left) <- Groups (CG1-4) <- Inserts (CI1-10)._ |

## 4. Templates (Mise en Page)
Structure globale des pages.

*   **`StudioLayout`** :
    *   **Header** : `TopBar`
    *   **Left Panel** : `SidePanel` (Contextuel : Browser ou AIPrompt)
    *   **Main Content** : `Sequencer`, `PianoRoll` ou `MixerBoard` (Onglets)
    *   **Right Panel** : `SidePanel` (Contextuel : Routing ou FXChain)
    *   **Overlays** : `ToastContainer`, `Modal` (si besoin)
