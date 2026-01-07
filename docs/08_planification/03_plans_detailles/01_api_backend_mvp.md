# Rapport d'Implémentation : API Backend (MVP)

Ce document décrit l'état final de la couche API pour le MVP, telle qu'implémentée et validée.

## 1. Sécurité & Authentification
**Status** : ✅ Implémenté | **Techno** : `LexikJWTAuthenticationBundle`

### Architecture
*   **Mode** : Stateless (JWT).
*   **Clés** : Pairages SSL (Private/Public) générés via OpenSSL (gerés par Docker/Symfony).
*   **Provider** : Entité `User` (email/password).

### Endpoints Auth
*   `POST /api/login_check` :
    *   **Payload** : `{"username": "...", "password": "..."}`
    *   **Response** : `{"token": "eyJhbGciOi..."}`
    *   **TTL** : 3600s (Configurable).

### Sécurité des Données
*   **Firewall** : `/api` est stateless.
*   **Extension Doctrine** : `CurrentUserExtension` injectée pour filtrer automatiquement les données sensibles (ex: un user ne voit que ses projets).

## 2. Catalogues (Ressources Publiques/Auth)
**Status** : ✅ Implémenté | **Tests** : `CatalogTest.php`

Ces ressources sont en lecture seule pour l'application frontend.

### `Sample` & `SynthPreset`
*   **Opérations** : `GET` (Collection), `GET` (Item).
*   **Sécurité** : Accessible aux utilisateurs authentifiés (`ROLE_USER`).
*   **Configuration** : Attributs `#[ApiResource]` sur les entités.

## 3. Gestion des Projets (CRUD User)
**Status** : ✅ Implémenté | **Tests** : `ProjectTest.php`

C'est le cœur de la persistance des données utilisateur.

### `Project`
*   **Opérations** : `GET`, `POST`.
*   **Sécurité (Lecture)** :
    *   Filtre automatique via `CurrentUserExtension` : `WHERE owner = :current_user`.
    *   Empêche l'accès ID direct aux projets d'autrui (404/403).
*   **Sécurité (Écriture)** :
    *   `ProjectProcessor` : Assigne automatiquement l'utilisateur connecté comme `owner` lors du `POST`.
*   **Groupes de Sérialisation** :
    *   `project:read` : ID, Name, IsPublic, Owner (ID), CreatedAt.
    *   `project:write` : Name, IsPublic.

## 4. Tests & Validation
L'inventaire complet est disponible dans **[Inventaire des Tests](../../06_qualite_tests/04_inventaire/inventaire_tests_backend.md)**.

| Domaine | Test | Statut |
| :--- | :--- | :--- |
| **Auth** | `AuthTest` (Login OK/KO) | 🟢 PASS |
| **Catalog** | `CatalogTest` (Samples/Presets) | 🟢 PASS |
| **Data** | `ProjectTest` (Isolation User) | 🟢 PASS |
