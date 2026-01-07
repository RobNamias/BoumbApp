# Maquettes & Wireframes

Ce document décrit la structure visuelle des écrans clés de l'application.
*Outil de conception recommandé : Figma ou Penpot.*

## 1. Structure Globale (StudioLayout)
L'écran principal de production musicale ("Le Studio").

### Layout 3 Colonnes + Header
```text
+---------------------------------------------------------------+
| [TopBar]  Transport (Play/Stop/BPM)            | [Master Knob] |
+---------------------------------------------------------------+
| [Left Panel]  | [Main Content (Tabs)]         | [Right Panel] |
|               |                               |               |
| Contextuel :  | **Zone Song / Loop**          | Contextuel :  |
| - Browser     | - Timeline (Haut)             | - Routing     |
| - AI Prompt   | - Pattern Editor (Bas)        | - FX Chain    |
|               |                               |               |
| (Retractable) |                               | (Retractable) |
+---------------------------------------------------------------+
```

## 2. Comportements Contextuels

### A. Vue "Drum Machine"
*   **Main** : 
    *   **Toolbar** : Pattern Selector + View Mode (Trigger/Vel/Fill).
    *   **Grid** : Matrice 16 pas (Sequencer).
*   **Left Panel** : **Browser** (Samples, Kits).
    *   *Action* : Drag & Drop d'un sample depuis le panel vers une ligne de la grille.
*   **Right Panel** : **Routing**.
    *   *Contenu* : Selecteur de sortie (Master, Bus A, Bus B) pour la piste sélectionnée.

### B. Vue "Synthétiseur"
*   **Main** : Piano Roll + Clavier + **Synth Controls** (Osc, ADSR, **Preset Select**).
*   **Left Panel** : **Rack Vertical** (Navigation).
    *   *Contenu* : Liste des 3 synthés (Cards compactes : Nom, Vol, Mute).
    *   *Interaction* : Clic sur une card change le Main Content.
*   **Right Panel** : **AI Assistant** (Helper Column).
    *   *Contenu* : Zone de Prompt ("Génère une basse acid"), Suggestions, Historique.
    *   *Note* : IA contextuelle au synthé actif. Prioritaire pour Phase 7.

### C. Vue "Mixer" (Onglet dédié)
*   **Main** : Table de mixage complète (Faders, Vumètres).
*   **Left Panel** : **Master Section & Monitoring**.
    *   *Haut* : **Analyseur de Spectre** (Grand Canvas).
    *   *Bas* : **Master Fader** (Sortie Générale).
    *   *Note* : Pour analyser une piste seule, utiliser le bouton SOLO de la piste.
*   **Right Panel** : **FX Chain**.
    *   *Contenu* : Effets d'insert de la piste sélectionnée (EQ, Compresseur...).

## 3. Écrans Annexes (Overlay & Modales)

### Landing Overlay (Splash Screen)
*   **Concept** : Écran de démarrage pur.
*   **Visuel** : Logo centré, Nom de l'app, arrière-plan flouté ou animé.
*   **Interaction** : Clic n'importe où -> Fade out -> Apparition du Studio.

### Modale Gestion Projet (Rplace Dashboard)
*   **Accès** : Menu Navbar "Projet" > "Ouvrir".
*   **Contenu** :
    *   Liste des projets (Grille ou Liste).
    *   Barre de recherche.
    *   Bouton "+ Nouveau".
    *   Onglets : "Moi", "Démos", "Partagés avec moi".

### Modale Authentification
*   **Accès** : Menu Navbar "User" ou Tentative de sauvegarde Guest.
*   **Layout** : Petite modale centrée (Tabs : Connexion / Inscription).
*   **Champs** : Email, Password (+ Pseudo si Inscription).
