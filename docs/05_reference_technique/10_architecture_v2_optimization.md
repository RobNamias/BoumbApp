# Architecture V2 : Optimization & Intelligent Intent

## 1. Problematique Actuelle
L'architecture actuelle (V1) est trop rigide sur la gestion de la tonalité (Key/Scale).
- **Point de friction** : `PromptAnalyzer` utilise des Regex strictes pour déduire la tonalité.
- **Limite** : Si l'utilisateur demande "Une mélodie japonaise", le Regex ne trouve pas "Key of X", donc il fallback sur la `Global Key` (ex: C Minor).
- **Conséquence** : Le `TheoryService` verrouille les notes sur C Minor, empêchant l'LLM de générer une gamme exotique (Hirajoshi) nécessaire pour le style demandé.

## 2. Objectif "Reflexion"
Passer d'une extraction de paramètres **Rule-Based** (Regex) à une extraction **Semantic-Based** (LLM), tout en gardant une exécution rapide.

## 3. Architecture Proposée (Hybrid V2)

Nous allons déléguer l'analyse d'intention à un petit appel LLM (ou au même appel via du "Prompt Chaining") pour débloquer la créativité.

### Flux Optimisé

1.  **Frontend** : Envoie `prompt` + `global_key`.
2.  **Smart Analyzer (NOUVEAU)** :
    *   Au lieu de Regex complexes, on envoie le prompt à Qwen avec une instruction : *"Extract musical parameters (Root, Scale, BPM) from this text. If the style implies a specific scale (e.g. 'Japanese' -> 'Hirajoshi'), OVERRIDE the global context."*
    *   **Output JSON** : `{ "root": "C", "scale": "Hirajoshi", "bpm": 85 }`
3.  **Theory Service** :
    *   Génère les `valid_pitches` pour *Hirajoshi* (au lieu de Minor).
4.  **Generation Pipeline** (Inchangé) :
    *   Qwen (Primer) génère dans la gamme Hirajoshi.
    *   Magenta (Continuation) continue.

### Avantages
*   **Flexibilité Totale** : "Arabian style" -> *Double Harmonic Major*. "Bluesy" -> *Blues Scale*.
*   **Override Intelligent** : Si l'utilisateur est explicite ("in C Major"), l'LLM le respecte. Si c'est implicite (Style), l'LLM adapte.
*   **Simplicité du Code** : On supprime des centaines de lignes de Regex fragiles dans `PromptAnalyzer`.

## 4. Plan de Migration

1.  **Refonte `PromptAnalyzer`** :
    *   Remplacer la logique Regex par un appel `llm.analyze_request()`.
    *   Définir un Prompt Système strict pour l'extraction JSON.
2.  **Mise à jour `TheoryService`** :
    *   S'assurer qu'il supporte les gammes exotiques (Hirajoshi, Pentatonic, etc.) via `music21` ou un dictionnaire étendu.
3.  **Cleanup** :
    *   Supprimer l'ancienne logique heuristique.

## 5. Exemple de Prompt Système (Analyzer)
```text
You are a Music Theory Expert.
Goal: Extract musical keys, scales, and BPM from the user prompt.
Context: Global Project Key is {global_root} {global_scale}.
Instruction: 
- If the user specifies a key, use it.
- If the user specifies a style ensuring a specific scale (e.g. 'Japanese' -> 'Hirajoshi'), OVERRIDE the global key.
- Otherwise, keep the global key.
Output: JSON w/ root, scale, bpm.
```
