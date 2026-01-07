FROM tensorflow/tensorflow:2.11.0

WORKDIR /app

# Install system dependencies for Magenta/Librosa
RUN apt-get update && apt-get install -y \
    build-essential \
    libsndfile1 \
    libasound2-dev \
    libjack-dev \
    portaudio19-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# Copie des ressources RAG
COPY knowledge_base/ ./knowledge_base
COPY rag_pipeline/ ./rag_pipeline

# Copie du code source (depuis le dossier app local vers /app/app dans le conteneur)
COPY app/ ./app

# Lancement de l'application via Uvicorn
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
