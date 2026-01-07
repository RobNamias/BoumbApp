# Spécialisation IA : Le Micro-RAG (Documentation Contextuelle)

**Statut** : Exploratoire (P2)
**Complexité** : Faible (Pas de Vector DB)
**Gain** : Pertinence Stylistique

## 1. Le Principe
Le RAG (Retrieval-Augmented Generation) classique utilise une base de données vectorielle pour chercher dans des milliers de documents. Pour notre besoin (une cinquantaine de pages de théorie ou de descriptions de styles), cette infrastructure est disproportionnée.

Le **Micro-RAG** repose sur une indexation par **Mots-Clés**. On associe des fichiers textes (snippets de connaissance) à des déclencheurs (keywords).

## 2. Architecture Technique

### Organisation des Données
On crée un dossier `ai_service/knowledge_base/` contenant des fichiers `.txt` ou `.md` légers :
*   `styles/jazz.txt` : *"Le jazz utilise souvent des rythmes swing, des accords de 7ème et des progressions II-V-I..."*
*   `styles/techno.txt` : *"La techno se caractérise par un Kick sur tous les temps (4/4), une basse offbeat..."*
*   `theory/syncopation.txt` : *"La syncope consiste à accentuer les temps faibles..."*

### Flux de Données
1.  **User Input** : "Fais une mélodie **Jazz** rapide".
2.  **Extracteur de Mots-Clés** : Python détecte le mot "Jazz".
3.  **Retrieval (Système de Fichiers)** : Le script charge le contenu de `styles/jazz.txt`.
4.  **Injection** : Le contenu est ajouté au Prompt :
    *   *"CONTEXTE ADDITIONNEL : Utilise les règles de style suivantes : [Contenu de jazz.txt]"*
5.  **Génération** : L'IA utilise ces définitions pour guider son style.

## 3. Analyse Avantages / Inconvénients

| Avantages | Inconvénients |
| :--- | :--- |
| **Culture Musicale** : L'IA "apprend" des styles qu'elle connait peu. | **Fenêtre de Contexte** : Attention à ne pas dépasser la limite de tokens du modèle. |
| **Légèreté** : Pas de base de données, juste des fichiers texte. | **Maintenance Manuelle** : Il faut rédiger et tenir à jour les fichiers texte. |
| **Explicabilité** : On sait exactement quel fichier a influencé la réponse. | **Simplicité** : Moins puissant qu'une recherche sémantique vectorielle (Vrai RAG). |

## 4. Plan d'Action (Roadmap)
1.  Créer l'arborescence `knowledge_base` dans le projet.
2.  Rédiger 3 fichiers pilotes (`techno.txt`, `house.txt`, `hiphop.txt`).
3.  Implémenter un `KnowledgeRetriever` simple dans `main.py` basé sur une liste de mots-clés.
4.  Injecter le contexte récupéré dans `system_instruction`.
