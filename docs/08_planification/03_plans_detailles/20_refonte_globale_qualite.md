# Phase 12 : Refonte Globale Qualité & Documentation ("Plan Béton")

**Philosophie** : Passage du "POC/MVP" au "Produit Studio". On ne tolère plus la dette technique.
**Workflow** : Application stricte du protocole `@/withdoc`.

## 1. Pilier 1 : Socle Documentaire (Audit & Mise à jour)
*Objectif : La documentation doit être la source de vérité absolue.*

*   **1.1. Réorganisation**
    *   Vérifier la structure de `docs/`.
    *   Archiver les plans obsolètes (déplacer dans `docs/_archive` si nécessaire).
*   **1.2. Verification de Contenu (Health Check)**
    *   [ ] `ui_composants.md` : Ajouter *Classic Modals* (ConfirmModal), *Menus* (Dropdown), *Drawers*.
    *   [ ] `architecture_frontend.md` : Mettre à jour l'arborescence (ex: `styles/modules/`).
    *   [ ] `api_endpoints_mvp.md` : Vérifier par rapport au code actuel (`projectService.ts`).
    *   [ ] `bdd_entites_mvp.md` : Vérifier les évolutions (ex: *Effects*, *Inserts*).

## 2. Pilier 2 : Standardisation UI & SCSS (La Forme)
*Objectif : Éliminer les styles inline et unifier le Design System.*

*   **2.1. Migration SCSS Modules**
    *   [x] **Sidebar** : Créer `Sidebar.module.scss` (finaliser l'intégration).
    *   [x] **TopBar** : Extraire les 400 lignes de styles inline vers `TopBar.module.scss`.
    *   [x] **Global** : Vérifier `index.css` vs `App.css`.
*   **2.2. Accessibilité & Linting**
    *   [x] Corriger les warnings SonarQube (interactive div -> button).
    *   [x] Standardiser les composants "Atomiques" (ex: s'assurer que tous les boutons utilisent `Button.tsx` ou des styles cohérents).

## 3. Pilier 3 : Rattrapage TDD (Le Fond)
*Objectif : Sécuriser les composants critiques qui ont échappé au TDD.*

**Composants Prioritaires (Non testés à ce jour) :**
1.  **TopBar** (Critique - État global, Navigation, Modales). [Done]
2.  **MixerBoard / ChannelStrip** (Complexe - Routing Audio). [Done]
3.  **Timeline** (Complexe - Grid, Zoom, Clips). [Done]
4.  **JuicyBox** (Logique Sequencer). [Done]
5.  **SynthLab** (Logique Synthé). [Done]

**Stratégie d'Implémentation :**
*   *Test First* (Rétroactif) : Écrire le test spec pour décrire le comportement attendu.
*   *Refactor* : Adapter le composant si nécessaire pour le rendre testable (injection de dépendances, extraction de logique).
*   *Verify* : S'assurer que ça passe au vert.

## 4. Pilier 4 : Grand Nettoyage (Le Polish)
*Objectif : Codebase saine et naviguable.*

*   [x] **Dead Code Elimination** : Supprimer les fichiers inutilisés (ex: composants `.bak`, vieux fichiers de test).
*   [x] **Consistance des Noms** : Vérifier la casse des fichiers et dossiers.
*   [x] **Imports** : Organiser les imports (absolus vs relatifs) si possible.

---

## Roadmap d'Exécution

| Phase | Tâche | Estimation |
| :--- | :--- | :--- |
| **12.1** | Refactor SCSS (Sidebar & TopBar) | [Done] |
| **12.2** | Rattrapage TDD : TopBar | [Done] |
| **12.3** | Rattrapage TDD : Mixer & ChannelStrip | [Done] |
| **12.4** | Rattrapage TDD : Timeline | [Done] |
| **12.5** | Final Lint & Clean | [Done] |
| **12.6** | Audit Documentaire & Mise à jour Index (Final) | [Done] 2026-01-03 |
