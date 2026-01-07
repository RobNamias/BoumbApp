# 🎵 Boumb'App - Cloud Music Studio

**Boumb'App** is a modern, web-based DAW (Digital Audio Workstation) that brings music production to the cloud. Built with a Cyberpunk aesthetic and powerful audio features, it offers a complete suite of tools for beatmakers and producers.

![BoumbApp Hero](client/public/logo-full.png)

## 🚀 Features

### 🎹 The Studio Modules
*   **Juicy Box (Drum Machine)**: 32-step sequencer with drag-and-drop sample management.
*   **Synth Lab**: Dual-oscillator synthesizer (Lead & Bass) with built-in **AI Composer** for generative melodies.
*   **Skyline (Arrangement)**: Timeline view to structure your tracks from loops to full songs. "Matrix-style" debug overlay included.
*   **The Sauce (Mixer)**: Professional mixing console with Glassmorphism UI and effects chain (Reverb, Delay, BitCrusher, AutoFilter).

### ☁️ Cloud & Connectivity
*   **Unified Dashboard**: Personal space to manage your producer identity and project library.
*   **Cloud Save**: Automatic versioning and persisting of your projects.
*   **Global Key**: Intelligent musical key synchronization across all modules.

## 🛠️ Tech Stack

*   **Frontend**: React (Vite), TypeScript, Tone.js, Zustand, SCSS (Modules).
*   **Backend**: Symfony (PHP), API Platform, PostgreSQL.
*   **AI Service**: Python (FastAPI), Magenta (TensorFlow) for generative audio.
*   **Infrastructure**: Docker, Docker Compose, Caddy (Reverse Proxy).

## 📦 Installation

### Prerequisites
*   Docker & Docker Compose
*   Node.js 18+ (for local frontend dev)

### Quick Start

1.  Clone the repository:
    ```bash
    git clone https://github.com/RobNamias/BoumbApp.git
    cd BoumbApp
    ```

2.  Start the stack with Docker:
    ```bash
    docker compose up -d --build
    ```

3.  Access the application:
    *   **App**: [https://localhost](https://localhost)
    *   **API**: [https://localhost/api](https://localhost/api)

## 📖 Documentation

A comprehensive User Manual is available directly within the application (click the book icon) or in `client/public/manual`.
*   [French Documentation](client/public/manual/fr/index.html)
*   [English Documentation](client/public/manual/en/index.html)

---

*Made with ❤️ and code by RobNamias.*
