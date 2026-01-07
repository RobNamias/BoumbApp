# Méthodologie & Outils

Ce document définit les standards de travail pour le binôme **Humain / IA**.

## 1. Philosophie Générale
*   **Qualité avant Vitesse** : On préfère un code testé et documenté à une feature vite expédiée.
*   **Atomicité** : Une tâche = Un commit (ou presque). On ne mélange pas Refacto et Feature.
*   **Documentation Vivante** : La documentation n'est pas une archive, c'est un outil de travail mis à jour en continu (`/withdoc`).

## 2. Workflows Standardisés

### A. Le Cycle TDD (`/tdd`)
Pour chaque nouvelle fonctionnalité Backend (et Frontend complexe) :
1.  **RED** : Écrire le Test qui échoue (prouve le besoin).
2.  **GREEN** : Écrire le code minimal pour faire passer le test.
3.  **REFACTOR** : Nettoyer sans casser.

### B. Création de Composant (`/newcomponent`)
Pour chaque composant React :
1.  Créer le dossier (`MyComponent/`).
2.  Créer `MyComponent.tsx` (Logique + Vue).
3.  Créer `MyComponent.css` (Styles isolés).
4.  (Optionnel) Créer `MyComponent.test.tsx`.

### C. Documentation Continue (`/withdoc`)
À chaque étape impactante :
1.  Analyser l'existant.
2.  Mettre à jour les fichiers de doc concernés.
3.  Vérifier les index.

---

## 3. Workflow de Développement Assisté par IA (`/ia_dev`)

Ce workflow optimise l'usage de l'Agent IA (Antigravity) pour le code.

### Phase 1 : Cadrage (Prompt)
Le Dev fournit :
*   Le contexte (Fichier existant, Spec).
*   L'objectif précis (Input -> Output).
*   La contrainte (ex: "Utilise tel hook").

### Phase 2 : Génération (Agent)
L'IA procède en 3 temps :
1.  **Plan** : Propose une approche (si complexe).
2.  **Test (Si TDD)** : Génère le squelette de test.
3.  **Implémentation** : Génère le code.

### Phase 3 : Validation (Boucle)
*   **Review** : Le Dev lit le code (pas de copier-coller aveugle !).
*   **Feedback** : Si erreur, fournir le message d'erreur précis à l'IA.
*   **Validation** : Validation explicite une fois que les tests passent.

> **Règle d'Or** : L'IA ne devine pas, elle exécute ce qui est spécifié. Si la spec est floue, le code sera buggé.
