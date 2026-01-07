# Cahier des Charges Fonctionnel - Boumb'App

## 1. Introduction
**Boumb'App** est une application web réplicant un mini-DAW (Digital Audio Workstation) orienté pour la performance live. Elle offre des outils de création musicale tels qu'une boîte à rythmes, des synthétiseurs, des effets et une table de mixage.

## 2. Public et Accessibilité
*   **Cible :** Accessible aux débutants, interface claire.
*   **Support :**
    *   **Priorité :** Desktop (DT) et Tablette (T).
    *   **Mobile (P) :** Format paysage utilisable, avec des fonctionnalités adaptées/réduites.
*   **Utilisateurs :**
    *   **UNC (Utilisateur Non-Connecté) :** Accès limité (démo, pas de sauvegarde cloud).
    *   **UC (Utilisateur Connecté) :** Accès complet (sauvegarde projets, import samples).
    *   **Admin :** Gestion utilisateurs et statistiques.

## 3. Interface Générale (Le Studio)
*   **Concept "Direct-to-Studio" :** L'application s'ouvre directement sur l'outil de création, précédé d'un simple Overlay (Splash Screen) interactif.
*   **Navbar fixe :** Barre de contrôle omniprésente en haut d'écran.
*   **Zone Principale :** Affichage d'un composant majeur à la fois (Boîte à rythme, Synthé, Mixer).
*   **Système de Modales :**
    *   **Gestion Projet / Profil :** Modales centrales pour remplacer les pages dédiées.
    *   **Gauche/Droite :** Tiroirs contextuels pour les réglages instruments et effets.
*   **Composants UI :** Utilisation intensive de potentiomètres (Knobs) standardisés.

## 4. Navigation (Navbar)
### 4.1 Menu Projet (Gauche)
*   **Type :** Dropdown (Mobile) ou Boutons (Desktop).
*   **Actions :**
    *   **Nouveau** : Reset du state actuel.
    *   **Ouvrir** : Affiche la **Modale de gestion de projets**.
    *   **Sauvegarder** : Save (ou Save As si nouvelle version).
    *   *(Futur)* : Importer (Beat/Synthé d'un autre projet).

### 4.2 Transport & Lecture (Centre)
Zone unifiée pour le contrôle du temps.
*   **Séquenceur :**
    *   **Drums (JuicyBox) :** Patterns de 32 pas (2 mesures).
    *   **Mélodie (SynthLab) :** Patterns de 64 pas (4 mesures) pour des phrases plus longues.
    *   **Piano Roll :** Interface grille notes/temps (Drag & Drop, Resize).
*   **Boutons :**
    *   **Play :** Lance la lecture.
    *   **Pause :** Arrête la lecture et maintient la tête de lecture. **Le bouton reste allumé** pour indiquer l'état de pause.
    *   **Stop :** Arrête la lecture et remet la tête de lecture au début (0:0:0).
*   **Raccourcis Clavier :**
    *   **Espace :** Toggle Play/Pause.
    *   **Double Stop (ou Espace+Shift) :** Retour au début.
*   **Mode de lecture :**
    *   **Loop Mode (Défaut) :** Boucle sur le(s) pattern(s) actif(s) (ex: Drum Pattern A + Synth Pattern A).
    *   **Loop Mode (Défaut) :** Boucle sur le pattern actif (32 steps max).
    *   **Song Mode (Skyline) :** Mode Séquenceur. Utilise un **Scheduler** qui lit la Timeline.
        *   Synchronisation : Le Scheduler interroge l'état du projet à chaque 16ème de note.
        *   Résolution : Détermine quels Clips sont actifs à l'instant T.
        *   Injection : Injecte les notes du Pattern source correspondant dans le moteur audio.
        *   Arrêt Auto : Détecte la fin du dernier clip pour arrêter ou boucler le morceau.
*   **Tempo :** Input BPM numéraire intégré à la barre de transport (ex: 120).
*   **Visualisation :**
    *   Repères page courante / tête de lecture.
    *   **Mini-Scope :** Petit analyseur de spectre (waveform ou barre) animé en permanence, reflétant la sortie Master.

### 4.3 Système & Aide (Droite)
*   **Aide (Dropdown) :** Liens vers documentation (Fonctionnement, Modules, About).
*   **User (Dropdown/Modale) :**
    *   **Si Guest :** Lien "S'inscrire / Se connecter" (Ouvre modale Auth).
    *   **Si Connecté :** Affiche Pseudo + Lien Profil / Paramètres.

### 4.7 Historique (Undo/Redo)
*   **Fonctionnalité :** Annuler ou rétablir les dernières actions.
*   **Accès :** Raccourcis clavier (Ctrl+Z / Ctrl+Y) et boutons dédiés (si place dispo).
*   **Capacité :** Historique des **20 dernières actions**.
*   **Notification :** Toast lors de l'annulation.





    *   **Modes de Vue (View Modes) :**
        *   Le séquenceur affiche une propriété à la fois pour l'ensemble des pas.
        *   **Trigger (Défaut) :** On/Off simple (LED). Click = Toggle.
        *   **Volume (Velocity) :** Barre verticale. Interaction : Click répété pour augmenter (cycle ex: 25%, 50%, 75%, 100%) ou Drag (glisser vertical).
        *   **Fill (Probabilité) :** Barre distincte. Interaction : Click pour cycler entre les probabilités (1/1, 1/2, 1/3, 1/4).

    *   **Paramètres par pas :**
        *   Actif/Inactif (Trigger).
        *   Volume individuel (0.0 - 1.0).
        *   **Probabilité (Fill) :** Chance de déclenchement (1, 2, 3, 4).

### 5.3 Synthétiseurs
*   **Nombre :** 3 sur Desktop/Tablette, 2 sur Mobile.
*   **Paramètres Sonores :**
    *   Forme d'onde (Waveform).

    *   **Enveloppe ADSR (Tone.js) :**
        *   Contrôles : Attack, Decay, Sustain, Release.
        *   **Visualisation Graphique :** Affichage dynamique de la courbe d'enveloppe (Canvas) qui se met à jour en temps réel lors de la manipulation des potards (Style FL Studio).

    *   Volume, Bypass.
    *   Routage Mixer.
    *   **Gestion des Presets :**
        *   Charger un preset (Usine ou Utilisateur) via un menu déroulant.
        *   Sauvegarder les réglages actuels comme nouveau preset utilisateur.
*   **Interface de Jeu (Piano Roll) :**
    *   Clavier vertical d'une octave (12 demi-tons).
    *   Distinction touches noires/blanches.
    *   Défilement des octaves.
    *   **Piano Roll Interactif :**
        *   Affichage des notes sous forme de blocs (rectangles) sur une grille temporelle.
        *   **Gestion de la durée :** Les notes sont redimensionnables horizontalement (étirement) pour définir leur durée (noire, blanche, etc.).
        *   **Édition :** Création par clic, suppression, redimensionnement par "drag & drop" du bord droit.
        *   **Visuel :** Distinction claire de la longueur (ex: une note de 2 temps occupe physiquement 2 colonnes).

    *   **Assistant IA (Magic Wand) :** Génération de mélodies via prompt textuel (voir `docs/01_analyse/fonctionnalite_ia_generative.md`).


### 5.4 Mixer
#### 5.4.1 Architecture Audio
*   **Types de Canaux :**
    *   **CI (Channel Individuel) :** Bleu. Source unique (ex: Kick).
    *   **CG (Channel Groupage) :** Vert. Reçoit plusieurs CI.
    *   **CM (Channel Master) :** Rouge. Sortie finale.
*   **Capacité :**
    *   Desktop/Tablette : 8 CI + 2 CG + 1 CM.
    *   Mobile : 6 CI + 2 CG + 1 CM.
*   **Routage (Interface) :**
    *   Sélecteur intelligent (Dropdown filtré) sur chaque tranche.
    *   **Si CI :** Choix parmi [Liste des CG] + [Master].
    *   **Si CG :** Choix unique [Master] (pour éviter les boucles de feedback).
    *   **Défaut :** CI1-4 assignés au Master.

#### 5.4.1.bis Flux Audio : JuicyBox (Drum Machine)
**Configuration par défaut (MVP) :**
La JuicyBox est initialisée avec 4 pistes essentielles pour garantir un groove basique immédiat :
1.  **Kick (Grosse Caisse)** : Le coeur du rythme.
2.  **Snare (Caisse Claire)** : L'accent rythmique.
3.  **ClosedHat (Charley Fermé)** : La dynamique rapide.
4.  **OpenHat (Charley Ouvert)** : Le groove et la respiration (remplace le Clap générique).

**Logique de Signal :**
Pour chaque ligne (Piste) de la Boîte à Rythme, le chemin du signal suit cette logique stricte :
1.  **StepCell On/Off** (Gate)
2.  **Fill / Probabilité** (Gatekeeper : si échoue, stop)
3.  **Volume StepCell** (Velocity : module le gain du sample)
4.  **Sampler** (Lecture du fichier audio)
5.  **Volume Ligne** (Gain individuel)
6.  **Bypass Ligne** (Mute individuel)
7.  **Volume Global JuicyBox** (VCA Group : affecte toutes les lignes)
8.  **Bypass Global JuicyBox** (Mute Group)
9.  **Sortie vers Channel Individuel** (Routage Mixer spécifié par ligne)


#### 5.4.2 Chaîne de Traitement (Signal Flow)
1.  **Entrée** (Source)
2.  **Effets** (Insert) : Delay, Disto, Reverb (Futur: EQ, Compresseur).
3.  **Volume** (Fader).
4.  **Sortie** (Vers CG ou CM).
*   *Note : Le Master (CM) possède un Compresseur de base en fin de chaîne.*
*   *Note technique : Utilisation du "Gain Ramping" (micro-fade out/in de 10ms) pour supprimer tout clic audio lors du changement de routage.*

#### 5.4.3 Interface Mixer
*   **Tranche de Console (Strip) :** Nom, Source, Vu-mètre, Fader Volume, Bypass Effets, Sélecteur Sortie, Solo/Mute.
*   **Sélection :** Cliquer sur une tranche affiche ses effets dans la Modale Droite.
*   **Modale Droite (Effets) :** Liste des effets du canal actif sous forme de cartes avec paramètres et bypass individuel.
*   *Responsive Mobile :* Stratégie à affiner lors du développement (Modales plein écran ou "Drawers" glissants) pour gérer la complexité des réglages d'effets.

### 5.5 Gestion des Effets (Tone.js)
Sélection d'effets essentiels pour le MVP, chaînables sur les pistes du Mixer.

#### 5.5.1 Reverb (Tone.Reverb)
Simule l'espace acoustique.
*   **Decay (1s - 10s) :** Durée de la réverbération.
*   **Pre-Delay (0ms - 100ms) :** Temps avant le début de l'effet.
*   **Mix (Dry/Wet) :** Dosage de l'effet.

#### 5.5.2 Delay (Tone.FeedbackDelay)
Crée des échos répétés.
*   **Time (Note/Ms) :** Temps entre les répétitions (Synchro BPM possible).
*   **Feedback (0% - 90%) :** Nombre de répétitions (Réinjection).
*   **Mix (Dry/Wet) :** Dosage de l'effet.

#### 5.5.3 Distortion (Tone.Distortion)
Ajoute du grain et de la saturation.
*   **Distortion (0 - 1) :** Intensité de la saturation.
*   **Oversample :** Qualité du traitement (fixe en interne).
*   **Mix (Dry/Wet) :** Dosage de l'effet.

#### 5.5.4 Chorus (Tone.Chorus)
Épaissit le son en le dupliquant et le désaccordant légèrement.
*   **Frequency :** Vitesse de l'oscillation.
*   **Depth :** Profondeur de l'effet.
*   **Mix (Dry/Wet) :** Dosage de l'effet.

#### 5.5.5 Filter (Tone.Filter)
Sculpte les fréquences (Égalisation simple).
*   **Type :** LowPass (Coupe-Haut), HighPass (Coupe-Bas), BandPass.
*   **Frequency :** Fréquence de coupure (Cutoff).
*   **Q (Resonance) :** Accentuation à la fréquence de coupure.

#### 5.5.6 Equalizer (5-Band)
Sculpture précise du timbre via 5 bandes fréquentielles fixes (Style Pédale d'effet).
*   **Low (Bass) :** < 250Hz.
*   **Low-Mid :** ~500Hz.
*   **Mid :** ~1000Hz.
*   **High-Mid :** ~3000Hz.
*   **High (Treble) :** > 5000Hz.
*   *UI : 5 Potentiomètres (Knobs) alignés horizontalement.*

## 6. Administration
*   Interface distincte pour l'administrateur.
*   Gestion des utilisateurs.
*   Statistiques (Utilisation, Stockage).

## 7. Contraintes Techniques & Sécurité
### 7.1 Sécurité
*   **Authentification :** JWT (JSON Web Token) avec expiration courte + Refresh Token (HttpOnly cookie) pour sécuriser les sessions.
*   **Protection API :**
    *   **Rate Limiting :** Limitation du nombre de requêtes (surtout pour l'IA et le Login) pour éviter les abus.
    *   **CORS :** Configuration stricte pour n'autoriser que le domaine du frontend.
*   **Validation :** Double validation des données (Zod côté Front, Symfony Validator côté Back) pour empêcher l'injection de données corrompues.

### 7.2 Performance & Cache
*   **Frontend (Assets) :** Utilisation du cache navigateur (Cache-Control) pour les fichiers statiques (JS, CSS, Images) via Vite.
*   **Backend (API) :** Cache HTTP pour les ressources peu changeantes (ex: liste des presets d'usine).
*   **Optimisation React :** Lazy Loading des composants lourds (ex: ne charger le module "Mixer" que s'il est ouvert).

### 7.3 Robustesse & Connexion
*   **Mode Hors-Ligne (Partiel) :**
    *   L'application doit continuer de fonctionner (son, édition) même si la connexion internet coupe.
    *   **Sauvegarde Locale :** En cas d'erreur réseau lors de la sauvegarde, stocker le projet dans le `localStorage` ou `IndexedDB` et proposer de réessayer quand la connexion revient.

## 8. Qualité & Tests
### 8.1 Stratégie de Test
*   **Tests Unitaires (Backend) :** Vérification de la logique métier (ex: calcul des droits, validation des données) isolée de la base de données.
*   **Tests Unitaires/Composants (Frontend) :** Vérification du rendu des composants React (ex: un bouton cliqué appelle bien la fonction attendue) et de la logique pure (ex: conversion BPM -> ms).
*   **Tests End-to-End (E2E) :** Simulation d'un parcours utilisateur complet (ex: Login -> Créer Projet -> Ajouter Note -> Sauvegarder) pour garantir que tout fonctionne ensemble.

### 8.2 Traçabilité (Reporting)
*   Génération de rapports HTML après chaque exécution de tests (Coverage Report) pour voir quel pourcentage du code est testé.
*   Génération de rapports HTML après chaque exécution de tests (Coverage Report) pour voir quel pourcentage du code est testé.
*   Intégration possible dans une CI (GitHub Actions) pour empêcher le déploiement si les tests échouent.

## 9. Éthique & Légal
*   **Minimisation des Données :** Collecte stricte du nécessaire (Email, Pseudo, Hash Password). Pas de tracking publicitaire, pas de revente de données.
*   **Transparence :**
    *   Page "CGU & Confidentialité" accessible depuis le menu "Aide & Documentation".
    *   Case à cocher "Consentement" obligatoire lors de l'inscription.
*   **Droit à l'oubli :** Bouton "Supprimer mon compte" dans le profil qui efface toutes les données (y compris les projets) de la base.

## 10. Accessibilité (A11y)
Pour garantir une expérience inclusive (au-delà du simple clavier) :
*   **Sémantique & ARIA :** Tous les composants interactifs (Potards, Pads) doivent avoir des labels explicites pour les lecteurs d'écran (ex: `aria-label="Volume Piste 1"`, `aria-valuenow="75"`).
*   **Navigation Clavier Complète :**
    *   Pas de "piège au clavier" (Keyboard Trap).
    *   Focus visible (outline) sur tous les éléments actifs.
*   **Visuel :**
    *   **Contraste :** Respect des ratios WCAG AA pour les textes et icônes.
    *   **Mouvement :** Respect de la préférence système `prefers-reduced-motion` (désactiver les animations superflues).



