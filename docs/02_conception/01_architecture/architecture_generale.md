# Architecture Générale & Synthèse Analyse

Ce document sert de point de référence pour la phase de conception. Il résume les grandes lignes décidées lors de la phase d'analyse.

## 1. Objectif du MVP
**Boumb'App** est un DAW (Digital Audio Workstation) web simplifié, orienté performance live.
*   **Cible :** Débutants et musiciens nomades.
*   **Plateformes :** Desktop (Priorité), Tablette, Mobile (Mode paysage).

## 2. Stack Technique
*   **Frontend :** React 18 (Vite), TypeScript, TailwindCSS, Radix UI.
*   **Audio Engine :** Tone.js (Wrapper WebAudio API).
*   **Backend :** Symfony 7 (API Platform), PHP 8.3.
*   **Service IA :** Python (FastAPI) + Ollama (Inférence Locale).
*   **Base de Données :** PostgreSQL (JSONB pour les données flexibles).
*   **Authentification :** JWT (HttpOnly Cookies).

## 3. Composants Clés
1.  **Séquenceur Rythmique (JuicyBox) :** Gestion des Patterns de Batterie (Pistes Dynamiques).
2.  **Séquenceur Mélodique (SynthLab) :** Gestion des Patterns Mélodiques (3 synthés).
3.  **Mode Song (Timeline) :** Arrangement linéaire avec pistes dissociées (Drums / Melody).
4.  **Mixer :** Table de mixage avec routage (Piste -> Groupe -> Master) et effets.
5.  **Projet :** Sauvegarde structurée (`drumPatterns`, `melodicPatterns`, `timeline`).

## 4. Flux de Données (High Level)
*   **Lecture :** Le Frontend charge le JSON du projet depuis l'API Symfony.
*   **Generation IA (Sécurisée) :** React -> Symfony (Auth Gateway) -> [Réseau Interne] -> API Python -> Ollama.
*   **Audio :** Tone.js génère le son en local (Client-side) à partir de ce JSON.
*   **Sauvegarde :** Le Frontend renvoie le JSON modifié à l'API pour persistance.

## 5. Conventions
*   **Langue Code :** Anglais (`user`, `track`, `pattern`).
*   **Langue Interface :** Français (i18n ready).
*   **Design :** Dark Mode par défaut, UI réactive et "Premium".
