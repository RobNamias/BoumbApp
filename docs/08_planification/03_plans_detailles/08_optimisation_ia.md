# Plan Détaillé 08 : Plan d'Action pour l'Optimisation IA (Phase 2)

**Statut** : En Planification
**Date** : 09/12/2025
**Objectif** : Améliorer le ratio **Temps de Réponse / Complexité** du service IA.

Actuellement, le système fonctionne ("Lite Mode") mais subit des latences importantes dues au matériel local (CPU inference). Ce plan vise à fluidifier l'expérience sans sacrifier la qualité musicale.

---

## 1. Axe "Prompt Engineering & Structure" (Logiciel)

### 1.1 Grammaires Ollama (BNF)
Ollama supporte désormais les grammaires GBNF. Plutôt que de dire "Donne moi du JSON", nous pouvons forcer le moteur à ne générer **QUE** des tokens conformes au schéma JSON.
*   **Gain** : Fini les erreurs de parsing ("```json"). Fini le "bavardage" (chatiness).
*   **Action** : Créer un fichier `.gbnf` pour la structure `MelodySequence` et le passer à l'API Ollama.

### 1.2 "Fill-in-the-Middle" (FIM)
Au lieu de générer une mélodie "from scratch", on peut pré-remplir une structure rythmique simple et demander à l'IA de "colorier" les hauteurs de notes.
*   **Gain** : Moins de charge cognitive pour le modèle, résultats plus rapides.

### 1.3 Few-Shot Learning "Compressé"
Injecter 2 ou 3 exemples de mélodies JSON *très courtes* (1 mesure) directement dans le prompt système.
*   **Gain** : Le modèle "imite" la structure immédiatement, réduisant le temps de convergence.

---

## 2. Axe Technique (Infrastructure Local)

### 2.1 Quantization Agressive (Model Tuning)
Le modèle `mistral` standard (7B) est lourd (~4GB VRAM).
*   **Action** : Tester des variantes quantifiées plus agressives si le CPU est le goulot d'étranglement :
    *   `q4_k_m` (Standard actuel, bon équilibre).
    *   `q2_k` (Très rapide, mais risque de résultats musicaux "cassés").
    *   **Alternative** : Passer sur des modèles plus petits spécialisés (ex: `TinyLlama` 1.1B ou `Phi-2` 2.7B) fine-tunés pour le JSON.

### 2.2 Gestion du "Cold Start" (Keep-Alive)
Ollama décharge le modèle de la mémoire après 5 min d'inactivité (par défaut).
*   **Problème** : Le premier clic prend 30s (chargement), les suivants 5s.
*   **Action** : Configurer Ollama pour garder le modèle en RAM (`keep_alive: -1` ou `60m`) lors de la session de travail.

### 2.3 Paramètres d'Inférence
*   `num_ctx` : Réduire strictement à 1024 ou 512 si on ne génère que 2 mesures. Moins de contexte = Moins de RAM = Plus vite.
*   `num_thread` : Ajuster au nombre de coeurs physiques CPU (ne pas surcharger).

---

## 3. Axe UX & Méthode de Discussion

### 3.1 Streaming (Feedback Temps Réel)
Actuellement, on attend la fin du JSON (bloquant).
*   **Idée** : Parser le JSON "au fil de l'eau" (compliqué) ou afficher un texte "Thinking..." qui montre les "Pensées" de l'IA si on utilisait une chaine de pensée.
*   **Mieux** : Génération progressive mesure par mesure (Chain of Requests).
    1.  Génère Mesure 1 -> Affiche/Joue.
    2.  Génère Mesure 2 -> Append.

### 3.2 Mode "Chat" (Raffinement)
Au lieu de "One-Shot" (Générer -> Remplacer), passer à un mode conversationnel.
*   **Workflow** :
    1.  User: "Bassline funk" -> IA génère V1.
    2.  User: "Plus rapide" -> IA modifie V1 (au lieu de tout refaire).
*   **Implémentation** : Envoyer l'historique JSON précédent dans le contexte (Attention à la taille du contexte !).

## 4. Stratégies Avancées (Architecture V2)

### 4.1 "Cerveau Hybride" (Priorité P1 - Court Terme)
**Validé par User**. Utiliser Python pour pré-calculer les règles strictes et soulager l'IA.
*   **Principe** : Python calcule la "Piscine de Notes" (ex: Gamme C Minor = C, D, Eb...) et les règles de chevauchement.
*   **Implémentation** : Script `MusicTheoryService.py` qui génère une liste de contraintes injectée dans le Prompt.

### 4.2 "Micro-RAG" (Priorité P2 - Moyen Terme)
Pour ~50 pages de théorie, une base vectorielle (ChromaDB) est overkill.
*   **Méthode "Keyword Injection"** : Si le prompt contient "Jazz II-V-I", Python charge le fichier texte `docs/theory/jazz.txt` et le colle dans le System Prompt.
*   **Gain** : Contextualisation forte sans latence d'indexation lourde.

### 4.3 Fine-Tuning "Small Model" (Priorité P3 - Long Terme)
Créer un modèle spécialiste (ex: `TinyLlama-1.1B`) qui ne fait QUE du JSON musical.
*   **Dataset** : Convertir des datasets MIDI publics (Maestro, Lakh) vers notre format JSON.
*   **Gain** : Vitesse extrême (< 1s) et robustesse syntaxique 100%.

## 4. Plan de Mise en Œuvre (Priorités)

| Priorité | Action | Complexité | Gain Est. |
| :--- | :--- | :--- | :--- |
| **P1** | **Ollama Keep-Alive** (Config Docker) | Faible | ✅ Fait |
| **P1** | **Réduction Context (`num_ctx=2048`)** | Faible | ✅ Fait |
| **P1** | **Switch Modèle (`qwen2.5:1.5b`)** | Faible | ❌ Obsolète (Trop limité) |
| **P1.5** | **Upgrade Modèle (`qwen2.5:3b`)** | Faible | 🔄 En Cours (Qualité) |
| **P1** | **Prompt V2 (Règles Musicales + Notation #)** | Moyenne | ✅ Fait |
| **P3** | **Grammaire GBNF** | Élevée (Code) | ⏸️ En Attente (Pas nécessaire pour l'instant) |
| **P4** | **UX Streaming / Chat** | Élevée (Frontend) | ⭐⭐ (Ressenti) |

**Recommandation Immédiate** : Commencer par P1 (Config) et P2 (Tester un petit modèle 1B-3B paramètres).
