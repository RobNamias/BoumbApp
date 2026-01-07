# Plan Détaillé 13 : Intégration RAG Hybride (Perplexity + Qwen)

**Statut** : 🟢 Terminé
**Date** : 17/12/2025
**Réf. Architecture** : `docs/09_specialisation_ia_avancee/06_architecture_rag_hybride.md`

## 1. Vision & Objectifs
Créer un pipeline de génération musicale "intelligent" qui :
1.  **Cherche** la théorie musicale via Perplexity API ("Teacher").
2.  **Apprend** en stockant ce savoir dans un *Micro-RAG* (Fichiers Markdown).
3.  **Compose** en utilisant un SLM Local (Qwen 1.5B/3B) nourri par ce contexte ("Student").

> **Analogie** : On ne demande pas à l'étudiant (Qwen) d'inventer la théorie. On lui donne le manuel (écrit par Perplexity) et on lui demande de faire l'exercice.

## 2. Découpage Technique

## 2. Découpage Technique : "Separate Build & Run"

Cette architecture sépare la **Constitution du Savoir** de son **Utilisation**, pour des raisons de coût et de sécurité.

### Phase A : "Le Bibliothécaire" (Offline / CLI)
Un script Python autonome (`librarian.py`), exécutable hors du conteneur principal si besoin.
*   **Mission** : Créer le Micro-RAG.
*   **Input** : Une liste de "Sujets" (ex: `topics.yaml` ou argument CLI).
*   **Outil** : Clé API Perplexity.
*   **Output** : Écrit des fichiers Markdown dans `data/rag_knowledge/`.
*   **Avantage** :
    *   Pas besoin de la Clé API en Prod/Runtime.
    *   On peut "préchauffer" le RAG avec 50 styles musicaux d'un coup.
    *   Exécution possible en local, sur un autre conteneur, ou via une tâche CRON.

### Phase B : "L'Orchestrateur" (Runtime / App)
Le service `ai_service` (Docker) intégré à l'app.
*   **Mission** : Composer de la musique.
*   **Accès RAG** : **Lecture Seule**. Il ne fait *jamais* d'appel Perplexity (sauf fonctionnalité "Live Research" explicite).
*   **Flux** :
    1.  User demande "Funk".
    2.  App cherche `funk.md`.
    3.  Si trouvé -> Utilise Qwen.
    4.  Si pas trouvé -> Erreur "Je ne connais pas ce style" (ou fallback mode générique).

### Phase C : "L'Interface" (Frontend React)
*   **Composant `AIPrompt`** :
    *   Liste déroulante des "Styles Connus" (basée sur les fichiers MD présents).
    *   Champ libre (pour raffiner).
    *   Feedback : "Utilisation du contexte : Bass Funk (Source: Perplexity)".

## 3. Plan d'Action (Step-by-Step)

### Étape 1 : Infrastructure & POC (Backend)
-#### [DONE] [bulk_librarian.py](file:///d:\Dev\Perso\Web\BOUMBAPP\Application\BoumbApp\ai_service\bulk_librarian.py)
- [x] Auto-generate directories based on category (`styles/`, `theory/`).
- [x] Integrate Perplexity for content fetching.
- [x] Implement Inbox/Archive workflow.
- [x] Auto-populate `glossaire.md`.
- [x] Auto-update `index.md` files.

#### [DONE] [rag_loader.py](file:///d:\Dev\Perso\Web\BOUMBAPP\Application\BoumbApp\ai_service\rag_pipeline\rag_loader.py)
- [x] Implement recursive search.
- [x] Add Fuzzy Keyword Scoring for better matching.
- [x] Ignored non-content files (index, glossary) for search.

## Verification Plan
- [x] Run `librarian.py --category styles/techno "Acid Line"` -> Check file creation.
- [x] Run `bulk_librarian.py` with `inbox.txt` -> Check archive move and glossary update.
- [x] Test `rag_loader` with fuzzy query "Acid Melody" -> Verify it finds the file.nd
- [x] Endpoint `POST /generate` mis à jour pour accepter `{"topic": "...", "use_rag": true}`.
- [x] Intégration du pipeline dans FastAPI.

### Étape 3 : Frontend Sync
- [x] Création du composant `AIPrompt` dans `SynthPanel`.
- [x] Connexion au backend.

## 4. Questions Ouvertes & Risques
1.  **Latence** : Perplexity prend 2-5s. Ollama prend 2-10s. L'utilisateur attendra 15s. Est-ce acceptable ? (UI "Loader" captivante requise).
2.  **Coût Perplexity** : On commence avec la clé de l'utilisateur. Il faudra gérer le cas "Quota dépassé".
3.  **Format de sortie** : Qwen 1.5B est petit. Il faut être très strict sur le format JSON demandé (GBNF grammar ?).

## 5. Prochaine Action
Lancer l'Étape 1 : Valider qu'on sait parler à Perplexity depuis le Python.
