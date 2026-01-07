# Dossier de Spécialisation IA (R&D)

Ce dossier documente les stratégies avancées pour optimiser, spécialiser et fiabiliser la génération musicale par IA dans BoumbApp.
Ces recherches se déroulent en parallèle du développement principal de l'application.

## Sommaire

### [01. Le Cerveau Hybride (Code + IA)](./01_modele_hybride.md)
**Priorité : P1 (Court Terme)**
Stratégie consistant à décharger l'IA des règles logiques strictes (théorie musicale) pour les confier à un moteur algorithmique (Python), ne laissant à l'IA que la part créative.

### [02. Le Micro-RAG (Documentation Contextuelle)](./02_micro_rag.md)
**Priorité : P2 (Moyen Terme)**
Stratégie d'injection dynamique de connaissances (Styles, Glossaire) via un système léger de recherche par mots-clés, sans l'infrastructure lourde d'une base vectorielle.

### [03. Le Fine-Tuning (Modèle Spécialisé)](./03_fine_tuning.md)
**Priorité : P3 (Long Terme)**
Stratégie de création d'un "Petit Modèle de Langage" (SLM) dédié exclusivement à la musique, entraîné sur un large corpus de données MIDI converties.

### [06. RAG Hybride (Perplexity + ETL)](./06_architecture_rag_hybride.md)
**Priorité : P1 (Immédiat - "Game Changer")**
Architecture combinant la puissance de recherche de Perplexity, un pipeline ETL Python pour structurer les données, et un SLM local (Qwen 1.5B) pour la génération rapide et "créative par contrainte".

### [07. Sélection Modèle : MIDI/JSON](./07_selection_model.md)
**Priorité : P1 (Recherche)**
Comparatif technique des modèles (MusicGen, Magenta, MuseNet) pour la génération mélodique locale, avec recommandations sur la performance et l'intégration.

---

**Note** : Ces documents servent de référence pour les futures itérations du module `ai_service`.
