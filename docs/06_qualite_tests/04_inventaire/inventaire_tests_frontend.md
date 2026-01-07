# Inventaire des Tests Frontend (Vitest)

Ce document recense les tests unitaires et d'intégration réalisés pour l'interface React.

- **Framework** : Vitest (Client), PHPUnit (API)
- **Localisation** : `client/src/**/*.test.tsx`
- **Commande** : `npm run test` (dans `/client`)

## 1. Composants (Atoms & Molecules)

| Composant | Fichier Test | Scénarios Couverts | Statut |
| :--- | :--- | :--- | :--- |
| **Button** | `Button.test.tsx` | - Rendu avec texte<br>- Application variante `primary`<br>- Application classes CSS | 🟢 PASS |
| **Knob** | `Knob.test.tsx` | - Rendu SVG<br>- Accessibilité (role=slider) | 🟢 PASS |
| **Fader** | `Fader.test.tsx` | - Rendu Vertical<br>- Accessibilité (role=slider + orientation) | 🟢 PASS |
| **Switch** | `Switch.test.tsx` | - Rendu (role=switch)<br>- Toggle checked | 🟢 PASS |
| **Led** | `Led.test.tsx` | - Active state (class based)<br>- Style props | 🟢 PASS |
| **TransportControls** | `TransportControls.test.tsx` | - Rendu (Play, Pause, Stop, Rec)<br>- Handlers | 🟢 PASS |
| **Pagination** | `Pagination.test.tsx` | - Rendu Pages<br>- View vs Play State (Led) | 🟢 PASS |
| **StepCell** | `StepCell.test.tsx` | - Multi-mode (Trigger, Volume, Fill)<br>- Active state | 🟢 PASS |
| **Sequencer** | `Sequencer.test.tsx` | - Integration 16 Steps<br>- Single Row Layout<br>- Click Propagation | 🟢 PASS |
| **AIComposerPopover** | `AIComposerPopover.test.tsx` | - Rendu Initial (Prompt)<br>- États (Loading/Error)<br>- Mock Services | 🟢 PASS |

## 2. Store & Logique

| Unité | Fichier Test | Scénarios Couverts | Statut |
| :--- | :--- | :--- | :--- |
| **useAppStore** | - | - (À venir) Auth Actions<br>- (À venir) Theme Toggle | ⚪ TODO |
