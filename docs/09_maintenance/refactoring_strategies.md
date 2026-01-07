# Stratégies de Refactoring & Dette Technique

Ce document recense les améliorations techniques identifiées lors du développement mais reportées pour préserver la vélocité du MVP.

## 1. Moteur Audio & Samples
### 1.1 "Smart Mapping" des Samples
**Problème Actuel :**
Le mappage entre les pistes du Store (ex: "Kick", "Snare") et les fichiers audio (ex: `tribe_Kick.ogg`) est codé en dur dans `JuicyBox.tsx`.
C'est fragile et ne permet pas d'ajouter facilement de nouveaux Kits ou d'import utilisateur.

**Solution Proposée (Smart Mapping) :**
1.  **Catégorisation :** Créer un type strict pour les catégories d'instruments.
    ```typescript
    type InstrumentCategory = 'KICK' | 'SNARE' | 'CLAP' | 'HIHAT_CLOSED' | 'HIHAT_OPEN' | 'PERC' | 'FX';
    ```
2.  **Convention de Nommage :** Standardiser les noms de fichiers (ex: `[Kit]_[Category]_[Vartiation].ogg`).
3.  **Auto-Mapping :** 
    Au chargement d'un Kit, l'AudioEngine scanne le dossier et assigne automatiquement les fichiers aux pistes selon leur catégorie, sans intervention manuelle.
    *Exemple : Si une piste s'appelle "Kick 1", elle cherche n'importe quel fichier taggé 'KICK' dans le kit actif.*

### 1.2 Chargement via Thunks
Déplacer la logique de chargement (actuellement dans `useEffect` de `JuicyBox`) vers des actions asynchrones (Thunks) dans le Store ou un Hook dédié (`useAudioLoader`) pour découpler la Vue de la Logique Audio.

## 2. CSS & Design System
*   Centraliser les valeurs "en dur" (couleurs, espacements) des fichiers SCSS modules vers `_variables.scss` ou des Custom Properties CSS.
