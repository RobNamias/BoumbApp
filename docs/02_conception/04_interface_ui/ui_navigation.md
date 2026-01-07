# Navigation & UX Roadmap

Ce document définit l'arborescence de l'application (Sitemap) et les flux de navigation principaux pour guider le design UI.

## 1. Arborescence (Sitemap)

L'application adopte une philosophie "Direct-to-Creation" (type Fruity Loops). Pas de dashboard intermédiaire, on arrive directement dans le son.

```mermaid
graph TD
    %% Entrée
    Root[Landing URL] -->|Chargement| Overlay[Overlay "Splash Screen"]
    Overlay -->|Click / interaction| Studio[Studio (Vue Sequencer)]
    
    %% Studio & Modales
    Studio -->|Navbar > Projet| ProjectModal[Modale Gestion Projets]
    Studio -->|Navbar > User| UserModal[Modale Profil / Auth]
    Studio -->|Navbar > Aide| HelpModal[Modale Aide]

    %% Interactions Modales
    ProjectModal -->|Load| Studio
    UserModal -->|Login / Register| Studio
```

## 2. Parcours Utilisateur (User Flows)

### A. Le "Musicien Connecté" (Standard)
1.  **Arrivée** : Overlay (Logo + Nom).
2.  **Action** : Clique n'importe où. L'overlay disparait (Transition CSS).
3.  **Studio** : Arrive directement sur le dernier projet ouvert (ou un "New Project" par défaut).
4.  **Gestion** : Clique sur "Projet" > "Ouvrir" pour changer de session via une **Modale**.

### B. Le "Curieux" (Guest)
1.  **Arrivée** : Overlay.
2.  **Action** : Clique.
3.  **Studio** : Accès immédiat en mode "New Project".
4.  **Limitation** : S'il tente de sauvegarder, la **Modale Auth** (Login/Register) apparait par-dessus le studio.

## 3. Barre de Navigation (Navbar)

La Navbar est fixe et unifiée. Elle sert à tout piloter depuis le Studio.

### 3.1 Structure
*   **Gauche (Projet)** :
    *   [Logo] (Retour Overlay/Reset ?).
    *   [Menu Projet] (Dropdown) : Nouveau, Ouvrir (Modale), Sauvegarder, Exporter.
*   **Centre (Transport & Infos)** :
    *   [Play] / [Stop] / [Pause].
    *   [BPM] (Input).
    *   [BPM] (Input).
    *   [Switch Page] (Pattern entier vs Page courante).
    *   **[Mini-Scope]** (Visualiseur).
*   **Droite (Système)** :
    *   [Menu Aide] (Dropdown) : Docs, About.
    *   [User] (Dropdown/Modale) : Connexion ou Profil.
