# Stratégie Globale de Tests

## 1. Objectifs
Assurer la stabilité et la non-régression de l'application **Boumb'App** tout au long du développement.

## 2. Stack de Test

| Niveau | Outil | Cible |
| :--- | :--- | :--- |
| **Analyse Statique** | **SonarLint** | Qualité du code, Sécurité, Code Smells (Temps réel). |
| **Unitaire (Backend)** | PHPUnit | Services, Entités, Logique métier. |
| **Intégration (API)** | PHPUnit / Foundry | Endpoints API, Sécurité, BDD. |
| **Unitaire (Frontend)** | Vitest | Composants React, Hooks, Utilitaires. |
| **End-to-End (E2E)** | Cypress (à venir) | Parcours utilisateurs critiques. |

## 3. Processus de Validation
Chaque fonctionnalité doit passer par les étapes suivantes :
1.  **Analyse Statique** : Correction des alertes SonarLint dans l'IDE.
2.  **Dev Test** : Le développeur valide son code localement (`npm run test`).
3.  **Smoke Test** : Vérification rapide après déploiement/merge.
4.  **Recette** : Validation fonctionnelle complète (voir Procédures).
