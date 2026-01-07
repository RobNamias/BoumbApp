# Architecture Conteneur & Environnement

## Vue d'Ensemble
L'application repose sur une architecture micro-services via Docker Compose.

### Services
1.  **`ollama`** (`labo_llm_ollama`)
    - **Rôle** : Moteur d'inférence IA.
    - **Image** : `ollama/ollama:latest`.
    - **Port Exposé** : `11434` (API HTTP).
    - **Persistance** : Le modèle est stocké sur l'hôte via un volume.

2.  **`python_client`** (`labo_llm_client`)
    - **Rôle** : Client API et Logique Métier.
    - **Build** : Custom (`python:3.11-slim` + `requests`).
    - **Comportement** : Reste en vie (`tail -f /dev/null`) pour permettre l'exécution de commandes interactives.

## Configuration (.env)

Le fichier `.env` à la racine `labo_llm/` contrôle les chemins vitaux.

| Variable | Description | Valeur par défaut |
| :--- | :--- | :--- |
| `OLLAMA_MODELS_PATH` | Chemin dossier hôte pour stocker les modèles (poids). | `./ollama_data` |

**Note Sécurité** : Docker ne supporte pas les dossiers hôtes protégés par mot de passe Windows. Le dossier doit être accessible en lecture/écriture "Standard".

## Maintenance & Commandes Utiles

### Gestion des Modèles
Télécharger (Pull) un nouveau modèle dans le conteneur actif :
```bash
docker exec -it labo_llm_ollama ollama pull <nom_modele>
```
*Exemple : `mistral`, `llama2`, `qwen:14b`.*

### Accès au Client
Lancer le script principal :
```bash
docker exec -it labo_llm_client python main.py
```
Accéder au shell :
```bash
docker exec -it labo_llm_client bash
```
