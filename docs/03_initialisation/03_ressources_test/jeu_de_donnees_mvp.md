# Plan du Jeu de Données (Fixtures) - MVP

Ce document décrit le jeu de données "Standard" qui sera injecté dans la base de données via les Fixtures.
L'objectif est d'avoir un environnement cohérent pour le développement, les tests manuels et les démos.

## 1. Utilisateurs (`User`)

Nous créons deux utilisateurs types pour tester les permissions.

| Username | Email | Rôle | Mot de passe (Hashé) |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@boumbapp.com` | `['ROLE_ADMIN']` | `password123` |
| **Jean Michel** | `user@boumbapp.com` | `['ROLE_USER']` | `password123` |

## 2. Bibliothèque de Samples (`Sample`)

Ces samples sont des "Samples Usine" (pas d'owner) accessibles à tous.
*Note : Les fichiers physiques ne sont pas requis pour la BDD, mais les chemins doivent être cohérents.*

| Nom | Catégorie | Chemin (Virtuel) | Durée |
| :--- | :--- | :--- | :--- |
| **Kick 808** | `Drums` | `/library/samples/drums/kick_808.wav` | 0.5s |
| **Snare 909** | `Drums` | `/library/samples/drums/snare_909.wav` | 0.3s |
| **HiHat Closed** | `Drums` | `/library/samples/drums/hh_closed.wav` | 0.1s |
| **Amen Break** | `Loop` | `/library/samples/loops/amen_break.wav` | 4.0s |

## 3. Presets de Synthétiseur (`SynthPreset`)

Ces presets sont des "Presets Usine" (pas d'owner).

| Nom | Type Synthé | Paramètres (JSON Simplifié) |
| :--- | :--- | :--- |
| **Retro Bass** | `BASS` | `{"osc": "sawtooth", "filter": {"cutoff": 400}}` |
| **Dreamy Pad** | `PAD` | `{"osc": "sine", "attack": 2.0, "release": 3.0}` |

## 4. Projets de Démonstration (`Project` & `ProjectVersion`)

Un projet "Vitrine" appartenant à l'utilisateur standard, pour tester le chargement du séquenceur.

### Projet : "Demo Track 2025"
*   **Owner** : `user@boumbapp.com`
*   **Public** : `true`

### Version : v1.0 (Initiale)
*   **BPM** : 124
*   **Pistes** :
    1.  **Kick** (Sampler) : Pattern 4/4 basique.
    2.  **Bass** (Synth - Retro Bass) : Ligne de basse simple.
*   **Data Structure (JSON)** :

```json
{
  "global": {
    "bpm": 124,
    "swing": 0.0,
    "scale": "C Minor"
  },
  "tracks": [
    {
      "id": "track-1",
      "type": "sampler",
      "name": "Kick",
      "sampleId": 1, 
      "patterns": [
        { "id": "pat-1", "steps": [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] }
      ]
    },
    {
      "id": "track-2",
      "type": "synth",
      "name": "Bass",
      "presetId": 1,
      "effects": [
        { "id": "fx-1", "type": "delay", "wet": 0.5, "time": 0.3 }
      ],
      "patterns": [
        { "id": "pat-2", "steps": [1, 0, 0, 1, 0, 0, 1, 0] }
      ]
    }
  ]
}
```
