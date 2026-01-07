# Choix Technologiques - Modèle IA

## Nature du Problème
La demande consiste à générer une suite de notes au format JSON à partir d'un prompt textuel.
D'un point de vue technique, c'est une tâche de **"Text-to-JSON"** ou **"Instruction Following"**.

## Est-ce qu'une IA "Texte" connait la musique ?
**OUI.**
Les LLM généralistes (Llama 3, Mistral, Qwen) ont été entraînés sur des quantités massives de données textuelles, incluant :
- Des cours de solfège et de théorie musicale.
- Des partitions au format texte (ABC notation, LilyPond).
- Du code informatique manipulant de la musique.

Par conséquent, si on demande à un LLM : *"Génère une mélodie triste en Do mineur"*, il "sait" conceptuellement quelles notes utiliser (Do, Mib, Sol...) et quel tempo adopter, même s'il n'a pas d'oreilles. Il va construire la réponse comme un problème logique.

## Comparatif des Solutions Locales

### 1. Modèles Généralistes (Recommandé)
Ces modèles sont excellents pour suivre des instructions strictes (comme "Sors moi du JSON").
- **Mistral 7B (v0.3)** : Excellent équilibre performance/ressources. Très bon en logique.
- **Qwen 2.5 (7B ou 14B)** : Actuellement l'un des meilleurs pour le code et les formats structurés.
- **Llama 3 (8B)** : Très performant, mais parfois verveux.

**Avantages** :
- Faciles à faire tourner (via Ollama, LM Studio).
- Très bonne capacité à respecter le schéma JSON demandé.

### 2. Modèles Spécialisés Musique (Non Recommandé pour ce stade)
Il existe des modèles comme **MusicGen** ou **AudioLDM**.
**Inconvénients** :
- Ils génèrent souvent de l'audio (WAV) ou des spectrogrammes, pas du JSON pour un PianoRoll.
- Ils sont plus lourds et spécifiques à installer.
- **ChatMusician** (basé sur Llama 2) existe mais utilise souvent la notation ABC, ce qui rajoute une étape de conversion.

## Stratégie Retenue
Utiliser un **LLM Généraliste "Instruct"** (Type Mistral ou Qwen) exécuté localement (via **Ollama**).

### Pourquoi ?
1.  **Simplicité** : Installation immédiate.
2.  **Flexibilité** : On peut changer de modèle sans changer le code Python (l'API reste la même).
3.  **JSON Mode** : Ollama et les librairies modernes supportent le "JSON Mode" pour forcer le modèle à ne pas répondre avec du texte de remplissage ("Voici votre mélodie..."), ce qui briserait le parser du Frontend.

## Stack Technique IA
- **Moteur** : Ollama (Service local).
- **Modèle Cible** : `mistral` ou `qwen2.5` (à tester).
- **Format** : Prompt Engineering avec définition stricte du schéma de sortie JSON.

## Et pour le futur (RAG) ?
La question a été posée de savoir si Mistral 7B est adapté pour le **RAG (Retrieval-Augmented Generation)**.
**Réponse : OUI, c'est même un excellent candidat.**

1.  **Performance Locale** : Mistral 7B surpasse souvent Llama 2 (13B) sur les benchmarks de raisonnement. Il est capable de synthétiser des informations provenant de plusieurs documents injectés dans son contexte sans "perdre le fil".
2.  **Fenêtre de Contexte** : Les versions récentes gèrent une fenêtre de contexte confortable (jusqu'à 32k tokens pour Mistral v0.3), ce qui est crucial pour ingérer les documents du RAG.
3.  **Écosystème** : La plupart des outils de RAG modernes (LangChain, LlamaIndex, Haystack) supportent nativement Mistral via Ollama.

**Conclusion pour le RAG** :
Pas d'inquiétude à avoir. Commencer avec Mistral 7B pour la génération simple est une stratégie pérenne. Il suffira d'ajouter une brique de base de données vectorielle (ex: ChromaDB) et un modèle d'embedding (ex: `nomic-embed-text`) plus tard pour transformer le labo en système RAG complet, sans changer le LLM principal.
