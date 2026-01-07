# Modèle de Données (Évolutions Futures)

Ce document recense les champs et entités à prévoir pour les versions ultérieures de **Boumb'App**.
Ces éléments ne doivent PAS être implémentés dans le MVP, mais la structure du MVP doit permettre leur ajout facile (ex: via `ALTER TABLE`).

## 1. Gestion des Utilisateurs (Access & Identity)

### User (Évolutions)
Ajouts prévus sur la table `app_user` :

| Attribut | Type SQL | Description |
| :--- | :--- | :--- |
| `bio` | TEXT | Courte biographie pour le profil public. |
| `avatar_path` | VARCHAR(255) | Chemin vers l'image uploadée (si hébergement local ou S3). |
| `social_links` | JSONB | Liste des réseaux sociaux. <br>Ex: `[{"network": "soundcloud", "url": "..."}]`. |
| `is_verified` | BOOLEAN | Confirmation de l'email (KYC léger). |
| `last_login` | DATETIME | Date de dernière connexion (Pour les statistiques d'activité). |
| `last_login` | DATETIME | Date de dernière connexion (Pour les statistiques d'activité). |
| `subscription_plan`| VARCHAR(20)| (Futur lointain) Type d'abonnement : `free`, `pro`, `supporter`. |

## 2. Gestion des Projets (Workspaces)

### Project (Évolutions)
Ajouts prévus sur la table `app_project` pour le social et la découverte :

| Attribut | Type SQL | Description |
| :--- | :--- | :--- |
| `cover_path` | VARCHAR(255) | Image de couverture du projet. |
| `tags` | JSONB | Liste de tags pour la recherche (ex: `["Techno", "128BPM"]`). |
| `fork_from_id` | UUID | (Nullable) ID du projet original si c'est un Remix. |
| `likes_count` | INTEGER | Compteur de favoris (Dénormalisé pour la perf). |
| `plays_count` | INTEGER | Compteur d'écoutes (si player public). |
| `description` | TEXT | Description longue pour la page publique du projet. |

### ProjectLike (Interaction)
Table : `app_project_like` (Nouvelle table de jointure)
| Attribut | Type SQL | Description |
| :--- | :--- | :--- |
| `user_id` | UUID | Qui a liké. |
| `project_id` | UUID | Quel projet. |
| `created_at` | DATETIME | Date du like. |

## 3. Bibliothèque Sonore (Resources & Assets)

### Sample & Preset (Évolutions)
Ajouts prévus sur `app_sample` et `app_synth_preset` pour le partage communautaire :

| Attribut | Type SQL | Description |
| :--- | :--- | :--- |
| `is_public` | BOOLEAN | Permet aux autres utilisateurs d'utiliser ce sample/preset. |
| `downloads_count` | INTEGER | Compteur d'utilisation par d'autres. |
| `tags` | JSONB | Tags pour la recherche (ex: "Vintage", "Hard"). |
| `license` | VARCHAR(50) | Type de licence (ex: "CC0", "Royalty Free"). |


