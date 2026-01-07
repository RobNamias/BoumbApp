# Plan Détaillé 17 : Code Quality & Sanity Check

**Statut** : 🟢 En Cours
**Date** : 27/12/2025
**Réf.** : `docs/02_plan_maitre.md`

## 1. Vision & Objectifs
Assainir la base de code après le développement rapide du MVP ("Move Fast and Break Things"). L'objectif est de réduire la dette technique avant d'entamer les chantiers complexes (Persistance Backend).

## 2. Périmètre d'Audit

### 2.1 Static Analysis (ESLint)
*   **Objectif** : Zéro erreurs rouges, warnings réduits au minimum.
*   **Cibles** :
    *   Variables inutilisées (`no-unused-vars`).
    *   Imports manquants ou circulaires.
    *   Règles React Hooks (`exhaustive-deps`).

### 2.2 Type Safety (TypeScript)
*   **Objectif** : Compiler sans erreur (`tsc -b`).
*   **Cibles** :
    *   Suppression des `any` implicites ou explicites non justifiés.
    *   Typage strict des Props et du Store.
    *   Cohérence des Interfaces Audio/Store.

### 2.3 Cleanup
*   **Nettoyage** :
    *   Code commenté inutile (Old legacies).
    *   `console.log` de debug oubliés.
    *   Fichiers morts (Components orphelins).

## 3. Stratégie d'Exécution
1.  **Mesure** : Lancer `npm run lint` et `npm run build` pour lister les problèmes.
2.  **Fix Automatique** : Appliquer les correctifs triviaux.
3.  **Refactoring** : Traiter les erreurs de typage complexes.
4.  **Validation** : Le build doit passer vert.
