# Intégration de l'Agent IA dans le Workflow

Ce document explique la méthodologie de travail adoptée pour ce projet, intégrant un assistant IA (Agent) au cœur du processus de développement.

## 1. Philosophie
L'objectif n'est pas de laisser l'IA coder seule, mais de l'utiliser comme un **binôme technique (Pair Programmer)** capable de :
*   Analyser rapidement l'existant.
*   Proposer des architectures robustes (MCD, Stack).
*   Générer le code "boilerplate" fastidieux.
*   Maintenir la documentation à jour en temps réel.

## 2. Workflows Automatisés
Nous avons mis en place des commandes spécifiques pour guider l'agent :

### `withdoc` (Mise à jour Documentaire)
*   **But :** Garantir une documentation à jour et normée à chaque changement.
*   **Règles Strictes :**
    1.  **Analyse** : Identification des impacts et lecture du contexte.
    2.  **Index Dossier** : Création obligatoire d'un `index.md` pour tout nouveau dossier principal.
    3.  **Index Local** : Mise à jour systématique de l'index du dossier parent.
    4.  **Finalisation** : Mise à jour obligatoire de `docs/00_index_general.md` en fin de tâche.

### `tdd` (Test Driven Development)
*   **But :** Guider le développement par les tests (Red-Green-Refactor).
*   **Usage :** Pour toute nouvelle logique métier ou algorithme complexe.

### `newcomponent` (Frontend)
*   **But :** Standardiser la création de composants React.
*   **Contenu :** Crée le dossier, le fichier `.tsx`, le module CSS `.module.scss`, et le test `.test.tsx`.

### `debug` (Résolution de Bugs)
*   **But :** Méthode rigoureuse d'investigation.
*   **Étapes :** Reproduire -> Analyser -> Corriger -> Vérifier.

### `testworkflow` (Méta-Test)
*   **But :** Vérifier que les workflows eux-mêmes fonctionnent (Dry Run).

> **Voir l'index complet des workflows :** [.agent/workflows/index.md](cci:7://file:///d:/Dev/Perso/Web/BOUMBAPP/Application/Symfony/.agent/workflows/index.md:0:0-0:0)

## 3. Structure du Projet IA
L'agent maintient sa propre "mémoire" dans le dossier `.gemini/antigravity/brain/` :
*   `task.md` : Liste des tâches en cours et à venir.
*   `implementation_plan.md` : Plan technique détaillé avant exécution.
