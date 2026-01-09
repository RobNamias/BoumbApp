import { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
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
    <HashRouter>
      <Routes>
        {/* Root Route: Shows Hero if not ready, otherwise redirects to App */}
        <Route
          path="/"
          element={
            !isAudioReady ? (
              <Hero onStart={handleStart} />
            ) : (
              <Navigate to="/app" replace />
            )
          }
        />

        {/* App Routes: Protected by AudioReady check */}
        <Route
          path="/app"
          element={
            isAudioReady ? <Layout /> : <Navigate to="/" replace />
          }
        >
          <Route index element={<Navigate to="juicy" replace />} />
          <Route path="juicy" element={<JuicyBoxPage />} />
          <Route path="synth" element={<SynthLabPage />} />
          <Route path="mixer" element={<MixerPage />} />
          <Route path="song" element={<SongModePage />} />
        </Route>

        {/* Catch-all: Redirect to Root */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
