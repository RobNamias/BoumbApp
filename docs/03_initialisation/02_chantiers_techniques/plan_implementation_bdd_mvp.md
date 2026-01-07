# Plan d'Implémentation : Base de Données (MVP)

Ce document détaille les étapes techniques pour mettre en place la couche de données de Boumb'App via l'approche "Code First" de Symfony (Doctrine).

## 1. Stratégie de Test (TDD & Validation)

Avant d'implémenter, nous définissons les critères de succès.

### 1.1 Tests Automatisés (`phpunit`)
Nous créerons des tests d'intégration pour vérifier le bon mapping des entités.

*   **`UserTest.php`** :
    *   Créer un User valide -> Doit réussir.
    *   Créer un User avec email manquant -> Doit échouer (ConstraintViolation).
    *   Créer un User avec email dupliqué -> Doit échouer (UniqueEntity).
*   **`ProjectTest.php`** :
    *   Créer un Projet et lui associer un User (Owner) -> Doit réussir.
    *   Vérifier que le champ `is_public` est `false` par défaut.

### 1.2 Validation Manuelle (Fixtures)
Nous utiliserons les **Fixtures** pour peupler la base et vérifier visuellement via **Adminer**.

*   **Jeu de Données Attendu :**
    *   1 Admin (`admin@boumbapp.fr` / `admin`).
    *   1 User Standard (`bob@mail.com` / `password`).
    *   1 Projet d'exemple ("Demo Song") appartenant à Bob.
    *   1 Sample Global ("Kick 808").
    *   1 Preset Global ("Bass Pluck").

---

## 2. Étapes d'Implémentation

### 2.1 Backend (Symfony)

#### A. Création des Entités (`src/Entity`)
Génération des classes PHP via `php bin/console make:entity`.

1.  **`User`** :
    *   `email` (string, 180, unique)
    *   `roles` (json)
    *   `password` (string)
    *   `username` (string, 50, unique)
    *   `preferences` (json, nullable)
2.  **`Project`** :
    *   `name` (string, 100)
    *   `is_public` (boolean)
    *   `owner` (Relation: ManyToOne avec User)
3.  **`ProjectVersion`** :
    *   `version_number` (integer)
    *   `data` (json, "Full DAW State")
    *   `project` (Relation: ManyToOne avec Project)
4.  **`Sample`** :
    *   `name` (string, 100)
    *   `file_path` (string)
    *   `category` (string, 50)
    *   `duration` (float, nullable)
    *   `owner` (Relation: ManyToOne avec User, Nullable)
5.  **`SynthPreset`** :
    *   `name` (string, 100)
    *   `synth_type` (string, 50)
    *   `parameters` (json)
    *   `owner` (Relation: ManyToOne avec User, Nullable)

#### B. Migrations (`migrations/`)
1.  Générer le fichier SQL de différence : `php bin/console make:migration`.
2.  Vérifier le SQL généré.
3.  Appliquer la migration : `php bin/console doctrine:migrations:migrate`.

#### C. Fixtures & Fake Data (`src/DataFixtures`)
1.  Mise à jour de `AppFixtures.php`.
2.  Utilisation de `UserPasswordHasherInterface` pour hasher les mots de passe.
3.  Création des objets et `persist()` / `flush()`.

## 3. Commandes de Lancement

Pour tout réinitialiser (BDD vide -> BDD prête) :

```bash
npm run db:reset
# (Ou manuellement : drop force, create, migrate, fixtures:load)
```
