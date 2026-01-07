# Playground & Validation UI

Ce document décrit l'environnement de test pour les composants React (Frontend) et assure le suivi de leur validation visuelle et fonctionnelle.

## 1. Environnement de Test

Pour "déboguer" et "styler" les composants de manière isolée sans avoir à naviguer dans toute l'application, une **page dédiée** a été mise en place.

*   **URL** : `/design-system`
*   **Fichier Source** : `client/src/pages/DesignSystemPage.tsx`
*   **Fonctionnalités** :
    *   Test du Thème (Switch Light/Dark via Zustand).
    *   Affichage en grille des composants (Atoms, Molecules).
    *   Isolation CSS (vérification des variabless).

> **Usage** : À chaque création de composant (ex: `Button.tsx`), il faut l'importer dans `DesignSystemPage.tsx` pour vérifier son rendu.

## 2. Inventaire & Statut de Validation

| Type | Composant | Fichier | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Atom** | `Button` | `client/src/components/atoms/Button.tsx` | � VALIDÉ | Primary, Secondary, Ghost. |
| **Atom** | `Knob` | `client/src/components/atoms/Knob.tsx` | � VALIDÉ | SVG Rotatif + Accesibilité. |
| **Atom** | `Fader` | `client/src/components/atoms/Fader.tsx` | � VALIDÉ | Vertical Slider. |
| **Atom** | `Led` | `client/src/components/atoms/Led.tsx` | � VALIDÉ | ON/OFF State. |
| **Atom** | `DragInput` | `client/src/components/atoms/DragInput.tsx` | 🟢 VALIDÉ | Numeric Drag. |
| **Molecule** | `TransportControls` | `client/src/components/molecules/TransportControls.tsx` | � VALIDÉ | Play/Stop logic. |

*Légende : 🔴 TODO, 🟠 WIP, 🟢 VALIDÉ*
