# Architecture Backend IA & RAG Hybride

## 1. Vue d'Ensemble

Le module **AI Service** (`/ai_service`) est responsable de la génération musicale intelligente. Il repose sur une architecture **RAG Hybride** (Retrieval-Augmented Generation) combinant :
- **Perplexity API (Sonar)** : Pour l'acquisition de connaissances "fraiches" et théoriques (The Librarian).
- **Ollama (Qwen 2.5 3B)** : Pour l'inférence locale et la génération de JSON (The Composer).
- **Stockage Local Markdown** : Pour la persistance structurée de la connaissance.

---

## 2. Structure des Données (`knowledge_base/`)

La connaissance est organisée hiérarchiquement pour optimiser le contexte injecté.

```text
ai_service/
└── knowledge_base/
    ├── glossaire.md          # Index global auto-généré (Concept -> Lien)
    ├── styles/
    │   ├── house/
    │   │   ├── index.md      # Liste des fichiers du dossier
    │   │   ├── deep_house_chords.md
    │   │   └── ...
    │   └── techno/
    │       ├── index.md
    │       └── acid_bassline.md
    ├── theory/
    │   ├── scales/
    │   └── harmony/
    └── instruments/
```

### Mécanismes Clés
1.  **Indexation Automatique** : Chaque dossier contient un `index.md` mis à jour à chaque écriture via `librarian.py`.
2.  **Glossaire Global** : `glossaire.md` agit comme une table de matières plate, enrichie automatiquement par le Librarian.

---

## 3. Composants Logiciels

### A. The Librarian (`librarian.py`)
Agent "Researcher". Il interroge Perplexity pour créer des fiches de synthèse.
- **Entrée** : Sujet (ex: "Acid Techno Bass"), Catégorie (ex: "styles/techno").
- **Sortie** : Fichier Markdown structuré + Mise à jour des index/glossaire.
- **Utilisation** : `python librarian.py --category styles/techno "Acid Bass"`

### B. Bulk Librarian (`bulk_librarian.py`)
Version industrielle du Librarian pour l'ingestion de masse.
- **Input** : `inbox.txt` (Liste de sujets à traiter).
- **Output** : `archive.txt` (Log des succès).
- **Workflow** :
    1. Lit `inbox.txt`.
    2. Pour chaque ligne, appelle Perplexity.
    3. Sauvegarde le MD.
    4. Met à jour le glossaire (append).
    5. Déplace la ligne dans `archive.txt` avec un timestamp.
    6. À la fin, régénère les `index.md` des dossiers touchés.

### C. The Orchestrator (`rag_loader.py`)
Moteur de recherche contextuel utilisé au runtime (génération).
- **Fonction** : `find_context(query)`
- **Algorithme** : **Fuzzy Keyword Scoring**.
    - Analyse la requête utilisateur (ex: "Make an acid techno track").
    - Scanne récursivement tous les fichiers `.md` de la `knowledge_base`.
    - Calcule un score de pertinence basé sur l'intersection des mots-clés du nom de fichier et de la requête.
    - Retourne le contenu du fichier le plus pertinent (> seuil).

### D. The Composer (`prompt_factory.py` + `ollama_client.py`)
- Construit le System Prompt final en injectant le contexte RAG (si trouvé).
- Force le format JSON pour la réponse.

---

## 4. Flux de Données

1.  **Apprentissage (Offline)** :
    `Utilisateur` -> `inbox.txt` -> `Bulk Librarian` -> `Perplexity` -> `Fichier MD` -> `Indexation`.

2.  **Génération (Runtime)** :
    `Client (React)` -> `POST /generate` -> `RagLoader (Search)` -> `Prompt Factory` -> `Ollama` -> `JSON Response`.

---

## 5. Maintenance

- **Ajout de Connaissance** : Ajouter une ligne dans `ai_service/inbox.txt` et lancer le script bulk.
- **Correction** : Les fichiers MD sont éditables manuellement.
- **Nettoyage** : `inbox.txt` se vide automatiquement. `archive.txt` garde l'historique.
