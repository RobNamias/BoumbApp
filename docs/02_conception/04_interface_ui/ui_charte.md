# Charte Graphique & Design System

Ce document définit l'identité visuelle de Boumb'App. L'interface repose sur un système de variables CSS pour faciliter le changement de thème.

## 1. Typographie
Police principale : **Inter** (Google Fonts).
*   Moderne, lisible, adaptée aux interfaces techniques (DAW).
*   **Weights** : 400 (Regular), 500 (Medium), 700 (Bold).

### Échelle Typographique (Type Scale)
Basée sur une taille de base de `16px` (1rem).

| Niveau | Balise | Taille (rem) | Taille (px) | Graisse | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Display** | `h1` (Hero) | `3.0rem` | 48px | Bold (700) | 1.1 | Titre Landing Page |
| **Heading 1** | `h1` | `2.25rem` | 36px | Bold (700) | 1.2 | Titre de Page |
| **Heading 2** | `h2` | `1.875rem` | 30px | Bold (700) | 1.3 | Titre de Section |
| **Heading 3** | `h3` | `1.5rem` | 24px | Medium (500) | 1.4 | Sous-titre Carte |
| **Heading 4** | `h4` | `1.25rem` | 20px | Medium (500) | 1.4 | Titre de Piste |
| **Body Large** | `p.lead` | `1.125rem` | 18px | Regular (400) | 1.6 | Intro, Chapeau |
| **Body Base** | `p`, `div` | `1.0rem` | 16px | Regular (400) | 1.5 | Texte standard |
| **Body Small** | `small` | `0.875rem` | 14px | Regular (400) | 1.4 | Labels, Inputs |
| **Caption** | `span` | `0.75rem` | 12px | Regular (400) | 1.2 | Métadonnées, Hints |

## 2. Thèmes & Couleurs
L'application gère nativement le multi-thème via des attributs `data-theme` sur la balise `<html>`.

### Thème 1 : Cyberpunk (Défaut)
Ambiance futuriste, sombre et néon. Idéal pour la création nocturne.
*   **Background** : `#121212` (Noir profond)
*   **Surface** : `#1E1E1E` (Gris anthracite)
*   **Primary** : `#8B5CF6` (Violet Néon)
*   **Secondary** : `#D946EF` (Magenta Néon)
*   **Text** : `#F3F4F6` (Blanc cassé)

### Thème 2 : Red Core
Ambiance industrielle, agressive et contrastée.
*   **Background** : `#050505` (Presque Noir)
*   **Surface** : `#171717` (Gris Charbon)
*   **Primary** : `#EF4444` (Rouge Vif)
*   **Secondary** : `#F87171` (Rouge Clair)
*   **Text** : `#E5E5E5` (Gris Clair)

### Thème 3 : Day Mode (Light)
Thème clair, propre et lisible pour les environnements lumineux.
*   **Background** : `#F9FAFB` (Gris très clair)
*   **Surface** : `#FFFFFF` (Blanc pur)
*   **Primary** : `#6366F1` (Indigo)
*   **Secondary** : `#A855F7` (Violet)
*   **Text** : `#111827` (Gris très sombre)

## 3. Variables CSS (Token System)
Exemple d'implémentation dans `index.css`.

```css
:root {
  /* Spacing (Base 4px) */
  --spacing-1: 0.25rem; /* 4px */
  --spacing-2: 0.5rem;  /* 8px */
  --spacing-4: 1rem;    /* 16px */
  
  /* Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-full: 9999px;
}

[data-theme="cyberpunk"] {
  --bg-app: #121212;
  --bg-panel: #1E1E1E;
  --color-primary: #8B5CF6;
  --color-text: #F3F4F6;
}

[data-theme="red-core"] {
  --bg-app: #050505;
  --bg-panel: #171717;
  --color-primary: #EF4444;
  --color-text: #E5E5E5;
}
```

## 4. Iconographie
Utilisation de **Lucide React** (ou Heroicons).
*   Style : Outline (Traits fins).
*   Taille standard : 20px ou 24px.

## 5. Identité Visuelle & Logo
Le logo de Boumb'App est conçu pour s'intégrer dans l'esthétique Cyberpunk.
*   **Symbole** : Un "B" stylisé intégrant une onde sonore, évoquant la musique et la technologie.
*   **Couleurs** : Utilise les couleurs néon du thème par défaut :
    *   **Violet Néon** (`#8B5CF6`)
    *   **Magenta Néon** (`#D946EF`)
*   **Fond** : Noir profond (`#121212`) pour assurer le contraste et l'effet "glowing".
*   **Favicon** : Version simplifiée et contrastée lisible en 16x16px (Onglet navigateur).
