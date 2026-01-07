# Modèle de Données (MVP)

Ce document recense les entités nécessaires pour le MVP de **Boumb'App**.
L'objectif est de définir une structure robuste mais minimale, prête à évoluer.

## 1. Gestion des Utilisateurs (Access & Identity)

### User (Utilisateur)
Table : `app_user` (Préfixe `app_` pour éviter conflit avec le mot réservé SQL `user` sur Postgres).

| Attribut | Type SQL | Requis | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | Oui | Identifiant unique (Auto-incrémenté pour MVP). |
| `email` | VARCHAR(180) | Oui | Email de connexion. Doit être **UNIQUE**. |
| `password` | VARCHAR(255) | Oui | Mot de passe haché (Algorithme recommandé : Argon2id). |
| `username` | VARCHAR(50) | Oui | Nom d'affichage / Pseudo. Doit être **UNIQUE**. |
| `roles` | JSON | Oui | Tableau des rôles Symfony. Ex: `["ROLE_USER"]` ou `["ROLE_ADMIN"]`. |
| `preferences` | JSONB | Non | Paramètres utilisateur. <br>Clés standards : <br>- `theme` : "dark" / "light" ... <br>- `locale` : "fr" / "en" (pour l'i18n). |

| `created_at` | DATETIME | Oui | Date d'inscription (Immutable). |
| `updated_at` | DATETIME | Non | Date de dernière modification du profil. |

*Note : Pour le MVP, pas d'avatar uploadé (on peut utiliser Gravatar ou un placeholder).*

## 2. Gestion des Projets (Workspaces)

### Project (Projet)
Table : `app_project`
Conteneur principal des méta-données.

| Attribut | Type SQL | Requis | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | Oui | Identifiant unique du projet. |
| `name` | VARCHAR(100) | Oui | Nom du projet. |
| `owner_id` | INTEGER | Oui | Clé étrangère vers `app_user`. |
| `is_public` | BOOLEAN | Oui | Visibilité (Privé par défaut). |
| `created_at` | DATETIME | Oui | Date de création. |
| `updated_at` | DATETIME | Non | Date de dernière mise à jour. |

### ProjectVersion (Sauvegarde)
Table : `app_project_version`
Stocke l'état réel du DAW à un instant T. Permet l'historique et le rollback.

| Attribut | Type SQL | Requis | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | Oui | Identifiant unique de la version. |
| `project_id` | INTEGER | Oui | Clé étrangère vers `app_project`. |
| `version_number` | INTEGER | Oui | Numéro incrémental (v1, v2...). |
| `data` | JSONB | Oui | **Le cœur du DAW.** Structure : `{ drumPatterns, melodicPatterns, timeline, mixer }`. |
| `created_at` | DATETIME | Oui | Date de la sauvegarde. |

## 3. Bibliothèque Sonore (Resources & Assets)

### Sample (Échantillon Audio)
Table : `app_sample`
Gère les fichiers audio (wav/ogg/mp3).

| Attribut | Type SQL | Requis | Description |
| :--- | :--- | :--- | :--- |
| `id` | INTEGER | Oui | Identifiant unique. |
| `name` | VARCHAR(100) | Oui | Nom du sample (ex: "Kick 808"). |
| `file_path` | VARCHAR(255) | Oui | Chemin relatif ou URL du fichier audio. |
| `category` | VARCHAR(50) | Oui | Type (Kick, Snare, Hat, Perc, FX, Loop...). |
| `owner_id` | UUID | Non | Propriétaire. **NULL = Sample d'usine (Global)**. |
| `duration` | FLOAT | Non | Durée en secondes (utile pour l'affichage). |
| `created_at` | DATETIME | Oui | Date d'ajout. |

### SynthPreset (Réglage Synthé)
Table : `app_synth_preset`
Sauvegarde des configurations de synthétiseurs.

| Attribut | Type SQL | Requis | Description |
| :--- | :--- | :--- | :--- |
| `id` | UUID | Oui | Identifiant unique. |
| `name` | VARCHAR(100) | Oui | Nom du preset. |
| `synth_type` | VARCHAR(50) | Oui | Type de synthé cible (ex: "FMSynth", "PolySynth"). |
| `parameters` | JSONB | Oui | Tous les réglages (ADSR, Oscillo, **Effets**...). |
| `owner_id` | UUID | Non | Propriétaire. **NULL = Preset d'usine**. |


