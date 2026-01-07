# Spécifications POC V2 : Affinement Synthé & Piano Roll

**Objectif** : Monter en gamme sur le POC pour passer d'un simple "Player de notes" à un véritable mini-synthétiseur éditable.

## 1. Moteur Audio (Tone.js)

### 1.1 Synthétiseur Polyphonique
Remplacer le synthé basique par un `Tone.PolySynth` utilisant `Tone.FMSynth` ou `Tone.AMSynth` pour des sonorités plus riches.

**Paramètres à exposer (Knobs/Sliders) :**
*   **Oscillator Type** : `sine`, `square`, `sawtooth`, `triangle`.
*   **Envelope (ADSR)** :
    *   `attack` (0 à 2s)
    *   `decay` (0 à 2s)
    *   `sustain` (0 à 1)
    *   `release` (0 à 5s)
*   **Filter (Tone.Filter)** :
    *   `frequency` (Cutoff) : 20Hz à 20kHz.
    *   `Q` (Resonance) : 0 à 10.
*   **Effects Chain** :
    *   Ajouter une `Tone.Reverb` (Decay, Wet).
    *   Ajouter un `Tone.FeedbackDelay` (Time, Feedback, Wet).

### 1.2 Gestion du Temps (Transport)
*   BPM global réglable (ex: 60 - 180).
*   Boucle (Loop) sur 1 mesure (4 temps) ou 2 mesures.

---

## 2. Interface Piano Roll (Grille)

### 2.1 Structure de la Grille
*   **Axe X (Temps)** : 16 pas (double-croches) pour 1 mesure.
    *   Subdivision : 1 temps = 4 pas.
*   **Axe Y (Hauteur)** : 1 Octave complète (C3 à B3) ou 2 Octaves.
    *   Représentation visuelle type "Clavier de piano" à gauche.

### 2.2 Interaction Utilisateur
*   **Affichage** : Les notes générées par l'IA doivent s'afficher comme des blocs sur la grille.
*   **Édition** :
    *   **Click** : Créer/Supprimer une note.
    *   **Drag** : Déplacer une note (Temps/Hauteur).
    *   **Resize** (Bord droit) : Changer la durée (`duration`).

### 2.3 Format de Données (Interne)
Le state React doit maintenir la séquence sous ce format pour faciliter le rendu :

```javascript
[
  { 
    id: "uuid",
    note: "C3", 
    time: "0:0:0", // Tone.js Transport Time
    duration: "8n", // ou "0:0:2"
    velocity: 0.8 
  },
  // ...
]
```

---

## 3. Affinement IA (Prompt Engineering)

### 3.1 Structure JSON Améliorée
Pour supporter la V2, le JSON renvoyé par l'IA doit être plus robuste.

**Contraintes à ajouter au System Prompt :**
1.  **Durée stricte** : Utiliser uniquement les notations Tone.js standards (`1n`, `2n`, `4n`, `8n`, `16n`).
2.  **Quantification** : Les temps (`time`) doivent être calés sur la grille de 16 pas (ex: `0:0:0`, `0:0:1`, `0:0:2`...). Pas de temps flottants bizarres.
3.  **Polyphonie** : Autoriser plusieurs notes au même `time` (Accords).

### 3.2 Exemple de Prompt V2
> "Génère une progression d'accords Jazz en Do mineur. Utilise des accords de 3 ou 4 notes (7ème). Rythme lent (Blanches et Rondes)."

---

## 4. Tests à Implémenter (Code)

### 4.1 Validateur JSON (Zod)
Intégrer `zod` dans le POC pour valider le JSON reçu de l'IA avant de le jouer.

```javascript
const NoteSchema = z.object({
  note: z.string().regex(/^[A-G][#b]?[0-8]$/), // Ex: C4, Db3
  duration: z.enum(["1n", "2n", "4n", "8n", "16n"]),
  time: z.string(),
  velocity: z.number().min(0).max(1)
});

const ResponseSchema = z.object({
  variations: z.array(z.object({
    description: z.string(),
    sequence: z.array(NoteSchema)
  }))
});
```

### 4.2 Test de Latence
Ajouter un `console.time('api_call')` et `console.timeEnd('api_call')` autour du fetch pour mesurer précisément la performance.
