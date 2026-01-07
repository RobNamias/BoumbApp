*   **Zéro Dette Documentaire** : La documentation n'est pas une tâche post-dev, c'est **partie intégrante** du ticket. Pas de doc = pas de merge.

## 2. Protocole "Strict Doc" (Application Systématique)
Pour toute modification de code, l'analyse d'impact est **obligatoire**.

| Domaine Impacté | Fichiers à Vérifier / Mettre à jour (Checklist) |
| :--- | :--- |
| **Composant UI** | `ui_composants.md` (Inventaire), `ui_charte.md` (si nouveau style), `architecture_frontend.md` |
| **Structure App** | `architecture_frontend.md` (Arborescence), `useAppStore` (State) |
| **Model / Data** | `bdd_entites_{mvp|evolution}.md`, `mcd.md` |
| **API / Backend** | `api_endpoints_mvp.md`, `api_payloads.md` |
| **Tests** | `inventaire_tests_{frontend|backend}.md`, `strategie_globale.md` |

### Rituel de Clôture de Tâche
Avant d'annoncer "Terminé", vérifier :
1.  [ ] **Index Local** : Le fichier est-il listé dans son dossier parent ? (ex: `05_reference_technique/index.md`)
2.  [ ] **Index Global** : Le fichier est-il listé dans `00_index_general.md` ?
3.  [ ] **Plans** : La tâche est-elle cochée dans `task.md` et les plans détaillés ?
4.  [ ] **Consistance** : Les liens entre docs (ex: UI -> API) sont-ils valides ?

## 4. Coding Standards (Règles de Code)
*   **Vitest / JSDOM** : Utiliser `globalThis` au lieu de `window` pour le mocking global (ex: `globalThis.HTMLElement.prototype...` au lieu de `window...`). Cela évite les alertes de linter et assure une compatibilité Node.js standard.
