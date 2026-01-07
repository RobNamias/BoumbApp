# Protocole POC : IA Générative (Prompt-to-MIDI)

**Objectif** : Monter un environnement "bac à sable" pour tester la génération de mélodies par IA et leur lecture via Tone.js.

## 1. Pré-requis
*   Docker & Docker Compose installés.
*   Une clé API (Hugging Face Token ou Google Gemini API Key).

## 2. Architecture du POC
Nous allons créer un dossier `boumbapp-poc-ia` (hors du projet principal) avec cette structure :

```text
boumbapp-poc-ia/
├── docker-compose.yml
├── server/ (Backend Node.js)
│   ├── package.json
│   └── server.js (Proxy API)
└── client/ (Frontend React)
    ├── package.json
    ├── vite.config.js
    └── src/
        ├── App.jsx (Synthé + Piano Roll)
        └── main.jsx
```

## 3. Fichiers de Configuration

### 3.1 `docker-compose.yml`
Orchestre le client (Vite) et le serveur (Node).

```yaml
services:
  server:
    build: ./server
    ports: ["3000:3000"]
    environment:
      - API_KEY=votre_cle_api_ici # Remplacer par votre clé
      - API_PROVIDER=gemini # ou 'huggingface'
    volumes:
      - ./server:/app
      - /app/node_modules

  client:
    build: ./client
    ports: ["5173:5173"]
    volumes:
      - ./client:/app
      - /app/node_modules
    environment:
      - VITE_API_URL=http://localhost:3000
```

---

### 3.2 Backend (`server/`)

**`server/package.json`**
```json
{
  "name": "server",
  "version": "1.0.0",
  "main": "server.js",
  "scripts": { "start": "node server.js" },
  "dependencies": { "express": "^4.18.2", "cors": "^2.8.5", "body-parser": "^1.20.2", "node-fetch": "^3.3.2" }
}
```

**`server/server.js`** (Le Proxy IA)
```javascript
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const SYSTEM_PROMPT = `Tu es un compositeur expert.
Ton but est de traduire des descriptions textuelles en séquences musicales JSON.
Format de réponse attendu (JSON pur uniquement) :
{
  "variations": [
    {
      "description": "string",
      "sequence": [
        { "note": "C4", "duration": "8n", "time": "0:0:0", "velocity": 0.8 }
      ]
    }
  ]
}
Contexte : Tempo 120 BPM.`;

app.post('/generate', async (req, res) => {
  const { prompt } = req.body;
  console.log("Reçu prompt:", prompt);

  // Simulation d'appel (Remplacer par l'appel réel Gemini/HF)
  // Ici on mock pour tester la connexion Front <-> Back
  const mockResponse = {
    variations: [
      {
        description: "Mock: Basse simple",
        sequence: [
          { note: "C2", duration: "8n", time: "0:0:0", velocity: 0.9 },
          { note: "G2", duration: "8n", time: "0:0:2", velocity: 0.8 },
          { note: "C3", duration: "8n", time: "0:1:0", velocity: 0.9 },
          { note: "G2", duration: "8n", time: "0:1:2", velocity: 0.8 }
        ]
      }
    ]
  };
  
  // TODO: Implémenter l'appel réel vers Gemini API ici
  
  res.json(mockResponse);
});

app.listen(3000, () => console.log('Server running on port 3000'));
```

---

### 3.3 Frontend (`client/`)

**`client/package.json`**
```json
{
  "name": "client",
  "private": true,
  "version": "0.0.0",
  "scripts": { "dev": "vite", "build": "vite build", "preview": "vite preview" },
  "dependencies": { "react": "^18.2.0", "react-dom": "^18.2.0", "tone": "^14.7.77" },
  "devDependencies": { "@vitejs/plugin-react": "^4.0.0", "vite": "^4.3.9" }
}
```

**`client/App.jsx`** (L'interface Synthé + Piano Roll)
```jsx
import React, { useState, useEffect, useRef } from 'react';
import * as Tone from 'tone';

function App() {
  const [prompt, setPrompt] = useState('');
  const [sequence, setSequence] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Synth Params
  const [attack, setAttack] = useState(0.1);
  const [decay, setDecay] = useState(0.2);
  const [sustain, setSustain] = useState(0.5);
  const [release, setRelease] = useState(1);

  const synthRef = useRef(null);
  const partRef = useRef(null);

  useEffect(() => {
    // Init Synth
    synthRef.current = new Tone.PolySynth(Tone.Synth).toDestination();
    return () => {
      if (partRef.current) partRef.current.dispose();
    };
  }, []);

  useEffect(() => {
    // Update ADSR
    if (synthRef.current) {
      synthRef.current.set({
        envelope: { attack, decay, sustain, release }
      });
    }
  }, [attack, decay, sustain, release]);

  const handleGenerate = async () => {
    const res = await fetch('http://localhost:3000/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    const data = await res.json();
    if (data.variations && data.variations.length > 0) {
      setSequence(data.variations[0].sequence);
      setupPart(data.variations[0].sequence);
    }
  };

  const setupPart = (notes) => {
    if (partRef.current) partRef.current.dispose();
    
    // Tone.Part pour jouer la séquence
    partRef.current = new Tone.Part((time, note) => {
      synthRef.current.triggerAttackRelease(note.note, note.duration, time, note.velocity);
    }, notes).start(0);
    
    Tone.Transport.bpm.value = 120;
  };

  const togglePlay = async () => {
    await Tone.start();
    if (isPlaying) {
      Tone.Transport.stop();
    } else {
      Tone.Transport.start();
    }
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>POC IA Générative</h1>
      
      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>1. Prompt IA</h3>
        <textarea 
          value={prompt} 
          onChange={e => setPrompt(e.target.value)} 
          placeholder="Ex: Une basse funky..."
          rows={3}
          style={{ width: '100%' }}
        />
        <button onClick={handleGenerate}>Générer (Mock)</button>
      </div>

      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>2. Synthé (ADSR)</h3>
        <label>A: <input type="range" min="0" max="2" step="0.1" value={attack} onChange={e => setAttack(Number(e.target.value))} /> {attack}</label><br/>
        <label>D: <input type="range" min="0" max="2" step="0.1" value={decay} onChange={e => setDecay(Number(e.target.value))} /> {decay}</label><br/>
        <label>S: <input type="range" min="0" max="1" step="0.1" value={sustain} onChange={e => setSustain(Number(e.target.value))} /> {sustain}</label><br/>
        <label>R: <input type="range" min="0" max="5" step="0.1" value={release} onChange={e => setRelease(Number(e.target.value))} /> {release}</label>
      </div>

      <div style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
        <h3>3. Piano Roll (Visualisation 16 temps)</h3>
        <button onClick={togglePlay}>{isPlaying ? 'STOP' : 'PLAY'}</button>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(16, 1fr)', gap: '2px', marginTop: '10px' }}>
          {/* Visualisation simplifiée des 16 premiers temps */}
          {Array.from({ length: 16 }).map((_, i) => {
             // Vérifie si une note tombe sur ce temps (très simplifié pour le POC)
             const hasNote = sequence.some(n => {
               const [bar, beat, sub] = n.time.split(':').map(Number);
               // Conversion approximative pour l'affichage (Bar 0 uniquement)
               const stepIndex = (bar * 16) + (beat * 4) + sub; 
               return stepIndex === i;
             });
             return (
               <div key={i} style={{ 
                 height: '40px', 
                 background: hasNote ? '#4CAF50' : '#eee',
                 border: '1px solid #ddd'
               }} />
             );
          })}
        </div>
        <pre>{JSON.stringify(sequence, null, 2)}</pre>
      </div>
    </div>
  );
}

export default App;
```

## 4. Procédure de Test

1.  Créer le dossier et les fichiers.
2.  Lancer `docker compose up --build`.
3.  Accéder à `http://localhost:5173`.
4.  Cliquer sur "Générer" (Le mock doit charger une séquence).
5.  Cliquer sur "PLAY" -> Le son doit sortir et les cases vertes s'allumer.
6.  Modifier les sliders ADSR -> Le son doit changer.
