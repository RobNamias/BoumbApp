# Plan Détaillé : Phase 8 - Assemblage & Application Finale

**Objectif** : Passer d'une collection de POCs et de modules isolés (JuicyBox, SynthLab) à une **DAW complète et unifiée** (BoumbApp).
**Philosophie** : "Consolider avant de Construire".

## 1. Audit & Consolidation (Le "Check-up")

### 1.1 Revue Documentaire vs Réalité (Status Quo)
*   **UI Maquettes** : Le concept "3 colonnes" (Browser/Main/Helper) n'est **PAS implémenté**. Nous avons des pages isolées (`/drum-machine`, `/synth-lab`).
*   **Données** : L'entité `Project` existe en BDD (PHP) mais le Frontend n'a **AUCUNE structure Project**. Le `useTracksStore` gère un état plat et volatil.
*   **Pattern** : Le code actuel gère 1 seule boucle de 128 pas. Il n'y a pas de notion de "Pattern A" vs "Pattern B".

### 1.2 Gap Analysis (Ce qui manque pour le MVP)
1.  **Architecture Multi-Patterns (Song Mode)** :
    *   Pivot Majeur : Abandon du Pattern unique 128 steps.
    *   Adoption : Patterns multiples de 32 steps (A, B, C, D).
    *   Voir : `docs/01_analyse/specifications_song_mode.md`.
2.  **Le Container "ProjectState" (Zustand)** :
    *   Il faut monter d'un niveau d'abstraction.
    *   Actuel : `TracksStore` = Mixer + Pattern unique.
    *   Cible : `ProjectStore` = `Patterns[]` + `SongStructure` + `MixerState`.
3.  **Le "Shell" (Coquille Applicative)** :
    *   Il manque le `MainLayout` qui persiste la Sidebar et le Transport Bar pendant la navigation.
4.  **La Persistance JSON** :
    *   Aucune fonction ne transforme l'état React en JSON compatible BDD.

## 2. Architecture "Coquille" (Le Squelette UI)
Mettre en place la structure d'accueil qui va héberger les modules.
*   [x] **MainLayout définitif**
    *   [x] Sidebar de Navigation (Icones : Arrangement, Session, Mixeur, Paramètres).
    *   [x] TopBar (Transport Global, Titre Projet, User Profile).
    *   [x] Zone de Contenu Dynamique (Router Outlet).
*   [ ] **Gestionnaire de Modales & Toasts**
    *   [ ] Système centralisé pour les dialogues (Save, Confirm, Alert).

## 3. Le "Mode Song" (Arrangement View)
C'est la nouvelle fonctionnalité majeure : sequencer les patterns dans le temps.
*   [ ] **Conception Technique**
    *   [ ] Définir la structure de données `TimelineTrack` et `TimelineClip`.
*   [ ] **Composant Timeline**
    *   [ ] Grille temporelle (Mesures/Temps).
    *   [ ] Pistes (Lignes horizontales).
    *   [ ] Clips (Blocs déplaçables représentant un Pattern).

## 4. Intégration des Modules Existants
Transformer nos "Pages" actuelles en "Composants" intégrables.
*   [ ] **Refactoring JuicyBox**
    *   [ ] Transformer `JuicyBoxPage` en `PatternEditorComponent`.
    *   [ ] Lui permettre de charger n'importe quel ID de Pattern (prop).
*   [ ] **Refactoring SynthLab**
    *   [ ] Transformer `SynthLabPage` en `DeviceEditorComponent`.
    *   [ ] Le connecter à la piste sélectionnée.

## 5. Persistance (Save/Load)
*   [ ] **Sérialisation** : Créer la fonction `ProjectToJSON()`.
*   [ ] **Désérialisation** : Créer la fonction `JSONToState()`.
*   [ ] **API** : Connecter aux endpoints Symfony `POST /projects`.

---

## Protocole de Validation
*   Chaque étape doit être documentée AVANT le code (@[/withdoc]).
*   Chaque étape doit être testée (Visuel + Unitaire).
