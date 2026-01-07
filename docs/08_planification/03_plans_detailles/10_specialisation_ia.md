# Plan Détaillé : Phase 10 - Spécialisation IA Avancée (Modèle Hybride & Smart Flow)

**Objectif** : Créer un système de génération IA "Noob-Friendly" mais théoriquement rigoureux.
**Philosophie** : "L'utilisateur exprime une intention, le Système garantit la cohérence musicale."

---

## 📅 Étape 1 : Fondations Data & Logger
*On prépare le terrain.*

*   [x] **1.1 Restructuration des Dossiers**
    *   **Structure Cible** :
        *   `app/core/` : `config.py` (Env vars), `logger.py` (CSV/SQLite), `exceptions.py` (Error handlers).
        *   `app/models/` : `requests.py` (Pydantic Inputs), `responses.py` (Outputs), `music.py` (Internal).
        *   `app/services/` : `theory_service.py` (Music21), `llm_service.py` (Ollama), `prompt_factory.py` (Builder), `analytics_service.py` (Logs).
        *   `app/routes/` : `generate.py` (POST /generate), `feedback.py` (POST /feedback).
        *   `app/main.py` : Entrypoint (FastAPI app, CORS, Routers inclusion).
*   [x] **1.2 Logger Service (Data Collection)**
    *   UUID par requête.
    *   Sauvegarde complète (Prompt, Analyse, JSON, Feedback).
    *   **Réponse IA (JSON Complet)** : Indispensable pour le re-play et le Fine-Tuning.

## 🧠 Étape 2 : Le Moteur Hybride (`MusicTheoryService`) & Analyseur

*Le cœur de l'intelligence musicale. Rigueur mathématique (`music21`) + Souplesse (LLM).*

*   [x] **2.1 Installation (`requirements.txt`)**
    *   Ajouter `music21` (fait).

*   [x] **2.2 Service Théorique : `app/services/theory_service.py`**
    *   **Architecture** : Encapsulation totale de `music21`.
    *   **Méthodes (API Spécifiée)** :
        *   `get_scale_notes(root: str, scale_type: str) -> List[str]`
        *   `get_valid_pitches(scale_notes: List[str], octave_range: tuple[int, int]) -> List[str]`
        *   `validate_sequence(sequence: List[Note], allowed_notes: List[str]) -> bool`
        *   `detect_key_from_notes(notes: List[str]) -> str`

        *   `get_chord_notes(root: str, quality: str) -> List[str]` (Bonus)
            *   *Module* : `music21.chord`.
            *   *Rôle* : L'"Harmoniste". Si l'IA sort une progression d'accords (I-V-vi-IV), il génère les vraies notes. Très puissant pour les PADs.

        *   `validate_rhythm(duration: float, time_signature: str) -> bool` (Bonus)
            *   *Module* : `music21.meter`.
            *   *Rôle* : Le "Metronome". Pourra vérifier plus tard si on est bien en 4/4 ou 3/4.

        *   `calculate_duration_in_seconds(quarter_length: float, bpm: int) -> float` (Bonus)
            *   *Module* : `music21.tempo.MetronomeMark`.
            *   *Rôle* : Le "Chronomètre". Utile pour convertir la durée musicale (ex: 2 mesures) en temps réel (ex: 4.0s) pour l'affichage ou l'export audio.

*   [x] **2.3 Service Analyse : `app/services/prompt_analyzer.py`** (NOUVEAU)
    *   **Objectif** : Convertir une intention ("Triste") en paramètres techniques (Root/Scale).
    *   **Méthode** : `def analyze_intent(prompt: str, global_key: dict = None) -> GenerationParams`
    *   **Flow de Décision** :
        1.  **Parsing** : Cherche des mots clés explicites dans le prompt (ex: "in A Minor").
        2.  **Fallback Global** : Si rien trouvé, regarde `global_key` (du `ProjectStore`).
        3.  **Fallback Heuristique** : "Triste" -> Minor, "Joyeux" -> Major.
        4.  **Fallback Default** : C Major.
    *   *Output* : Un objet Pydantic `GenerationParams(root='C', scale='Minor', bpm=120)`.

*   [x] **2.4 Prompt Builder : `app/services/prompt_factory.py`**
    *   **Méthode** : `def build_system_prompt(params: GenerationParams, valid_notes: List[str]) -> str`
    *   **Template** :
        > "Tu es un compositeur expert...
        > Tu DOIS utiliser ces notes : {valid_notes (ex: C3, D3, Eb3...)}
        > Tempo: {bpm}
        > Contexte : {user_prompt}"

## ⚙️ Flux de Données (Workflow Phase 2)
1.  **Frontend** envoie : `{ prompt: "Basse lourde", options: { root: null, scale: null }, context: { globalKey: "F# Minor" } }`
2.  **API (`generate.py`)** appelle `PromptAnalyzer.analyze_intent(...)`.
3.  **Analyzer** voit "options null" mais "globalKey F# Minor" -> Sélectionne **F# Minor**. et octave range **(1, 2)** car prompt contient "Basse".
4.  **API** appelle `TheoryService.get_scale_notes("F#", "Minor")` (Music21).
5.  **API** appelle `TheoryService.get_valid_pitches(..., (1, 2))` (Music21).
6.  **API** construit le prompt avec `['F#1', 'G#1', 'A1'...]`.
7.  **LLM** génère le JSON.
8.  **API** appelle `TheoryService.validate_sequence(...)` pour être sûr.
9.  **Frontend** reçoit la mélodie.

## 🔌 Étape 3 : API Routes
*L'interface avec le monde.*

*   [x] **3.1 Modèles API (`app/models/requests.py` & `responses.py`)**
    *   **Input (`POST /generate`)** :
        ```python
        class GenerateRequest(BaseModel):
            prompt: str
            bpm: int = 120
            options: Optional[GenerationParams] = None # Explicit overrides
            global_key: Optional[Dict[str, str]] = None # Project Context
        ```
    *   **Output** :
        ```python
        class GenerateResponse(BaseModel):
            request_id: str
            notes: List[dict] # The JSON pattern
            analysis: GenerationParams # What we actually used (Root/Scale)
        ```

*   [x] **3.2 Endpoint Generation (`app/routes/generate.py`)**
    *   **Logic** :
        1.  Reçoit `GenerateRequest`.
        2.  `PromptAnalyzer` -> Déduit `GenerationParams` (mix options/global/inference).
        3.  `TheoryService` -> Calcule `valid_notes` (Music21).
        4.  `PromptFactory` -> Crée le System Prompt.
        5.  `LLMService` -> Appelle Ollama (Streaming ou Block).
        6.  `LoggerService` -> Enregistre tout.
        7.  Retourne `GenerateResponse`.

*   [x] **3.3 Endpoint Feedback (`app/routes/feedback.py`)**
    *   **Input** : `request_id`, `rating` (1-5), `comment`.
    *   **Logic** : Appelle `LoggerService.add_feedback`.

*   [x] **3.4 Main Entrypoint (`app/main.py`)**
    *   Montage des routers.
    *   CORS (Allow All pour dev local).

## 🎨 Étape 4 : Frontend & Global Key
*L'expérience utilisateur unifiée.*

*   [x] **4.1 Store Update (`projectStore.ts`)**
    *   Ajout de `globalKey: { root: string, scale: string }` dans `ProjectData.meta`.
    *   Actions : `setGlobalKey(root, scale)`.
*   [x] **4.2 Composant AI Prompt (`AIPrompt.tsx`)**
    *   Connecter le store (lecture du BPM/Key).
    *   Appeler le nouvel Endpoint `/v1/generate`.
    *   Gérer le Loading state & Error handling.
*   [x] **4.3 Service Frontend (`aiService.ts`)**
    *   Typage strict des échanges avec le backend.
    *   Les dropdowns (Root/Scale) ont une option "Auto / Project Key" par défaut.
    *   L'utilisateur peut forcer "D Minor" s'il veut, sinon ça suit le projet ou l'analyse IA.
*   [x] **4.4 Feedback UI**

---

## ✅ Scénario de Test "Noob-Friendly"
1.  **Setup** : Projet réglé sur "F# Minor" dans la TopBar.
2.  **Action** : User tape "Grosse basse qui tâche" (sans réglages).
3.  **Flux** :
    *   Backend voit "No Options".
    *   Backend utilise "F# Minor" (Project Key).
    *   Backend demande à music21 les notes de F# Minor.
    *   Backend génère la basse.
4.  **Résultat** : La basse est parfaitement dans la gamme du projet. Magique. ✨
