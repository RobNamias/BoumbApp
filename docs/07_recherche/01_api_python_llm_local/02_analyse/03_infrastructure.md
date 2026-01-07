# Architecture & Infrastructure

## Contrainte Docker
La demande impose une utilisation maximale de **Docker**.

### Analyse des Risques & Difficultés
1.  **Accès GPU (GPU Passthrough)**
    - *Difficulté* : Docker seul ne voit pas le GPU.
    - *Solution* : Nécessite **NVIDIA Container Toolkit** sur l'hôte et l'utilisation du flag `--gpus all`.
    - *Risque Windows* : Sur Windows, cela passe impérativement par **WSL2**. La configuration peut être instable si les drivers ne sont pas à jour.

2.  **Taille des Images**
    - Une image Docker contenant PyTorch + CUDA (nécessaire pour le script d'étude fournis) pèse souvent **> 5 Go**.
    - Une image "Client API" (si on utilise Ollama externe ou dockerisé séparément) est très légère (< 200 Mo).

3.  **Persistance des Modèles**
    - *Critical* : Ne jamais "baker" (inclure) le modèle (plusieurs Go) dans l'image Docker. Utiliser des **Volumes** pour mapper le dossier des poids (`/models` ou `~/.cache/huggingface`).

---

## Architecture : Transformers (Script) vs Ollama

Le fichier `03_fichier_python_d_etude.py` fourni utilise la librairie **Hugging Face Transformers** et charge le modèle directement en VRAM avec PyTorch. Ceci est une approche "Direct Inference".

### Option A : Dockerisation du Script "Direct" (Approche actuelle du fichier étude)
- **Image** : Lourde (Python + PyTorch + Cuda Drivers).
- **Avantage** : Contrôle total sur le code de génération (paramètres `model.generate()`, seed exact, logits).
- **Inconvénient** : Lourd à builder et déployer. Temps de chargement à chaque démarrage du conteneur.

### Option B : Architecture "Micro-Services" (Recommandée)
1.  **Service 1 : Moteur IA (Ollama ou TGI)**
    - Conteneur officiel optimisé (gère le GPU, le chargement du modèle).
    - Expose une API HTTP.
2.  **Service 2 : Backend App (Notre Logiciel)**
    - Image légère (Python simple).
    - Envoie le prompt et récupère le JSON via l'API du Service 1.
    - Contient la logique métier (parsing musique, validation).

### Recommandation
Pour un "Labo", l'**Option B** est plus propre et respecte philosophie "Docker" (séparation des responsabilités).
Le script `03_fichier_python_d_etude.py` sert de **référence pour la logique de prompt** mais ne devrait pas être dockerisé tel quel pour la production du labo, sauf si on a besoin de fonctionnalités très bas niveau inaccessibles via API.
