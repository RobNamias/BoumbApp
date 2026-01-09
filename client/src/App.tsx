import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/templates/Layout';
import JuicyBoxPage from './pages/JuicyBoxPage';
import SynthLabPage from './pages/SynthLabPage';
import SongModePage from './pages/SongModePage';
import MixerPage from './pages/MixerPage';
import Hero from './components/organisms/Hero';
import AudioEngine from './audio/AudioEngine';
import { useProjectAudio } from './hooks/useProjectAudio';
import { useAppStore } from './store/useAppStore';

function App() {
  const [isAudioReady, setIsAudioReady] = useState(false);

  // Sync Audio Hook (Global)
  useProjectAudio();

  // Init Audio Listener
  useEffect(() => {
    useAppStore.getState()._initAudio();
  }, []);

  const handleStart = async () => {
    await AudioEngine.initialize();
    setIsAudioReady(true);
  };

  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        {/* Root Route: Shows Hero if not ready, OR directly to app if audio ready (or we can keep the landing page) */}
        {/* Simplified for GH Pages Demo: If not ready, show Hero. If ready, rendering Layout which contains the app */}

        {/* We want /juicy, /mixer etc directly. */}
        {/* But we also have a Landing page at /? */}

        {/* If audio IS NOT ready, any access should show Hero. */}
        {/* If audio IS ready, / should redirect to /juicy (default view) */}

        <Route
          path="/"
          element={
            !isAudioReady ? (
              <Hero onStart={handleStart} />
            ) : (
              <Navigate to="/juicy" replace />
            )
          }
        />

        {/* Protected Routes (Audio Ready) */}
        <Route element={isAudioReady ? <Layout /> : <Navigate to="/" replace />}>
          <Route path="juicy" element={<JuicyBoxPage />} />
          <Route path="synth" element={<SynthLabPage />} />
          <Route path="mixer" element={<MixerPage />} />
          <Route path="song" element={<SongModePage />} />
        </Route>

        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
