
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import TopBar from './TopBar';
import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mocks
vi.mock('react-i18next', () => ({
    useTranslation: () => ({
        t: (key: string) => key,
        i18n: {
            changeLanguage: vi.fn(),
            language: 'en'
        }
    })
}));

// Mock Stores
const mockUseAppStore = vi.fn();
const mockUseProjectStore = vi.fn();
const mockUseAuthStore = vi.fn();

vi.mock('../../store/useAppStore', () => ({
    useAppStore: () => mockUseAppStore()
}));

vi.mock('../../store/projectStore', () => ({
    useProjectStore: () => mockUseProjectStore()
}));

vi.mock('../../store/authStore', () => ({
    useAuthStore: () => mockUseAuthStore()
}));

// Mock Child Components to avoid deep rendering issues
vi.mock('../molecules/TransportControls', () => ({
    default: () => <div data-testid="transport-controls">TransportControls</div>
}));

vi.mock('../molecules/DropdownMenu', () => ({
    default: ({ label }: any) => <div data-testid={`menu-${label}`}>{label}</div>
}));

vi.mock('../molecules/Modal', () => ({
    default: ({ isOpen, children, title }: any) => isOpen ? <div data-testid="modal"><h1>{title}</h1>{children}</div> : null
}));

vi.mock('../atoms/Knob', () => ({
    default: () => <div data-testid="knob">Knob</div>
}));

vi.mock('../atoms/Led', () => ({
    default: () => <div data-testid="led">Led</div>
}));

describe('TopBar Component', () => {

    beforeEach(() => {
        // Reset mocks
        vi.clearAllMocks();

        // Default Store Values
        mockUseAppStore.mockReturnValue({
            bpm: 120,
            isPlaying: false,
            playingStep: 0,
            playMode: 'song',
            masterVolume: 0.8,
            isMasterMuted: false,
            juicyVolume: 0.8,
            synthVolume: 0.8,
            setIsPlaying: vi.fn(),
            setBpm: vi.fn(),
            stop: vi.fn(),
            togglePlayMode: vi.fn(),
            setMasterVolume: vi.fn(),
            setMasterMute: vi.fn(),
            setJuicyVolume: vi.fn(),
            setSynthVolume: vi.fn()
        });

        mockUseProjectStore.mockReturnValue({
            project: {
                meta: { title: 'Test Project', bpm: 120 },
                backendId: null
            },
            setProject: vi.fn()
        });

        mockUseAuthStore.mockReturnValue({
            user: { username: 'TestUser', email: 'test@test.com' },
            logout: vi.fn()
        });
    });

    it('renders correctly', () => {
        render(<TopBar />);

        // Check Transport
        expect(screen.getByTestId('transport-controls')).toBeInTheDocument();

        // Check Project Title
        expect(screen.getByText('Test Project')).toBeInTheDocument();

        // Check User Info
        expect(screen.getByText('TestUser')).toBeInTheDocument();
    });

    it('displays Login button when no user is logged in', () => {
        mockUseAuthStore.mockReturnValue({
            user: null,
            logout: vi.fn()
        });

        render(<TopBar />);
        expect(screen.getByText('topbar.login')).toBeInTheDocument();
    });

    it('renders Menus', () => {
        render(<TopBar />);
        expect(screen.getByTestId('menu-topbar.menu.project')).toBeInTheDocument();
        expect(screen.getByTestId('menu-topbar.menu.help')).toBeInTheDocument();
    });

});
