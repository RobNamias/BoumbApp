# Architecture API Backend - v2 (Modulaire)

**Objectif** : Remplacer le script monolithique par une architecture en couches robustes et testable.

## Structure des Dossiers

```
ai_service/
├── knowledge_base/ # Documents RAG & Contexte
├── app/
│   ├── core/           # Configuration technique (Socle)
│   │   ├── config.py
│   │   ├── logger.py
│   │   └── exceptions.py
│   ├── logs/           # Journaux d'exécution (CSV)
│   ├── models/         # Contrats de données (Pydantic)
│   │   ├── requests.py
│   │   ├── responses.py
│   │   └── music.py
│   ├── services/       # Logique Métier (Cerveau)
│   │   ├── theory_service.py
│   │   ├── llm_service.py
│   │   ├── prompt_factory.py
│   │   └── prompt_analyzer.py
│   ├── routes/         # Endpoints (Guichet)
│   │   ├── generate.py
│   │   └── feedback.py
│   └── main.py         # Entrypoint
```

## Flux de Données

1.  **Request** (`POST /generate`) -> `routes/generate.py`
2.  **Validation** -> `models/requests.py`
3.  **Orchestration** -> `routes/generate.py` appelle :
    *   `services/theory_service.py` (Calcul Notes + Validation)
    *   `services/prompt_factory.py` (Construction Prompt Strict)
    *   `services/llm_service.py` (Appel IA + JSON Parsing)
4.  **Sanitization** -> `routes/generate.py` (Modulo 32, Pitch Filtering)
5.  **Logging** -> `core/logger.py` (CSV Transaction Log)
6.  **Response** -> `models/responses.py`

## Standards
*   **Validation** : Pydantic V2.
*   **Logs** : Structurés avec Request ID.
*   **Erreurs** : HTTPExceptions standardisées.
