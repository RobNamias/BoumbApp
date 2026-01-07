# Standards API & Architecture

Ce document définit les règles techniques et les conventions pour l'API Symfony (API Platform).

## 1. Protocole & Format
*   **Architecture :** REST (Niveau 3 - Richardson Maturity Model).
    *   *Pourquoi ?* Permet la découverte automatique des ressources via des liens (HATEOAS).
*   **Format d'échange :** JSON-LD (`application/ld+json`).
    *   *Pourquoi ?* Standard du Web sémantique, natif à API Platform, facilite l'auto-documentation.
*   **Vocabulaire :** Hydra (pour la pagination et les métadonnées).
*   **Alternative :** JSON standard (`application/json`) accepté pour les payloads simples si nécessaire.

## 2. Authentification & Sécurité
L'authentification repose sur **JWT (JSON Web Token)**, mais sécurisée pour éviter le stockage dans le `localStorage` (vulnérable XSS).

*   **Mécanisme :** JWT stocké dans un **Cookie HttpOnly**.
    *   *Pourquoi ?* Rend le token invisible au JavaScript client, empêchant le vol de session via une faille XSS.
*   **Attributs du Cookie :**
    *   `HttpOnly` : Inaccessible via JavaScript.
    *   `Secure` : Uniquement via HTTPS (sauf localhost).
    *   `SameSite=Strict` : Protection CSRF (Cross-Site Request Forgery).
*   **Expiration :** 1 heure (avec Refresh Token pour prolonger la session).
*   **CORS :** Configuré pour n'accepter que le domaine du Frontend (Vite).

## 3. Gestion des Erreurs
Les erreurs suivent le standard **RFC 7807** (Problem Details for HTTP APIs) ou le format Hydra par défaut.
*   *Pourquoi ?* Fournit une structure d'erreur prédictible (type, title, detail, violations) pour que le Frontend puisse afficher des messages précis (ex: surligner le champ invalide).

### Codes HTTP Principaux
| Code | Signification | Usage |
| :--- | :--- | :--- |
| **200** | OK | Requête réussie (Lecture, Modification). |
| **201** | Created | Ressource créée avec succès. |
| **204** | No Content | Suppression réussie. |
| **400** | Bad Request | Erreur de syntaxe ou requête invalide. |
| **401** | Unauthorized | Non connecté ou Token invalide. |
| **403** | Forbidden | Connecté mais droits insuffisants. |
| **404** | Not Found | Ressource introuvable. |
| **422** | Unprocessable Entity | Erreur de validation (ex: email vide). |
| **500** | Internal Server Error | Crash serveur (Bug). |

## 4. Pagination & Filtres
Par défaut, les collections sont paginées (30 items par page).

*   **Pagination :** `GET /api/projects?page=2`
    *   *Pourquoi ?* Évite de surcharger le serveur et le navigateur avec des milliers d'objets.
*   **Filtres (SearchFilter) :** `GET /api/samples?category=kick`
    *   *Pourquoi ?* Permet de requêter précisément sans écrire de SQL spécifique.
*   **Tri (OrderFilter) :** `GET /api/projects?order[created_at]=desc`
