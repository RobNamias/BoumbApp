# Phase 8 : Persistance & Authentification Backend

## 1. Objectifs
Connecter le Client React au Backend Symfony existant pour permettre :
1.  **L'Authentification** : Inscription, Connexion (JWT), Gestion de session.
2.  **La Persistance** : Sauvegarde et Chargement des projets (`User` -> `Projects` -> `Versions`).
3.  **L'Expérience Studio** : Dashboard utilisateur avec liste des projets.

## 2. Architecture Technique

### 2.1 Backend (Existant Audité)
*   **Stack** : Symfony 7.3 + API Platform + LexikJWT.
*   **Entités** :
    *   `User` (email, password, roles).
    *   `Project` (name, isPublic, owner).
    *   `ProjectVersion` (data: JSON, versionNumber).
*   **Sécurité** :
    *   `login_check` -> Retourne JWT.
    *   Endpoints API protégés par `IS_AUTHENTICATED_FULLY`.

### 2.2 Frontend (À Implémenter)
*   **Store Auth (`authStore.ts`)** :
    *   State : `token`, `user`, `isAuthenticated`.
    *   Persistance : `localStorage` (pour le token).
*   **Client API (`api/client.ts`)** :
    *   Instance Axios avec Interceptor.
    *   Injection automatique du header `Authorization: Bearer <token>`.
*   **Composants UI** :
    *   `LoginPage` / `RegisterPage`.
    *   `ProjectList` (Modal).
    *   `TopBar` (User Controls).

## 3. Plan d'Exécution

### Étape 1 : Couche Authentification Frontend
1.  **Client Axios** : Configurer `baseURL` (/api) et l'intercepteur de Token.
2.  **Auth Store** : Implémenter Zustand Store (Login/Logout actions).
3.  **Login Page** : Créer formulaire et connecter au store.
4.  **TopBar Update** : Afficher "Login" ou "User Profile".

### Étape 2 : Gestion des Projets (CRUD)
1.  **API Services** : Créer `services/projectService.ts` (getAll, create, saveVersion).
2.  **Save Workflow** :
    *   Si nouveau : `POST /projects` (Créer container) -> `POST /project_versions` (Data).
    *   Si existant : `POST /project_versions` (Nouvelle version).
3.  **Load Workflow** :
    *   `GET /projects` (Liste).
    *   `GET /project_versions/{id}` (Détail JSON).
    *   Hydratation du `projectStore` via `setState(json)`.

### Étape 3 : UI & Polish
1.  **Modale "Save/Load"** : Design unifié (Liste à gauche, détails à droite).
2.  **Notifications** : Toasts pour succès/échec.
3.  **Dernières retouches** : Redirection post-login, gestion expiration token.

## 4. Documentation Impactée
*   `ui_navigation.md` (Ajout flux Login/Dashboard).
*   `architecture_frontend.md` (Ajout AuthStore).
*   `api_endpoints_mvp.md` (Validation finale).
