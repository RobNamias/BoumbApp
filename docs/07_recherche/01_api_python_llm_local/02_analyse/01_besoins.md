# Analyse des Besoins

## Besoins Fonctionnels

### Gestion IA Locale
- **Hébergement** : Le système doit gérer un LLM gratuit tournant sur la machine locale.
- **Interface API** : Une API Python (basée sur un script existant) doit servir de passerelle.

### Interaction Frontend (Simulation)
- **Entrée** : Le système reçoit un prompt textuel.
- **Sortie** : Le système doit retourner un JSON formaté contenant un tableau de notes compatible avec le composant Piano Roll existant.

## Contraintes Techniques
- **Backend** : Python.
- **Infrastructure** : Conteneurisation **Docker** (Must Have).
- **Modèle** : Gratuit et Local.
- **Format de Données** : JSON strict (Tableau de notes).
- **Référence Technique** : Script `03_fichier_python_d_etude.py` (Implémentation Transformers/Torch).

## Périmètre (Hors scope pour ce labo)
- Implémentation complète du RAG (prévu pour plus tard).
- Développement complet du Frontend (on se concentre sur le flux backend/API/LLM).
