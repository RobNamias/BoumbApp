# Spécification Fonctionnelle : Mode Song & Architecture Pattern

**Document de Conception Avancée**
Ce document redéfinit le cœur du séquenceur de BoumbApp pour intégrer la notion de "Composition" (Song Mode).

## 1. Changement de Paradigme : Architecture Dissociée (Option B)

Nous adoptons une structure **Modulaire** où chaque "Instrument" possède sa propre timeline.

### 1.1 Les Modules
*   **JuicyBox (Rythmique)** : Possède sa propre banque de Patterns (R1, R2, R3...).
    *   *Couleur dominante* : **Bleu Electrique**.
    *   *Contenu* : 8 pistes de batterie.
*   **SynthLab (Mélodique)** : Possède sa propre banque de Patterns (M1, M2, M3...).
    *   *Couleur dominante* : **Vert Néon**.
    *   *Contenu* : Les séquences des 3 synthétiseurs (pour l'instant groupées pour simplifier).

### 1.2 UX : Sélecteurs Locaux
Au lieu d'une pagination globale, chaque module affiche ses propres boutons de sélection :
*   **Dans la JuicyBox** : Une barre "Patterns Drums" [1] [2] [3] [4] (Bleu).
*   **Dans le SynthLab** : Une barre "Patterns Melody" [1] [2] [3] [4] (Vert).

### 1.3 Avantage Créatif
Cette séparation permet de **combiner** librement :
*   *Mesure 1* : Drum Pattern 1 (Simple) + Synth Pattern 1 (Intro).
*   *Mesure 2* : Drum Pattern 2 (Complesso) + Synth Pattern 1 (Intro) -> Variation rythmique seule.

## 2. Le Mode Song (L'Arrangement)
L'utilisateur veut une "Playlist style Fruity Loops" pour construire un morceau complet.

### Concept : La Timeline
Une frise simplifiée qui permet d'ordonner les patterns.

#### UI Proposée (Bas de l'écran ou Modal ?)
Une simple piste horizontale sous la JuicyBox ou un écran dédié "Arrangement".
```text
[ Timeline ------------------------------------------------ ]
|  [P1: Intro]  |  [P2: Verse]  |  [P2: Verse]  | [P3: Ref] |
|  0:0:0        |  2:0:0        |  4:0:0        | 6:0:0     |
-------------------------------------------------------------
```

#### Fonctionnalités
1.  **Paint Mode** : Je sélectionne Pattern 1, je "peins" des blocs dans la timeline.
2.  **Playhead** : Une tête de lecture globale qui avance.
3.  **Switch Mode** :
    *   **Mode Pattern (Loop)** : On boucle sur le pattern actif (Boutons 1-4).
    *   **Mode Song (Seq)** : On suit la timeline. Le pattern actif change tout seul.

## 3. Impact Technique (Backend & Store)

### 3.1 Structure de Données
*   `Pattern` : Fixe à 32 steps.
*   `Project` : Contient `patterns: [P1, P2, P3, P4]` (Limitons à 4 ou 8 pour le MVP).
*   `Playlist` : Liste d'objets `{ patternId: 1, repeat: 2 }` ou `{ patternId: 1, startTime: 0 }`.

### 3.2 Audio Engine
*   Le moteur doit gérer une "Queue" de lecture.
*   `transport.scheduleRepeat` doit regarder "Quelle est la mesure actuelle ?" -> "Quel pattern je dois jouer ?".

## 4. Points de Vigilance (Risques)
*   **Clics Audio** : Le changement de pattern doit être instantané et sans coupure (Swap de buffers).
*   **État des Synthés** : Si le Pattern 1 a un son de basse "Acid" et le Pattern 2 un son "Sub", comment gérer la transition ?
    *   *Solution MVP* : Les sons (Kits/Synthés) sont **Gloeaux au Projet**. Seules les **Notes** changent par pattern.
    *   C'est impératif pour la fluidité audio.

## 5. Roadmap d'Implémentation
1.  **Refactor Store** : Diviser `TracksStore` en `ProjectStore` (Global Audio) + `PatternStore` (Notes).
2.  **UI Pattern Selector** : Recoder la barre de pagination pour en faire un sélecteur de banque.
3.  **Engine Update** : Implémenter la logique "Next Pattern Queue".
4.  **UI Timeline** : Créer le composant visuel d'arrangement.
