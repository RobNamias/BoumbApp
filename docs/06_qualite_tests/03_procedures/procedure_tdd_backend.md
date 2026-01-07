# Procédure : Développement Piloté par les Tests (TDD) Backend

Ce document décrit le workflow standard pour développer les entités et services Backend avec Symfony.

## 1. Cycle TDD (Red - Green - Refactor)

### Étape 1 : RED (Le Test qui échoue)
1.  **Créer le fichier de test** dans `app/tests/Unit/Entity/` (ex: `MyEntityTest.php`).
2.  **Définir le comportement attendu** :
    *   Instanciation.
    *   Validation (contraintes).
    *   Logique métier.
3.  **Lancer le test** :
    ```bash
    docker compose exec boumbapp_backend bin/phpunit tests/Unit/Entity/MyEntityTest.php
    ```
4.  **Vérifier l'échec** : Le test DOIT échouer (Classe inexistante ou assertion fausse).

### Étape 2 : GREEN (Le Code minimal)
1.  **Créer/Modifier la classe** dans `app/src/Entity/`.
2.  **Implémenter le strict nécessaire** pour faire passer le test.
3.  **Relancer le test** : Il doit passer (vert).

### Étape 3 : REFACTOR (Nettoyage)
1.  **Améliorer le code** (Typage, Nommage, Extraction de méthodes).
2.  **Vérifier la non-régression** : Les tests doivent toujours passer.

## 2. Commandes Utiles

| Action | Commande (depuis la racine projet) |
| :--- | :--- |
| **Lancer tous les tests** | `docker compose exec boumbapp_backend bin/phpunit` |
| **Lancer un fichier spécifique** | `docker compose exec boumbapp_backend bin/phpunit tests/Chemin/Vers/FichierTest.php` |
| **Vider le cache (si erreur bizarre)** | `npm run cc` (ou `docker compose exec boumbapp_backend bin/console c:c`) |

## 3. Bonnes Pratiques
*   **Unit Tests (`tests/Unit`)** : Rapides, isolés, pas de base de données. Utilisez `TestCase` standard ou `Validation::createValidatorBuilder()` pour tester les contraintes.
*   **Kernel Tests (`tests/Integration`)** : Plus lents, chargent le Framework. Utilisez `KernelTestCase` si besoin d'accéder aux services réels.
*   **Nommage** : `TestNomClasse.php` -> `testNomMethode()`.
