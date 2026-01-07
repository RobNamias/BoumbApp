import React from 'react';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/atoms/Button';
import Knob from '../components/atoms/Knob';
import Fader from '../components/atoms/Fader';
import Switch from '../components/atoms/Switch';
import Led from '../components/atoms/Led';
import TransportControls from '../components/molecules/TransportControls';
import Pagination from '../components/molecules/Pagination';

const DesignSystemPage: React.FC = () => {
    const { theme, toggleTheme } = useAppStore();

    React.useEffect(() => {
        document.body.dataset.theme = theme;
    }, [theme]);

    return (
        <div style={{ padding: '40px', minHeight: '100vh', transition: 'background-color 0.3s' }}>
            <h1>🎨 Design System Playground</h1>

            <section style={{ marginBottom: '40px', borderBottom: '1px solid #333', paddingBottom: '20px' }}>
                <h2>Theme State</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <p>Current Theme: <strong>{theme}</strong></p>
                    <Button onClick={toggleTheme} variant="secondary" size="sm">
                        Toggle Theme
                    </Button>
                </div>
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h2>Atoms</h2>

                <div style={{ marginBottom: '30px' }}>
                    <h3>Buttons</h3>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap' }}>
                        <Button variant="primary">Primary</Button>
                        <Button variant="secondary">Secondary</Button>
                        <Button variant="ghost">Ghost</Button>
                        <Button variant="primary" disabled>Disabled</Button>
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'flex-end' }}>
                        <Button size="sm" variant="primary">Small</Button>
                        <Button size="md" variant="primary">Medium</Button>
                        <Button size="lg" variant="primary">Large</Button>
                    </div>
                </div>

                <h3>Toggles & Leds</h3>
                <div style={{ display: 'flex', gap: '40px', marginBottom: '30px', alignItems: 'center' }}>
                    <SwitchDemo label="Power" initialChecked={true} />
                    <SwitchDemo label="Mute" initialChecked={false} />

                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', marginLeft: '20px' }}>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <Led active={true} />
                            <span style={{ fontSize: '0.8em' }}>Active</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <Led active={false} />
                            <span style={{ fontSize: '0.8em' }}>Inactive</span>
                        </div>
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <Led active={true} color="#ff0000" size={16} />
                            <span style={{ fontSize: '0.8em' }}>Rec (Red)</span>
                        </div>
                    </div>
                </div>

                <h3>Knobs</h3>
                <div style={{ display: 'flex', gap: '40px' }}>
                    <KnobDemo label="Volume" initialValue={75} />
                    <KnobDemo label="Pan" initialValue={0} min={-100} max={100} />
                    <KnobDemo label="Send A" initialValue={0} size={40} />
                </div>

                <h3>Faders</h3>
                <div style={{ display: 'flex', gap: '40px', height: '250px' }}>
                    <FaderDemo label="Master" initialValue={80} height={200} />
                    <FaderDemo label="Track 1" initialValue={50} height={200} />
                    <FaderDemo label="Return" initialValue={20} height={150} />
                </div>
            </section>

            <section style={{ marginBottom: '40px' }}>
                <h2>Molecules</h2>

                <div style={{ marginBottom: '30px' }}>
                    <h3>Transport & Navigation</h3>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
                        <TransportControlsDemo />
                        <div style={{ width: '1px', height: '40px', background: '#444' }}></div>
                        <PaginationDemo />
                    </div>
                </div>
            </section>
        </div>
    );
};

interface KnobDemoProps {
    initialValue: number;
    [key: string]: any;
}

const KnobDemo: React.FC<KnobDemoProps> = ({ initialValue, ...props }) => {
    const [value, setValue] = React.useState(initialValue);
    return (
        <div style={{ textAlign: 'center' }}>
            <Knob value={value} onChange={setValue} {...props} />
            <div style={{ marginTop: '5px', fontSize: '0.8em', opacity: 0.7 }}>
                {Math.round(value)}
            </div>
        </div>
    );
};

interface FaderDemoProps {
    initialValue: number;
    [key: string]: any;
}

const FaderDemo: React.FC<FaderDemoProps> = ({ initialValue, ...props }) => {
    const [value, setValue] = React.useState(initialValue);
    return (
        <div style={{ textAlign: 'center' }}>
            <Fader value={value} onChange={setValue} {...props} />
            <div style={{ marginTop: '5px', fontSize: '0.8em', opacity: 0.7 }}>
                {Math.round(value)}
            </div>
        </div>
    );
};

interface SwitchDemoProps {
    initialChecked: boolean;
    label?: string;
}

const SwitchDemo: React.FC<SwitchDemoProps> = ({ initialChecked, label }) => {
    const [checked, setChecked] = React.useState(initialChecked);
    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
            <Switch checked={checked} onChange={setChecked} label={label} />
        </div>
    );
};

const TransportControlsDemo: React.FC = () => {
    const [isPlaying, setIsPlaying] = React.useState(false);
    const [isPaused, setIsPaused] = React.useState(false);
    const [isRecording, setIsRecording] = React.useState(false);
    const [bpm, setBpm] = React.useState(128);

    const handlePlay = () => {
        setIsPlaying(true);
        setIsPaused(false);
    };

    const handlePause = () => {
        if (isPlaying) {
            setIsPlaying(false);
            setIsPaused(true);
        } else if (isPaused) {
            // Resume
            setIsPlaying(true);
            setIsPaused(false);
        }
    };

    const handleStop = () => {
        setIsPlaying(false);
        setIsPaused(false);
    };

    return (
        <TransportControls
            isPlaying={isPlaying}
            isPaused={isPaused}
            isRecording={isRecording}
            bpm={bpm}
            onPlay={handlePlay}
            onPause={handlePause}
            onStop={handleStop}
            onRecord={() => setIsRecording(!isRecording)}
            onBpmChange={setBpm}
        />
    );
};

const PaginationDemo: React.FC = () => {
    const [page, setPage] = React.useState(0);
    const [playingPage, setPlayingPage] = React.useState(0);

    // Simulate playing head moving
    React.useEffect(() => {
        const interval = setInterval(() => {
            setPlayingPage((prev) => (prev + 1) % 4);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <Pagination
            totalPages={4}
            currentPage={page}
            playingPage={playingPage}
            onPageSelect={setPage}
        />
    );
};

export default DesignSystemPage;
