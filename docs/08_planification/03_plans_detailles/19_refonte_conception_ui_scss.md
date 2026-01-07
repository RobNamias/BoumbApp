# Phase 12 : Refonte Conception UI & Nettoyage SCSS

**Objectif** : Élever la qualité du code (Code Quality) et de l'interface (UI Polish) au niveau "Studio Professionnel". Suppression de la dette technique CSS (styles inline, fichiers *voyageurs*) et amélioration de l'accessibilité.

## 1. Analyse de l'Existant (État des lieux)

*   **Sidebar** : Utilise des styles inline "MVP". Un fichier `Sidebar.module.scss` existe (déplacé dans `styles/modules/`) mais est inutilisé.
*   **TopBar** : Composant massif (~400 lignes). Utilise énormément de styles inline pour le layout et les boutons. Difficile à maintenir.
*   **Linting/Accessibility** : Plusieurs warnings SonarQube sur des éléments interactifs (`div` cliquables sans support clavier).

## 2. Stratégie de Refactoring (Grand Nettoyage)

### A. Sidebar (Standardisation)
*   **Fichiers** : `Sidebar.tsx`, `styles/modules/Sidebar.module.scss`.
*   **Action** :
    1.  Vérifier/Adapter le SCSS existant pour correspondre au design inline actuel (ou mieux, l'améliorer).
    2.  Remplacer les styles inline (`style={{...}}`) par des classes CSS Modules (`className={styles.sidebar}`).

### B. TopBar (Extraction & Modularisation)
*   **Fichiers** : `TopBar.tsx`, création de `styles/modules/TopBar.module.scss`.
*   **Action** :
    1.  Créer `TopBar.module.scss`.
    2.  Déplacer les styles des conteneurs (Left/Center/Right sections) et des éléments boutons/badges.
    3.  Remplacer le JSX inline par du JSX propre.

### C. Qualité & Accessibilité (Professional Grade)
*   **Cibles** : Tous les composants interactifs (boutons custom, éléments de listes).
*   **Action** :
    1.  Remplacer `div onClick` par `button` (ou ajouter `role="button"` + `onKeyDown`).
    2.  Ajouter les `aria-label` et `title` manquants.
    3.  Traiter les warnings SonarQube restants.

## 3. Plan d'Exécution

| Étape | Description | Fichiers Impactés | Statut |
| :--- | :--- | :--- | :--- |
| **12.1** | **Refactor Sidebar** | `Sidebar.tsx`, `Sidebar.module.scss` | À faire |
| **12.2** | **Refactor TopBar** | `TopBar.tsx`, `TopBar.module.scss` (New) | À faire |
| **12.3** | **Accessibilité (Lint Fixes)** | `SynthLab.tsx`, `ChannelStrip.tsx`, etc. | À faire |
| **12.4** | **Documentation** | `ui_composants.md`, `ui_charte.md` | À faire |

## 4. Documentation Impactée (Checklist /withdoc)

*   [ ] `docs/02_conception/02_ui_charte.md` : Mettre à jour si les choix de couleurs/design changent.
*   [ ] `docs/02_conception/03_architecture_frontend.md` : Confirmer la structure `styles/modules/`.
