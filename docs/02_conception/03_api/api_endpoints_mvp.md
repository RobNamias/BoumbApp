# Endpoints API (MVP)

Ce document liste l'ensemble des routes API disponibles pour la version 1 (MVP).

## 1. Authentification (Auth)
Routes gérées par le bundle de sécurité (LexikJWT).

| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/login` | Connexion (Renvoie le Cookie JWT). | Public |
| `POST` | `/api/logout` | Déconnexion (Supprime le Cookie). | Public |
| `GET` | `/api/me` | Récupère l'utilisateur courant (via Cookie). | Connecté |

## 2. Utilisateurs (Users)
Gestion du compte utilisateur.

| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/users` | Inscription (Création de compte). | Public |
| `GET` | `/api/users/{id}` | Voir un profil (Limité au sien en MVP). | Owner |
| `PUT` | `/api/users/{id}` | Modifier son profil (Email, Password). | Owner |
| `DELETE` | `/api/users/{id}` | Supprimer son compte (RGPD). | Owner |

## 3. Projets (Projects)
Le cœur de l'application.

| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Liste de mes projets (Pagination). | Connecté |
| `POST` | `/api/projects` | Créer un nouveau projet vide. | Connecté |
| `GET` | `/api/projects/{id}` | Charger un projet complet. | Owner |
| `PUT` | `/api/projects/{id}` | Modifier les métadonnées (Nom, Public). | Owner |
| `DELETE` | `/api/projects/{id}` | Supprimer un projet. | Owner |

### Versions de Projet (Sauvegardes)
| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/project_versions` | Liste de versions (Filtre `?project={id}`). | Owner |
| `POST` | `/api/project_versions` | Sauvegarder l'état actuel (JSON Data). | Owner |
| `GET` | `/api/project_versions/{id}` | Charger une version spécifique. | Owner |

## 4. Bibliothèque Sonore (Library)
Ressources audio et presets.

| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/samples` | Lister les samples (Global + Perso). | Connecté |
| `POST` | `/api/samples` | Upload un nouveau sample. | Connecté |
| `GET` | `/api/synth_presets` | Lister les presets de synthé. | Connecté |
| `POST` | `/api/synth_presets` | Sauvegarder un preset. | Connecté |

## 5. Intelligence Artificielle (AI)
Fonctionnalités génératives.

| Méthode | Route | Description | Accès |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/ai/generate` | Générer une mélodie (Prompt -> JSON). | Connecté |
