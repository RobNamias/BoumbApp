# Plan Détaillé 16 : Final Verification & Release Candidate

**Statut** : � En Cours
**Date** : 27/12/2025
**Réf.** : `docs/02_plan_maitre.md`

## 1. Vision & Objectifs
Valider la stabilité, l'utilisabilité et la robustesse de l'application (MVP) avant la livraison finale. Il s'agit de simuler une session utilisateur complète ("Creative Flow") et de chasser les derniers bugs critiques.

## 2. Protocole de Test (End-to-End)

### 2.1 Le "Creative Flow" (Utilisateur Standard)
**Scénario** :
1.  **Onboarding** : Login (Mock) -> Dashboard.
2.  **Création** : Nouveau Projet "My Hit Song".
3.  **Inspiration (AI)** :
    *   Ouvrir `AIComposerPopover`.
    *   Générer une mélodie "Funk Bassline".
    *   Accepter et charger dans le `SynthLab`.
4.  **Rythmique (JuicyBox)** :
    *   Créer un pattern de batterie simple (Kick/Snare/Hat).
    *   Assigner les sorties : Kick -> CI 1, Snare -> CI 2.
5.  **Mixage (The Sauce)** :
    *   Ouvrir le Mixer.
    *   Insérer une Reverb sur le Snare (CI 2).
    *   Ajuster les nvx et le Pan.
    *   Créer un Groupe (CG 1) pour les Drums.
6.  **Arrangement (Skyline)** :
    *   Copier les patterns dans la Timeline (Song Mode).
    *   Lire le morceau entier.
7.  **Persistance** :
    *   Sauvegarder le projet.
    *   Reload la page (F5).
    *   Vérifier que tout (Notes, FX, Routing, Mix) est restauré.

### 2.2 Cross-Browser Check
| Navigateur | Critères Spécifiques | Statut |
| :--- | :--- | :--- |
| **Chrome** | Performance Audio, WebMIDI (Si utilisé). | ⚪ |
| **Firefox** | Input Spinners (Fixé), AudioContext Unlock. | ⚪ |
| **Edge** | (Moteur Chromium) - Vérif rapide. | ⚪ |

### 2.3 Mobile / Responsive (Basic)
*   **Objectif** : L'interface ne doit pas être cassée (pas de chevauchement bloquant), même si l'usage principal est Desktop.
*   **Checklist** :
    *   TopBar responsive (Menu burger si besoin ou scrolling).
    *   Mixer scrollable horizontalement.
    *   Disparition des panneaux latéraux si écran trop petit.

## 3. Critères de Succès (Definition of Done)
1.  **Zéro Crash** : Pas de "White Screen of Death".
2.  **Audio Clean** : Pas de glitchs majeurs, Mute/Solo fiables.
3.  **Console Clean** : Pas d'erreurs rouges (sauf liées au réseau/HMR).
4.  **UX Fluide** : Pas de latence d'interface > 200ms sur les clics.

## 4. Stratégie d'Exécution
1.  **Exécution Manuelle** : Je vais jouer le scénario moi-même en vérifiant le code et les logs.
2.  **Correction à la Volée** : Si un bug mineur est trouvé -> Fix immédiat.
3.  **Rapport** : Mise à jour du `walkthrough.md` avec les résultats.
