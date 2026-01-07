# Walkthrough : Coquille Applicative ("The Shell")

Nous avons mis en place la structure UI globale de l'application.

## 1. Composants Architecturaux
*   **MainLayout** (`client/src/components/templates/MainLayout`) : Le conteneur principal. Il gère l'état de la vue (`currentView`).
*   **Sidebar** (`client/src/components/organisms/Sidebar`) : Barre de navigation latérale.
    *   Icone ☁️ **Nuage** pour la vue **Skyline** (Mode Song).
    *   Icone **Grille** pour la vue **Studio** (Mode Pattern).
*   **TransportBar** (`client/src/components/organisms/TransportBar`) : Barre de contrôle en haut (Play/Pause/BPM).

## 2. Easter Egg "Midnight Purple" 🏎️
Comme demandé, le fond de la vue **Skyline** utilise un dégradé subtil "Midnight Purple" (`#2a0033` -> `#121214`), en hommage à la R34.

## 3. Intégration
L'application démarre maintenant sur ce Layout.
*   Par défaut, la vue "Studio" affiche la `JuicyBox` (via `SequencerTestPage`).
*   Le clic sur "Skyline" change le contexte et affiche le fond violet (vide pour l'instant).

---

### Prochains Pas
*   Connecter le `TransportBar` au `AudioEngine` (Play/Pause réel).
*   Remplir la vue "Skyline" avec la Timeline.
*   Transformer `SequencerTestPage` en un vrai composant `JuicyBox` propre.
