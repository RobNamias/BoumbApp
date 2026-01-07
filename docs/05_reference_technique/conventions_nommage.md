# Conventions de Nommage (Nomenclature)

Ce document centralise toutes les règles de nommage du projet pour garantir une uniformité parfaite.

## 1. Frontend (React / Vite)

| Élément | Convention | Exemple |
| :--- | :--- | :--- |
| **Dossiers** | `kebab-case` | `client/src/components` |
| **Composants** | `PascalCase` | `StepCell.tsx` |
| **Hooks** | `camelCase` (prefix `use`) | `useAppStore.ts` |
| **Utilitaires** | `camelCase` | `audioHelpers.ts` |
| **Tests** | `[NomFichier].test.tsx` | `StepCell.test.tsx` |
| **Interfaces** | `PascalCase` (Suffix `Props` for props) | `StepCellProps` |
| **Styles Partiels** | `_kebab-case.scss` | `_step-cell.scss` |
| **Variables SCSS** | `--kebab-case` | `--primary-color` |
| **Props** | `camelCase` | `isActive`, `onClick` |
| **Events Props** | `on[Action]` | `onStepChange` |

## 2. Backend (Symfony / PHP)

| Élément | Convention | Exemple |
| :--- | :--- | :--- |
| **Classes PHP** | `PascalCase` | `ProjectController` |
| **Méthodes** | `camelCase` | `getProjects()` |
| **Variables / Propriétés** | `camelCase` | `$projectId` |
| **Constantes** | `SCREAMING_SNAKE_CASE` | `DEFAULT_PAGINATION` |
| **Tables SQL** | `snake_case` (pluriel ?) | `projects`, `users` |
| **Colonnes SQL** | `snake_case` | `created_at` |

## 3. Assets & Fichiers Publics

> **Règle d'Or** : Pas d'espaces, pas d'accents, tout en minuscules pour les dossiers data.

| Élément | Convention | Exemple |
| :--- | :--- | :--- |
| **Images UI** | `snake_case` | `logo_white.png` |
| **Kits Samples** | `minuscules/minuscules_[Element]` | `kits/tr808/tr808_kick.ogg` |

## 4. Git & Commits

*   **Branches** : `type/description-kebab-case` (ex: `feat/sequencer-ui`, `fix/login-bug`).
*   **Commits** : Conventionnel (optionnel mais recommandé).
    *   `feat: add sequencer`
    *   `fix: resolve overflow issue`
    *   `docs: update naming conventions`
