# Intégration Magenta (CPU)

## 1. Contexte
Pour améliorer la qualité musicale des mélodies générées (fluidité, structure), nous avons intégré **Google Magenta** (modèle `attention_rnn`) directement dans le service `ai_service`.
Contrainte majeure : Le projet doit tourner localement sur CPU (Laptop).

## 2. Stack Technique
*   **Base Image** : `tensorflow/tensorflow:2.11.0` (Contient Python 3.8.10)
    *   *Raison* : Magenta dépend de `tf-slim` et de vieilles versions de Numba qui cassent sur Python 3.11+. TF 2.11 est la dernière version "facile" compatible.
*   **Librairies** :
    *   `magenta` (Logique de génération, RNN)
    *   `note_seq` (Structures de données Protobuf)
    *   `libasound2-dev`, `libsndfile1` (Dépendances système audio)

## 3. Architecture : L'Orchestrateur Hybride
Nous n'utilisons pas Magenta seul (qui ne comprend pas le texte), ni un LLM seul (qui hallucine le MIDI). Nous utilisons une approche hybride chainer dans l'endpoint `/generate`.

### Flux de Données
1.  **Input Utilisateur** : Texte ("Acid Bass") + Paramètres (BPM, Scale).
2.  **LLM (Qwen 2.5)** :
    *   Rôle : "Primer Generator".
    *   Action : Génère une courte séquence de 4 à 8 notes (Seed) qui capture "l'intention" du style.
3.  **Magenta (Attention RNN)** :
    *   Rôle : "Improvisateur".
    *   Action : Prend ce Seed et le continue jusqu'à 32 pas (2 mesures).
    *   Avantage : Cohérence musicale parfaite, respecte la tonalité et le rythme.

```mermaid
graph LR
    User[Frontend] -->|JSON| API[FastAPI /generate]
    API -->|Prompt| LLM[Qwen (Ollama)]
    LLM -->|Primer (4 notes)| API
    API -->|Primer + Scale| Magenta[Attention RNN]
    Magenta -->|Full Melody (32 steps)| API
    API -->|Notes| User
```

## 4. Détails d'Implémentation
*   **Lazy Loading** : Le modèle (~150MB) n'est chargé en mémoire qu'au premier appel pour accélérer le démarrage du conteneur.
*   **Hybrid Imports** : Hack nécessaire pour faire tourner Magenta 2.x en 2025.
    *   `import magenta.music as mm` (Logic)
    *   `from note_seq.protobuf import music_pb2` (Data)
*   **Normalisation** :
    *   Les Primers LLM sont recalés à `t=0`.
    *   La sortie est clampée strictement à 32 pas pour éviter les débordements UI.

## 5. Vérification
L'intégration a été validée via des scripts internes (`test_magenta.py`, `test_orchestrator.py`) qui ont confirmé le bon fonctionnement de la chaîne.

## 6. Testing & Validation
Un script d'intégration système valide l'ensemble de la chaîne V2 (Smart Analysis + Magenta).
*   **Path** : `ai_service/tests/test_v2_system.py`
*   **Usage** : `python tests/test_v2_system.py`
*   **Vérifie** :
    *   Connexion API (Port 8002).
    *   Moteur d'Analyse (Override de style "Japonais" -> "Hirajoshi").
    *   Génération de notes (>16 notes).
