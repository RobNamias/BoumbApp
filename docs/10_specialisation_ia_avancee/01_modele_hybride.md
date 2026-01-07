# Spécialisation IA : Le Modèle Hybride ("Code + LLM")

**Statut** : Recommandé (P1)
**Complexité** : Faible sur l'Infra / Moyenne sur le Code
**Gain** : Fiabilité Maximale

## 1. Le Principe
L'IA générative (LLM) est excellente pour la créativité floue ("Fais quelque chose de triste") mais médiocre pour la rigueur mathématique ("Utilise uniquement les fréquences de la gamme de Do mineur harmonique").

Le modèle hybride consiste à **séparer les responsabilités** :
*   **Python (Algorithme)** : Gère la **Théorie Musicale**. Il est le "Législateur". Il calcule les règles inviolables.
*   **LLM (IA)** : Gère la **Composition**. Il est l'"Artiste". Il choisit les notes parmi celles autorisées par le Législateur.

## 2. Architecture Technique

### Flux de Données
1.  **User Input** : "Fais une basse Funky en Sol Mineur".
2.  **Moteur Théorique (Python)** :
    *   Analyse "Sol Mineur" -> Calcule les notes : `G, A, Bb, C, D, Eb, F`.
    *   Analyse "Basse" -> Définit le registre : `E1` à `C3`.
    *   Génère un objet de contrainte (`ConstraintObject`).
3.  **Prompt Engineering** : Injection des contraintes dans le prompt système.
    *   *"Tu dois utiliser UNIQUEMENT les notes suivantes : [G, A, Bb...]. Toute autre note est interdite."*
4.  **Génération IA** : Le LLM génère la séquence JSON.
5.  **Validateur (Python)** : Vérifie a posteriori que toutes les notes sont bien dans la liste autorisée. Si non -> Correction automatique (Snap to Scale).

### Stack Technologique
*   **Bibliothèques Python** :
    *   `music21` ou `scamp` : Pour la manipulation théorique lourde (accords, renversements).
    *   *Ou* Code Custom léger : Pour des besoins simples (Gammes majeures/mineures).

## 3. Analyse Avantages / Inconvénients

| Avantages | Inconvénients |
| :--- | :--- |
| **Zéro Fausse Note** : La justesse est garantie mathématiquement. | **Rigidité** : Empêche les "accidents" heureux (chromatismes jazz) si non programmés. |
| **Performance** : L'IA "hésite" moins car le choix est restreint. | **Maintenance** : Il faut coder la théorie musicale en Python. |
| **Contrôle** : Permet d'implémenter des fonctionnalités strictes (ex: "Mode Dorien"). | |

## 4. Plan d'Action (Roadmap)
1.  Créer un module `theory_engine.py` dans `ai_service`.
2.  Implémenter une fonction `get_scale_notes(root, scale_type)`.
3.  Modifier `main.py` pour injecter ces notes dans le prompt système (`system_instruction`).
4.  Ajouter une étape de "Quantization de Hauteur" (Pitch Correction) à la sortie.
