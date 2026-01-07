# Plan Détaillé 09 : Intégration Magenta (CPU Focus)

**Statut** : Planification
**Date** : 04/01/2026
**Contexte** : Intégration d'un moteur de génération MIDI *natif* et *léger* pour compléter Ollama (trop lent sur CPU Intel Iris Xe).

## 1. Objectifs
*   Ajouter la capacité de génération MIDI via Google Magenta (RNN) dans l'architecture existante.
*   Assurer une performance < 2s sur CPU (Intel Iris Xe).
*   Ne pas créer de nouveau conteneur (enrichir `ai_service`).

## 2. Architecture Technique

### 2.1 Backend (`ai_service`)
Le service Python existant (FastAPI) sera enrichi.

*   **Nouvelles Dépendances** :
    *   `tensorflow-cpu` : Moteur de calcul (Version CPU pour éviter l'overhead inutile).
    *   `magenta` : Bibliothèque de génération musicale.
    *   `librosa` : Traitement audio (dépendance transitive souvent requise).

*   **Nouveau Service** (`MagentaService`) :
    *   Chargement unique du modèle au démarrage (Singleton) pour éviter la latence par requête.
    *   Gestion du modèle `attention_rnn` (compromis qualité/vitesse idéal).

### 2.2 Stockage Modèles
*   Volume Docker : Les fichiers `.mag` (checkpoints) seront stockés dans `ai_service/app/models/magenta/` et persistés via le volume Docker existant ou un nouveau bind mount.

### 2.3 API Endpoints
*   `POST /api/v1/magenta/generate`
    *   **Input** : `{ "primer_melody": [...], "total_steps": 32, "temperature": 1.0 }`
    *   **Output** : `{ "notes": [...] }` (Format JSON compatible BoumbApp).

## 3. Étapes d'Implémentation (Pas à Pas)

### Phase A : Préparation Environment (Docker)
> [!IMPORTANT]
> **Décision Technique (04/01/2026)** : Utilisation de l'image `tensorflow/tensorflow:2.11.0`. 
> Magenta nécessite des dépendances (Numba, LLVM) incompatibles avec Python 3.11+. L'image TF 2.11 fournit Python 3.8.10, nativement compatible.

1.  [x] **Mise à jour Requirements** : Ajouter `magenta`, `librosa`.
2.  [x] **Mise à jour Dockerfile** : Base `tensorflow/tensorflow:2.11.0` + deps système audio.
3.  [x] **Rebuild Docker** : Succès.
4.  [x] **Health Check** : Import `magenta` fonctionnel. Code adapté pour Python 3.8 (Typage).

### Phase B : Logique Métier (Service)
4.  [ ] **Téléchargement Modèle** : Script pour récupérer `attention_rnn.mag`.
5.  [ ] **Service Python** : Création de `MagentaService` avec méthode `generate()`.
6.  [ ] **Test Unitaire** : Test simple d'import et d'instanciation.

### Phase C : API & Intégration
7.  [ ] **Route FastAPI** : Création du endpoint `/api/v1/magenta/generate`.
8.  [ ] **Test d'Intégration** : Appel Curl pour vérifier la sortie JSON.

## 4. Stratégie de Vérification
*   **Performance** : Le temps de réponse doit être inférieur à 2 secondes pour 32 steps.
*   **Qualité** : Le JSON de sortie doit être valide et parsable par le frontend.
