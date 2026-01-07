# Contexte Général

## Vision du Projet - Labo LLM Local

Ce projet est un laboratoire destiné à monter un environnement pour gérer un modèle d'Intelligence Artificielle (IA) gratuit en local, piloté via une API Python maison (fichier de base existant).

## Inspiration & Composant Source
Le point de départ est un composant existant d'un projet plus vaste :
- **Composant** : Synthétiseur Tone.js avec Piano Roll.
- **Fonctionnement Actuel** :
    - Input text pour saisir un prompt.
    - Appel API GoogleIA.
    - Réponse JSON (tableau de notes).
    - Inscription des notes sur le Piano Roll et lecture via Tone.js.

## Objectif du Labo
Adapter ce fonctionnement pour utiliser une **IA Locale** au lieu de l'API GoogleIA.
- **Cible** : Modèle gratuit hébergé localement.
- **Interface** : API Python maison pour faire l'interface entre le front (Piano Roll) et le modèle local.

## Évolutions Futures
- Mise en place d'un système **RAG** (Retrieval-Augmented Generation), probablement dans un laboratoire ultérieur.
