# API & Flux de Données

## Protocole de Communication
Le **Client Python** communique avec **Ollama** via HTTP REST.

- **URL interne** : `http://ollama:11434/api/generate`
- **Méthode** : `POST`

### Payload de Requête
Le client envoie un JSON structuré pour forcer le mode JSON d'Ollama.

```json
{
  "model": "mistral",
  "format": "json",
  "stream": false,
  "prompt": "CONSIGNE_SYSTEME + PROMPT_UTILISATEUR"
}
```

**Consigne Système Critique** :
Le prompt envoyé contient toujours une instruction système explicite pour garantir le format de sortie :
> *"Générer une mélodie au format JSON strict... Structure attendue : Tableau d'objets notes..."*

## Format de Données (Sortie)
L'application attend (et valide) impérativement une structure JSON contenant une liste de notes.

### Schéma JSON
```json
{
  "notes": [
    {
      "note": "string",   // Note + Octave (ex: "C4", "F#5")
      "start": "integer", // Temps de départ (en pas de séquenceur 16-step ou ticks)
      "duration": "integer" // Durée en pas
    }
  ]
}
```

### Exemple de Réponse Valide
```json
{
  "notes": [
    { "note": "C4", "start": 0, "duration": 2 },
    { "note": "E4", "start": 2, "duration": 2 }
  ]
}
```

## Gestion des Erreurs
- **404 Not Found** : Le modèle demandé n'est pas téléchargé dans Ollama (`docker exec ... ollama pull ...` requis).
- **JSONDecodeError** : Le LLM a "halluciné" du texte hors JSON (Rareté avec le mode `format="json"`, mais possible).
