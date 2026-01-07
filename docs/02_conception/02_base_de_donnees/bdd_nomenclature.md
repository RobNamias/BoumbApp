# Nomenclature Base de Données

## Pourquoi une nomenclature ?
Une convention de nommage rigoureuse est essentielle pour garantir la **maintenabilité** et la **lisibilité** du code sur le long terme. Elle permet à n'importe quel développeur (ou à vous-même dans 6 mois) de comprendre instantanément la structure de la base sans deviner.

**Choix du Standard (Snake Case Pluriel) :**
Nous avons opté pour le standard PostgreSQL/Symfony (`users`, `projects`) plutôt que des noms préfixés (`bmb_users`).
*   **Simplicité :** Les requêtes SQL sont plus naturelles à écrire et à lire.
*   **Standardisation :** C'est la convention par défaut des frameworks modernes, facilitant l'intégration avec des outils tiers (ORM, linters).
*   **Isolation :** L'utilisation de Docker garantissant une base de données dédiée, les risques de conflits de noms (qui justifieraient des préfixes) sont inexistants.

## Conventions de Nommage

### Tables
*   **Format :** `snake_case`
*   **Pluriel :** Oui (ex: `users`, `project_versions`)
*   **Préfixe :** Aucun (Standard)

### Colonnes
*   **Format :** `snake_case`
*   **Clés primaires :** `id`
*   **Clés étrangères :** `nom_table_singulier_id` (ex: `owner_id`, `project_id`)
*   **Dates :** Suffixe `_at` (ex: `created_at`, `updated_at`)
*   **Booléens :** Préfixe `is_` ou `has_` (ex: `is_public`, `is_active`)

### Entités PHP (Symfony)
*   **Format :** `PascalCase`
*   **Singulier :** Oui (ex: `User`, `ProjectVersion`)
