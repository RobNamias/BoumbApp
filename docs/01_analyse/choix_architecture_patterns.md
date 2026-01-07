# Analyse : architecture des Patterns & Mode Song

Ce document vise à trancher la question structurelle : **"Qu'est-ce qu'un Pattern dans BoumbApp ?"**

## Option A : Le "Pattern Global" (Style Groovebox)
*C'est l'approche Novation Circuit / MPC simple.*
*   **Concept** : Un Pattern "A" contient **TOUT** (La batterie + La basse + Le lead).
*   **Workflow** :
    *   Je sélectionne "Pattern 1". Je compose ma batterie ET ma basse.
    *   Je sélectionne "Pattern 2". C'est une page blanche (ou une copie). Je change la basse.
    *   **Timeline** : Mesure 1 = Pattern 1. Mesure 2 = Pattern 2.
*   **Avantages** :
    *   **Simple à comprendre** : 1 bouton = 1 état complet du morceau.
    *   **Pas de conflits** : On ne risque pas de jouer deux basses en même temps.
    *   **UI** : Une seule barre de boutons [1] [2] [3] [4].
*   **Inconvénients** :
    *   **Répétitif** : Si je veux la *même* batterie avec une basse différente, je dois *copier-coller* le pattern.

## Option B : Patterns Dissociés (Style DJ / Roland TR)
*C'est l'approche que vous suggérez (Rythmique vs Mélodique).*
*   **Concept** : On a des "Patterns de Batterie" (R1, R2) et des "Patterns de Synthé" (M1, M2).
*   **Workflow** :
    *   Je choisis Batterie = R1.
    *   Je choisis Synthé = M2.
    *   **Timeline** : Mesure 1 = { Drum: R1, Synth: M1 }. Mesure 2 = { Drum: R1, Synth: M2 }.
*   **Avantages** :
    *   **Combinatoire élevée** : On crée beaucoup de variations avec peu de blocs.
*   **Inconvénients** :
    *   **Complexité UI** : Il faut DEUX sélecteurs de patterns (un pour Drums, un pour Synth).
    *   **Complexité Mentale** : "Attends, le Pattern A du séquenceur est lié à quel Pattern de batterie déjà ?".

## Option C : Architecture "Clips" (Style Ableton / DAW)
*   **Concept** : Il n'y a plus de "Patterns" globaux. Chaque piste (Kick, Snare, Bass) a ses propres clips indépendants.
*   **Verdict** : **Trop complexe** pour notre MVP. Usine à gaz UI garantie.

---

## Analyse du "Mode Live"
Vous avez raison : si on a une Timeline (Song Mode), le "Live Triggering" (lancer des patterns à la volée) devient une fonctionnalité secondaire, voire inutile pour un débutant qui veut juste composer.

**Proposition de simplification :**
1.  **Usage des boutons [1]-[4]** : Uniquement pour l'**ÉDITION**.
    *   "Je veux modifier le contenu du Pattern 2".
2.  **Lecture** :
    *   Soit on joue le Pattern actif en boucle (Mode Loop).
    *   Soit on joue la Timeline entière (Mode Song).
3.  **Pas de "Queue" complexe** : On enlève la logique Ableton de "lancement au prochain temps fort". C'est plus simple à coder et à utiliser.

## Recommandation de l'Architecte
Pour garder l'esprit "Simple & Fun" de BoumbApp :
👉 **Je recommande l'Option A (Pattern Global)**.
*   C'est le plus intuitif pour construire un morceau : Intro, Couplet, Refrain.
*   Le "Copier-Coller" de pattern est facile à coder (bouton "Duplicate").
*   Ça évite de multiplier les boutons sur l'interface.

Qu'en pensez-vous ? Option A (Global) ou Option B (Dissocié) ?
