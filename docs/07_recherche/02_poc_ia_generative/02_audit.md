# Audit POC : IA Générative (Google Gemini)

Ce document sert de support pour auditer les résultats du POC "IA Générative". Il doit être rempli au fur et à mesure des tests.

## Partie 1 : Contexte de l'Audit

*   **Date** : [Date du jour]
*   **Modèle IA utilisé** : Google Gemini (Préciser version : ex: Gemini 1.5 Flash / Pro)
*   **Stack Technique** : Node.js (Proxy) + React (Vite) + Tone.js
*   **Objectif** : Valider la capacité de l'IA à générer du JSON musical cohérent et jouable.

---

## Partie 2 : Protocole de Tests & Résultats

Pour chaque test, noter le prompt exact, le résultat attendu, et le résultat obtenu.

| ID | Type de Prompt | Prompt Utilisateur | Résultat Attendu | Résultat Obtenu (Observations) | Note (1-5) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **T1** | **Simple** | "Une basse simple en Do mineur" | JSON valide, notes dans la gamme, rythme basique. | *[À Remplir]* | -/5 |
| **T2** | **Rythmique** | "Un rythme de batterie funky" | Utilisation de notes courtes, silences, vélocité variable. | *[À Remplir]* | -/5 |
| **T3** | **Complexe** | "Une mélodie mélancolique avec des notes longues" | Tempo lent, notes > 4n, gamme mineure. | *[À Remplir]* | -/5 |
| **T4** | **Technique** | "Une montée chromatique rapide" | Notes qui se suivent par demi-ton, durée courte (16n). | *[À Remplir]* | -/5 |
| **T5** | **Crash Test** | "Fais n'importe quoi mais que ça sonne bien" | L'IA doit interpréter et proposer quelque chose de structuré. | *[À Remplir]* | -/5 |

---

## Partie 3 : Analyse Technique

### 3.1 Latence & Performance
*   **Temps de réponse moyen** : [Ex: 2 secondes]
*   **Ressenti utilisateur** : [Ex: Acceptable / Trop long]

### 3.2 Robustesse du JSON
*   **Taux d'erreur de parsing** : [Ex: 0% - Le JSON est toujours propre]
*   **Respect du Schéma** : L'IA respecte-t-elle toujours la structure `variations > sequence > note/duration/time` ?
    *   [ ] Oui, toujours.
    *   [ ] Non, erreurs fréquentes (préciser : ...).

### 3.3 Qualité Musicale (Tone.js)
*   **Jouabilité** : Les notes générées sont-elles bien interprétées par Tone.js ?
    *   [ ] Oui.
    *   [ ] Non (Problèmes de format de durée ou de hauteur).
*   **Cohérence** : La musique générée ressemble-t-elle à la demande ?

---

## Partie 4 : Conclusion & Décision

### Synthèse
*   **Points Forts** :
    *   ...
    *   ...
*   **Points Faibles** :
    *   ...
    *   ...

### Décision
*   [ ] **GO** : La solution est viable pour le MVP.
*   [ ] **NO-GO** : La technologie n'est pas mûre / Trop complexe.
*   [ ] **GO avec Réserves** : Nécessite des ajustements (ex: Prompt Engineering plus poussé).

---

## Annexe : Exemples de JSON Reçus
*(Copier ici un exemple de JSON brut reçu lors d'un test réussi pour référence)*

```json
// Coller le JSON ici
```
