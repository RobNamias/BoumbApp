# Inventaire des Tests Backend (Symfony)

Ce document référence l'ensemble des tests automatisés du Backend.
Il doit être mis à jour à chaque création de fichier de test `*Test.php`.

## 1. Tests Unitaires (`tests/Unit/`)

Vérification de la logique métier isolée (Entités, Services sans dépendances).

| Namespace | Classe Testée | Fichier de Test | Couverture |
| :--- | :--- | :--- | :--- |
| `App\Entity` | `User` | `tests/Unit/Entity/UserTest.php` | Instanciation, Validation (Email, NotBlank), Rôles par défaut. |
| `App\Entity` | `Project` | `tests/Unit/Entity/ProjectTest.php` | Instanciation, Relation Owner, Public par défaut. |
| `App\Entity` | `ProjectVersion` | `tests/Unit/Entity/ProjectVersionTest.php` | Structure JSON, Relation Project. |
| `App\Entity` | `Sample` | `tests/Unit/Entity/SampleTest.php` | Création, Owner optionnel (Usine). |
| `App\Entity` | `SynthPreset` | `tests/Unit/Entity/SynthPresetTest.php` | Création, Paramètres JSON. |

## 2. Tests d'Intégration (`tests/Integration/`)

Vérification des interactions avec le Framework et la BDD (Kernel, Doctrine).

| Domaine | Composant | Fichier de Test | Scénarios |
| :--- | :--- | :--- | :--- |
| **DataFixtures** | `AppFixtures` | `tests/Integration/DataFixtures/AppFixturesTest.php` | Chargement des données MVP (Users, Samples, Project Demo). |
| **Security** | `Authenticator` | `tests/Integration/Security/AuthTest.php` | Login Success (JWT), Login Failure (401). |

## 3. Tests Fonctionnels / E2E (`tests/Functional/`)

Vérification des parcours utilisateurs complets (API Platform).

| Domaine | Composant | Fichier de Test | Scénarios |
| :--- | :--- | :--- | :--- |
| **API** | `Catalog` | `tests/Functional/Api/CatalogTest.php` | GET `/api/samples` (Collection), GET `/api/synth_presets` (Collection) avec JWT. |
| **API** | `Project` | `tests/Functional/Api/ProjectTest.php` | CRUD sécurisé (filtre owner), Création auto-owner. |
