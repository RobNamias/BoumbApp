# Campagne de Test : Implémentation BDD (MVP)

**Objectif** : Valider la structure et les contraintes des entités Doctrine via une approche TDD.

## 1. Tests Unitaires (Entités)

Ces tests vérifient la logique interne des classes (Getters/Setters) et les contraintes de validation (Asserts).

| ID | Composant | Cas de Test | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **User-01** | `User` | Instanciation et Defaults | L'objet est créé, `roles` contient `['ROLE_USER']`. | ✅ OK |
| **User-02** | `User` | Setters/Getters Simples | `email`, `username` stockent bien les valeurs. | ✅ OK |
| **User-03** | `User` | Validation Email Invalide | L'assert `Email` lève une violation. | ✅ OK |
| **User-04** | `User` | Validation Champs Vides | L'assert `NotBlank` lève une violation sur email/password/username. | ✅ OK |
| **Project-01** | `Project` | Instanciation et Defaults | `is_public` est `false` par défaut. | ✅ OK |
| **Project-02** | `Project` | Relation Owner | Le projet est bien lié à un `User`. | ✅ OK |
| **ProjectVersion-01** | `ProjectVersion` | Instanciation | `version_number` et `data` sont initialisés correctement. | ✅ OK |
| **ProjectVersion-02** | `ProjectVersion` | Relation Project | La version est liée à un `Project`. | ✅ OK |
| **Sample-01** | `Sample` | Instanciation | `name`, `filePath`, `category` sont initialisés. | ✅ OK |
| **Sample-02** | `Sample` | Owner Optionnel | Le sample peut ne pas avoir d'owner (Sample Usine). | ✅ OK |
| **SynthPreset-01** | `SynthPreset` | Instanciation | `name`, `synthType`, `parameters` sont initialisés. | ✅ OK |
| **SynthPreset-02** | `SynthPreset` | Owner Optionnel | Le preset peut ne pas avoir d'owner (Preset Usine). | ✅ OK |

## 2. Tests d'Intégration (Repository/DB)

Ces tests vérifient l'interaction avec la base de données réelle (ou de test).

| ID | Composant | Cas de Test | Résultat Attendu | Statut |
| :--- | :--- | :--- | :--- | :--- |
| **DB-01** | `Global` | Persistance | Un cycle complet (Save User -> Create Project -> Save) fonctionne en base réelle. | 🔴 TODO |
| **DB-02** | `Fixtures` | Loading | La commande `doctrine:fixtures:load` peuple la base avec les données MVP. | ✅ OK |
