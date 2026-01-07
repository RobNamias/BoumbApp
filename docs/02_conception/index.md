# Index Conception (Phase 2)

Ce fichier centralise toute la documentation technique détaillée.
Il sert de référence pour le workflow `withdoc` lors de la phase de développement.

> **Rappel :**
> *   `*_mvp.md` : Périmètre strict de la version 1.
> *   `*_evolution.md` : Fonctionnalités futures.

## 1. Architecture (Vue d'ensemble)
*   [01_architecture/architecture_generale.md](01_architecture/architecture_generale.md) : Choix techniques, Flux de données, Composants clés.

## 2. Base de Données (PostgreSQL)
*   [02_base_de_donnees/bdd_entites_mvp.md](02_base_de_donnees/bdd_entites_mvp.md) : Schéma des tables MVP (User, Project, Sample).
*   [02_base_de_donnees/bdd_entites_evolution.md](02_base_de_donnees/bdd_entites_evolution.md) : Évolutions futures (Social, Tags).
*   [02_base_de_donnees/mcd_mvp.md](02_base_de_donnees/mcd_mvp.md) : Diagramme Mermaid & Code DBML (MVP).
*   [02_base_de_donnees/mcd_evolution.md](02_base_de_donnees/mcd_evolution.md) : Code DBML (Évolution).
*   [02_base_de_donnees/bdd_nomenclature.md](02_base_de_donnees/bdd_nomenclature.md) : Règles de nommage SQL.

## 3. API & Interfaces (Symfony / API Platform)
*   [03_api/api_generale.md](03_api/api_generale.md) : Standards (JSON-LD), Auth (JWT), Erreurs.
*   [03_api/api_endpoints_mvp.md](03_api/api_endpoints_mvp.md) : Liste des routes (Login, Projects, AI).
*   [03_api/api_payloads.md](03_api/api_payloads.md) : Structure JSON des objets complexes (Projet).

## 4. Interface Utilisateur (React / Vite)
*   [04_interface_ui/ui_charte.md](04_interface_ui/ui_charte.md) : Couleurs, Typo, Thèmes.
*   [04_interface_ui/ui_composants.md](04_interface_ui/ui_composants.md) : Bibliothèque de composants (Atomic Design).
*   [04_interface_ui/ui_navigation.md](04_interface_ui/ui_navigation.md) : Sitemap & Flux Utilisateur.
*   [04_interface_ui/ui_maquettes.md](04_interface_ui/ui_maquettes.md) : Liens Figma & Wireframes.

## 5. Moteur Audio
*   [05_moteur_audio/architecture_audio.md](05_moteur_audio/architecture_audio.md) : Flux de signal, Tone.js, Routing.
