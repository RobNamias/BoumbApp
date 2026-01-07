import { useEffect } from 'react';
import { useAppStore } from '../store/useAppStore';

interface UseKeyboardShortcutsProps {
    onSave?: () => void;
}

export const useKeyboardShortcuts = ({ onSave }: UseKeyboardShortcutsProps = {}) => {
    const { isPlaying, setIsPlaying, stop } = useAppStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Ignore if focus is on an input or textarea
            if (
                document.activeElement instanceof HTMLInputElement ||
                document.activeElement instanceof HTMLTextAreaElement
            ) {
                return;
            }

            // --- TRANSPORT CONTROLS ---

            // Play/Pause: Space
            if (e.code === 'Space' && !e.shiftKey) {
                e.preventDefault(); // Prevent scrolling
                setIsPlaying(!isPlaying);
            }

            // Stop: Shift + Space
            if (e.code === 'Space' && e.shiftKey) {
                e.preventDefault();
                stop();
            }

            // --- PROJECT ACTIONS ---

            // Save: Ctrl + S (or Cmd + S)
            if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
                e.preventDefault(); // Prevent browser save
                if (onSave) {
                    onSave();
                }
            }
        };

        globalThis.addEventListener('keydown', handleKeyDown);
        return () => globalThis.removeEventListener('keydown', handleKeyDown);
    }, [isPlaying, setIsPlaying, stop, onSave]);
};
