# Index de la Documentation

Ce fichier répertorie la documentation du projet pour faciliter la navigation et l'automatisation.

> **Règle de Documentation :**
> Pour chaque sujet de conception, nous séparons systématiquement les fichiers en deux :
## 01. Analyse (Le Pourquoi et le Quoi)
*   **Spécifications MVP** : [01_analyse/specifications_mvp.md](01_analyse/specifications_mvp.md)
    *   *Contenu :* Cahier des charges fonctionnel de la V1 (DAW Solo).
*   **Spécifications Évolutions** : [01_analyse/specifications_evolution.md](01_analyse/specifications_evolution.md)
    *   *Contenu :* Fonctionnalités futures (Social, Export, MIDI).
*   **Liste Fonctionnalités** : [01_analyse/liste_fonctionnalites.md](01_analyse/liste_fonctionnalites.md)
    *   *Contenu :* Checklist exhaustive (MoSCoW) avec mapping UI.
*   **Fonctionnalité IA** : [01_analyse/fonctionnalite_ia_generative.md](01_analyse/fonctionnalite_ia_generative.md)
    *   *Contenu :* Spécifications détaillées du module de génération mélodique.
*   **Choix Stack** : [01_analyse/choix_stack.md](01_analyse/choix_stack.md)
    *   *Contenu :* Justification des choix techniques (Symfony, Postgres, React).
*   **Comparatif Migration** : [01_analyse/comparatif_stack.md](01_analyse/comparatif_stack.md)
    *   *Contenu :* Plan de transition de l'existant vers la cible.
*   **Structure Initiale** : [01_analyse/structure_actuelle.md](01_analyse/structure_actuelle.md)
    *   *Contenu :* État des lieux du projet Symfony d'origine.

## 02. Conception (Le Comment)
> **Index Détaillé :** [02_conception/index.md](02_conception/index.md)

### 02.1 Architecture

*   **Vue d'Ensemble** : [02_conception/01_architecture/architecture_generale.md](02_conception/01_architecture/architecture_generale.md)
    *   *Contenu :* Résumé des choix techniques et fonctionnels (Référence Analyse).


### 02.2 Base de Données
*   **Modèle de Données (MVP)** : [02_conception/02_base_de_donnees/bdd_entites_mvp.md](02_conception/02_base_de_donnees/bdd_entites_mvp.md)
    *   *Contenu :* Entités et attributs essentiels pour la V1.
*   **Modèle de Données (Évolutions)** : [02_conception/02_base_de_donnees/bdd_entites_evolution.md](02_conception/02_base_de_donnees/bdd_entites_evolution.md)
    *   *Contenu :* Extensions de schéma pour le futur.
*   **Visualisation MCD (MVP)** : [02_conception/02_base_de_donnees/mcd_mvp.md](02_conception/02_base_de_donnees/mcd_mvp.md)
    *   *Contenu :* Diagrammes Mermaid et code DBML pour la V1.
*   **Visualisation MCD (Évolution)** : [02_conception/02_base_de_donnees/mcd_evolution.md](02_conception/02_base_de_donnees/mcd_evolution.md)
    *   *Contenu :* Code DBML pour la V2+ (Social).
*   **Nomenclature BDD** : [02_conception/02_base_de_donnees/bdd_nomenclature.md](02_conception/02_base_de_donnees/bdd_nomenclature.md)
    *   *Contenu :* Règles de nommage SQL/PHP.



### 02.3 API & Interfaces
*   **Standards API** : [02_conception/03_api/api_generale.md](02_conception/03_api/api_generale.md)
    *   *Contenu :* Architecture REST, Auth, Erreurs.
*   **Endpoints MVP** : [02_conception/03_api/api_endpoints_mvp.md](02_conception/03_api/api_endpoints_mvp.md)
    *   *Contenu :* Liste des routes API.
*   **Payloads JSON** : [02_conception/03_api/api_payloads.md](02_conception/03_api/api_payloads.md)
    *   *Contenu :* Exemples de données échangées.
*   **API IA Interne** : [02_conception/03_api/api_ia_interne.md](02_conception/03_api/api_ia_interne.md)
    *   *Contenu :* Spécifications du service Python pour l'IA Générative.

### 02.4 Interface Utilisateur (UI/UX)
*   **Charte Graphique** : [02_conception/04_interface_ui/ui_charte.md](02_conception/04_interface_ui/ui_charte.md)
    *   *Contenu :* Couleurs, Typo, Thèmes.
*   **Composants** : [02_conception/04_interface_ui/ui_composants.md](02_conception/04_interface_ui/ui_composants.md)
    *   *Contenu :* Liste des composants React (Atomic Design).
*   **Navigation** : [02_conception/04_interface_ui/ui_navigation.md](02_conception/04_interface_ui/ui_navigation.md)
    *   *Contenu :* Arborescence (Sitemap) et Flux.
*   **Maquettes** : [02_conception/04_interface_ui/ui_maquettes.md](02_conception/04_interface_ui/ui_maquettes.md)
    *   *Contenu :* Liens Figma et Wireframes.



## 03. Initialisation (Le Démarrage)
> **Index Détaillé :** [03_initialisation/index.md](03_initialisation/index.md)

## 04. Workflow & Directives Agent (La Méthode)
> **Index Détaillé :** [04_agent_workflow/index.md](04_agent_workflow/index.md)

*   **Manifeste (Strict Doc)** : [04_agent_workflow/agent_directives.md](04_agent_workflow/agent_directives.md)
    *   *Contenu :* Règles de rigueur, optimisation et traçabilité documentaire.

## 05. Référence Technique (Le Contexte)
> **Index Détaillé :** [05_reference_technique/index.md](05_reference_technique/index.md)

*   **Fiche d'Identité Technique** : [05_reference_technique/fiche_identite_technique.md](05_reference_technique/fiche_identite_technique.md)
    *   *Contenu :* Stack, Ports, Arborescence, Commandes. **(À lire pour charger le contexte)**.
    *   **Architecture Frontend** : [05_reference_technique/architecture_frontend.md](05_reference_technique/architecture_frontend.md)
    *   **Architecture Backend IA** : [05_reference_technique/architecture_backend_ai.md](05_reference_technique/architecture_backend_ai.md)
    *   **Conventions de Nommage** : [05_reference_technique/conventions_nommage.md](05_reference_technique/conventions_nommage.md)

## 06. Qualité & Tests (La Traçabilité)
> **Index Détaillé :** [06_qualite_tests/index.md](06_qualite_tests/index.md)

*   **Stratégie Globale** : [06_qualite_tests/01_strategie/strategie_globale.md](06_qualite_tests/01_strategie/strategie_globale.md)
*   **Inventaires Tests** :
    *   **Frontend (Vitest)** : [06_qualite_tests/04_inventaire/inventaire_tests_frontend.md](06_qualite_tests/04_inventaire/inventaire_tests_frontend.md)
*   **Rapports d'Exécution** : [06_qualite_tests/02_campagnes/](06_qualite_tests/02_campagnes/)
*   **Playground (Dev Tools)** : [06_qualite_tests/05_playground/index.md](06_qualite_tests/05_playground/index.md)

## 07. Recherche & POC (Le Labo)
> **Index Détaillé :** [07_recherche/index.md](07_recherche/index.md)

*   **POC IA Générative** : [07_recherche/02_poc_ia_generative/index.md](07_recherche/02_poc_ia_generative/index.md)
    *   *Contenu :* Protocole, Audit, Specs et Rapports (Tone.js + Gemini).
*   **POC Python LLM** : [07_recherche/01_api_python_llm_local/index.md](07_recherche/01_api_python_llm_local/index.md)
    *   *Contenu :* API Python pour inférence locale (Mistral).

## 08. Planification (Le Cerveau)
> **Index Détaillé :** [08_planification/index.md](08_planification/index.md)

*   **Méthodes & Outils** : [08_planification/01_methode_et_outils.md](08_planification/01_methode_et_outils.md)
*   **Plan Maître** : [08_planification/02_plan_maitre.md](08_planification/02_plan_maitre.md)
*   **Plans Détaillés** :
    *   **Intégration IA (V1)** : [08_planification/03_plans_detailles/07_integration_ia_locale.md](08_planification/03_plans_detailles/07_integration_ia_locale.md)
    *   **Intégration Magenta (P1)** : [08_planification/03_plans_detailles/09_integration_magenta_cpu.md](08_planification/03_plans_detailles/09_integration_magenta_cpu.md)
    *   **Optimisation IA (V2)** : [08_planification/03_plans_detailles/08_optimisation_ia.md](08_planification/03_plans_detailles/08_optimisation_ia.md)

## 09. R&D : Spécialisation IA (Architecture V2)
> **Index Détaillé :** [09_specialisation_ia_avancee/00_index_specialisation.md](10_specialisation_ia_avancee/00_index_specialisation.md)

*   **Modèle Hybride (P1)** : [09_specialisation_ia_avancee/01_modele_hybride.md](10_specialisation_ia_avancee/01_modele_hybride.md)
*   **Micro-RAG (P2)** : [09_specialisation_ia_avancee/02_micro_rag.md](10_specialisation_ia_avancee/02_micro_rag.md)
*   **Fine-Tuning (P3)** : [09_specialisation_ia_avancee/03_fine_tuning.md](10_specialisation_ia_avancee/03_fine_tuning.md)
