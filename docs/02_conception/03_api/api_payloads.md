# Exemples de Payloads (JSON)

Ce document détaille la structure des objets JSON complexes échangés via l'API.

## 1. Structure du Projet (DAW State)
C'est l'objet JSON stocké dans `app_project_version.data`. Il contient l'état complet du morceau.

| Paramètre | Type | Requis | Description |
|---|---|---|---|
| `bpm` | `integer` | Oui | Tempo du projet (ex: 120). |
| `duration` | `integer` | Non | Durée souhaitée en steps (32 ou 64). Défaut: 32. |
| `global_key` | `object` | Oui | Tonalité globale du projet. |

```json
{
  "global": {
    "bpm": 120,
    "swing": 0.0,
    "scale": "C Minor",
    "title": "My Song"
  },
  
  // 1. INSTRUMENTS (Global Mixer)
  "drumTracks": {
    "track-kick-id": {
        "id": "track-kick-id",
        "name": "Kick 909",
        "type": "sampler",
        "instrument": { "sampleId": "kick_909.wav" },
        "mixer": { "volume": 0.8, "mute": false, "solo": false, "pan": 0 }
    },
    "track-snare-id": { ... }
  },
  
  // 2. PARTITIONS (Musical Data)
  "drumPatterns": {
    "pattern-A-id": {
      "id": "pattern-A-id",
      "name": "Intro Pattern",
      "duration": 32,
      // Mapping Track ID -> Liste de Notes
      "clips": {
        "track-kick-id": [
            { "time": "0:0:0", "note": "C4", "velocity": 0.9, "fill": 1.0 },
            { "time": "0:1:0", "note": "C4", "velocity": 0.5, "fill": 0.2 }
        ],
        "track-snare-id": [ ... ]
      }
    }
  },

  // 3. ARRANGEMENT (Timeline)
  "timeline": {
     "clips": [
        { "id": "clip-1", "patternId": "pattern-A-id", "start": 0, "duration": 32 }
     ]
  }
}
```

## 2. Authentification (Login)

**Requête (`POST /api/login`)**
```json
{
  "email": "user@example.com",
  "password": "securePassword123"
}
```

**Réponse (200 OK)**
```json
{
  "token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

## 3. Gestion des Projets

### Création de Projet (`POST /api/projects`)
```json
{
  "name": "Mon Morceau",
  "isPublic": false
}
```

### Sauvegarde (`POST /api/project_versions`)
```json
{
  "project": "/api/projects/1",
  "versionNumber": 1,
  "data": { ... (Voir Structure du Projet plus haut) }
}
```

## 4. Réponses de Collections (Hydra)
L'API utilise le format **JSON-LD / Hydra**.
Header requis : `Accept: application/ld+json`.

```json
{
  "@context": "/api/contexts/Project",
  "@id": "/api/projects",
  "hydra:totalItems": 2,
  "hydra:member": [
    {
      "@id": "/api/projects/2",
      "name": "Mon Projet",
      "createdAt": "2025-12-29T20:43:00+00:00"
    }
  ]
}
```
*Note : La clé `member` peut remplacer `hydra:member` selon la configuration.*

## 5. Erreur de Validation (RFC 7807)
Exemple de réponse en cas de données invalides (422 Unprocessable Entity).

```json
{
  "@context": "/api/contexts/ConstraintViolationList",
  "@type": "ConstraintViolationList",
  "hydra:title": "An error occurred",
  "hydra:description": "email: This value is not a valid email address.",
  "violations": [
    {
      "propertyPath": "email",
      "message": "This value is not a valid email address."
    }
  ]
}
```
