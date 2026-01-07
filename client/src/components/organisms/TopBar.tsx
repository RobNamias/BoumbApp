import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useProjectStore } from '../../store/projectStore';
import { useAuthStore } from '../../store/authStore';
import { useLoadingStore } from '../../store/loadingStore';
import { projectService, type ProjectSummary } from '../../services/projectService';
import TransportControls from '../molecules/TransportControls';
import Knob from '../atoms/Knob';
import Led from '../atoms/Led';
import Modal from '../molecules/Modal';
import ConfirmModal from '../molecules/ConfirmModal';
import LoginModal from './LoginModal';
import DropdownMenu from '../molecules/DropdownMenu';
import { LogOut, Save, FolderOpen, Globe, FilePlus, Download, HelpCircle, Book, Info, LogIn } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import styles from '../../styles/modules/TopBar.module.scss';
import GlobalKeySelector from '../molecules/GlobalKeySelector';

// Internal Components styles
// Internal Components styles
// Removed btnStyle and badgeStyle as they are now in SCSS

const MiniKnob = ({ value, onChange, color, label, size = 28 }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        <Knob value={value * 100} onChange={(v: number) => onChange(v / 100)} size={size} min={0} max={100} color={color} />
        <span style={{ fontSize: '9px', color: '#666', textTransform: 'uppercase' }}>{label}</span>
    </div>
);

const TopBar: React.FC = () => {
    const { t, i18n } = useTranslation();

    // Stores
    const {
        bpm, isPlaying, playingStep, playMode,
        masterVolume, isMasterMuted,
        juicyVolume, synthVolume,
        setIsPlaying, setBpm, stop, togglePlayMode,
        setMasterVolume, setMasterMute,
        setJuicyVolume, setSynthVolume
    } = useAppStore();

    const { project, setProject } = useProjectStore();
    const { user, logout } = useAuthStore();

    // Local State for Modals
    const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isConfirmNewProjectOpen, setIsConfirmNewProjectOpen] = useState(false);
    const [projectNameInput, setProjectNameInput] = useState('');
    const [projectList, setProjectList] = useState<ProjectSummary[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
    const [versionList, setVersionList] = useState<any[]>([]); // Should import ProjectVersion type
    const [notification, setNotification] = useState<string | null>(null);

    // Helpers
    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const handleNewProject = () => {
        setIsConfirmNewProjectOpen(true);
    };

    const performNewProjectReset = () => {
        useProjectStore.getState().reset();
        showNotification(t('topbar.notifications.new_success'));
        setIsConfirmNewProjectOpen(false);
    };

    const toggleLanguage = () => {
        const nextLang = i18n.language === 'en' ? 'fr' : 'en';
        i18n.changeLanguage(nextLang);
    };

    const handleSaveClick = async () => {
        if (!user) {
            showNotification(t('topbar.notifications.save_auth'));
            setIsLoginModalOpen(true);
            return;
        }

        if (!project.backendId) {
            // New Project -> Open Naming Modal
            setProjectNameInput(project.meta.title || 'My Song');
            setIsSaveModalOpen(true);
        } else {
            // Existing -> Save Version immediately
            useLoadingStore.getState().setLoading(true, 'Sauvegarde de la version...');
            try {
                const ver = await projectService.saveVersion(project.backendId, project);
                showNotification(t('topbar.notifications.saved', { version: ver }));
            } catch (e) {
                console.error(e);
                showNotification(t('auth.errors.generic'));
            } finally {
                useLoadingStore.getState().setLoading(false);
            }
        }
    };

    // Enable Keyboard Shortcuts
    useKeyboardShortcuts({
        onSave: handleSaveClick
    });

    const confirmCreateProject = async () => {
        useLoadingStore.getState().setLoading(true, 'Création du projet...');
        try {
            // Update Store Name
            useProjectStore.setState(state => ({
                project: {
                    ...state.project,
                    meta: { ...state.project.meta, title: projectNameInput }
                }
            }));

            const payload = { ...project, meta: { ...project.meta, title: projectNameInput } };

            const newProj = await projectService.createProject(projectNameInput, payload);

            // Update Store with Backend ID
            useProjectStore.setState(state => ({
                project: {
                    ...state.project,
                    meta: { ...state.project.meta, title: projectNameInput },
                    backendId: newProj.id
                }
            }));

            setIsSaveModalOpen(false);
            showNotification(t('topbar.notifications.created', { name: newProj.name }));
        } catch (e) {
            console.error(e);
            showNotification(t('auth.errors.generic'));
        } finally {
            useLoadingStore.getState().setLoading(false);
        }
    };

    const handleLoadClick = async () => {
        if (!user) {
            showNotification(t('topbar.notifications.load_auth'));
            setIsLoginModalOpen(true);
            return;
        }

        useLoadingStore.getState().setLoading(true, 'Récupération des projets...');
        try {
            const list = await projectService.getAllProjects();
            setProjectList(list);
            setIsLoadModalOpen(true);
        } catch (e) {
            console.error(e);
            showNotification(t('auth.errors.generic'));
        } finally {
            useLoadingStore.getState().setLoading(false);
        }
    };

    const loadProjectVersion = (version: any) => {
        useLoadingStore.getState().setLoading(true, 'Chargement du projet...');
        try {
            if (version && version.data) {
                // Restore State (Hydration)
                // Ensure backendId is preserved/restored if not in JSON
                // We use selectedProjectId from state closure
                const restoredData = { ...version.data, backendId: selectedProjectId };
                setProject(restoredData);
                if (restoredData.meta && restoredData.meta.bpm) {
                    setBpm(restoredData.meta.bpm);
                }

                setIsLoadModalOpen(false);
                setSelectedProjectId(null);
                setVersionList([]);
                showNotification(t('topbar.notifications.loaded', { name: projectNameInput, version: version.versionNumber }));
                // Stop playback to avoid glitches
                stop();
            } else {
                showNotification('No content for this version');
            }
        } catch (e) {
            console.error(e);
            showNotification(t('auth.errors.generic'));
        } finally {
            useLoadingStore.getState().setLoading(false);
        }
    };

    return (
        <div className={styles.topBar}>
            {/* Left: Transport */}
            <div className={styles.leftSection}>
                <TransportControls
                    isPlaying={isPlaying} isPaused={!isPlaying && playingStep > 0} bpm={bpm}
                    onPlay={() => setIsPlaying(true)} onPause={() => setIsPlaying(false)}
                    onStop={() => stop()}
                    onBpmChange={(val) => {
                        setBpm(val);
                        // Sync Project Store
                        useProjectStore.setState(state => ({
                            project: { ...state.project, meta: { ...state.project.meta, bpm: val } }
                        }));
                    }}
                    playMode={playMode} onToggleMode={togglePlayMode}
                    currentStep={playingStep}
                />

                <div style={{ marginLeft: '12px', borderRight: '1px solid #333', paddingRight: '12px', display: 'flex', alignItems: 'center' }}>
                    <GlobalKeySelector
                        root={project.meta.globalKey?.root || 'C'}
                        scale={project.meta.globalKey?.scale || 'Major'}
                        onChange={(root, scale) => useProjectStore.getState().setGlobalKey(root, scale)}
                    />
                </div>
            </div>

            {/* Center: Project Controls */}
            <div className={styles.centerSection}>

                {/* Project Menu */}
                <DropdownMenu
                    label={t('topbar.menu.project')}
                    icon={<FolderOpen size={16} />}
                    items={[
                        {
                            label: t('topbar.menu.new'),
                            icon: <FilePlus size={16} />,
                            onClick: handleNewProject
                        },
                        {
                            label: t('topbar.menu.open'),
                            icon: <FolderOpen size={16} />,
                            onClick: handleLoadClick
                        },
                        {
                            label: t('topbar.menu.save'),
                            icon: <Save size={16} />,
                            onClick: handleSaveClick
                        },
                        { divider: true, label: 'divider' },
                        {
                            label: t('topbar.menu.export_wav'),
                            icon: <Download size={16} />,
                            onClick: () => showNotification(t('topbar.notifications.wip')),
                            disabled: true
                        }
                    ]}
                />

                {/* Help Menu */}
                <DropdownMenu
                    label={t('topbar.menu.help')}
                    icon={<HelpCircle size={16} />}
                    items={[
                        {
                            label: t('topbar.menu.docs'),
                            icon: <Book size={16} />,
                            onClick: () => globalThis.open('/manual/index.html', '_blank')
                        },
                        {
                            label: t('topbar.menu.about'),
                            icon: <Info size={16} />,
                            onClick: () => setIsAboutModalOpen(true)
                        }
                    ]}
                />


                <span className={styles.projectInfo}>
                    {project.meta.title} {project.backendId ? <span className={styles.badge}>{t('topbar.cloud')}</span> : <span className={`${styles.badge} ${styles.local}`}>{t('topbar.local')}</span>}
                </span>

                {notification && (
                    <div className={styles.notification}>
                        {notification}
                    </div>
                )}
            </div>


            {/* Right: Master Controls & Auth */}
            <div className={styles.rightSection}>
                {/* Global Mix Controls (Compact) */}
                <div className={styles.mixControls}>
                    <MiniKnob value={juicyVolume} onChange={setJuicyVolume} color="#FF5722" label={t('topbar.mix.juicy')} />
                    <MiniKnob value={synthVolume} onChange={setSynthVolume} color="#2196F3" label={t('topbar.mix.synth')} />
                    <div className={styles.masterControl}>
                        {/* Enlarged Master Knob */}
                        <MiniKnob value={masterVolume} onChange={setMasterVolume} color="#4CAF50" label="MASTER" size={40} />
                        <button onClick={() => setMasterMute(!isMasterMuted)} className={styles.muteBtn}>
                            <div className={`${styles.ledContainer} ${!isMasterMuted ? styles.active : ''}`}>
                                <Led active={!isMasterMuted} color="#4CAF50" size={8} />
                            </div>
                        </button>
                    </div>
                </div>

                {/* User Menu / Guest Login */}
                <div className={styles.userSection}>
                    {/* Language Switcher */}
                    <button onClick={toggleLanguage} className={styles.langBtn} title="Switch Language">
                        <Globe size={16} style={{ marginRight: '5px' }} />
                        <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{i18n.language.toUpperCase()}</span>
                    </button>

                    {user ? (
                        <>
                            <div className={styles.userInfo}>
                                <span className={styles.username}>{user.username}</span>
                            </div>
                            <button onClick={() => { logout(); useProjectStore.getState().reset(); }} title={t('topbar.logout')} className={styles.logoutBtn}>
                                <LogOut size={18} />
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setIsLoginModalOpen(true)}
                            className={styles.loginIconBtn}
                            title={t('topbar.login')}
                        >
                            <LogIn size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* --- Modals --- */}

            <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />

            <ConfirmModal
                isOpen={isConfirmNewProjectOpen}
                onClose={() => setIsConfirmNewProjectOpen(false)}
                onConfirm={performNewProjectReset}
                title={t('topbar.modals.confirm_new_title')}
                message={t('topbar.notifications.new_confirm')}
                confirmLabel="Reset Studio"
                isDestructive={true}
            />

            {/* Save Modal */}
            <Modal isOpen={isSaveModalOpen} onClose={() => setIsSaveModalOpen(false)} title={t('topbar.modals.save_title')}>
                <div className={styles.modalForm}>
                    <label>{t('topbar.modals.project_name')}</label>
                    <input
                        value={projectNameInput}
                        onChange={(e) => setProjectNameInput(e.target.value)}
                        autoFocus
                    />
                    <button
                        onClick={confirmCreateProject}
                        className={styles.createBtn}
                    >
                        {t('topbar.modals.create_btn')}
                    </button>
                </div>
            </Modal>

            {/* Load Modal */}
            <Modal isOpen={isLoadModalOpen} onClose={() => { setIsLoadModalOpen(false); setProjectList([]); setVersionList([]); setSelectedProjectId(null); }} title={t('topbar.modals.load_title')}>
                {!selectedProjectId ? (
                    // Step 1: Project List
                    <div className={styles.projectList}>
                        {projectList.length === 0 ? <p style={{ color: '#666', textAlign: 'center' }}>{t('topbar.modals.no_projects')}</p> : projectList.map(proj => (
                            <div key={proj.id} className={styles.projectItem}
                                onClick={async () => {
                                    useLoadingStore.getState().setLoading(true, 'Récupération des versions...');
                                    try {
                                        const versions = await projectService.getProjectVersions(proj.id);
                                        setVersionList(versions);
                                        setSelectedProjectId(proj.id);
                                        // Store name for display
                                        setProjectNameInput(proj.name);
                                    } catch (e) {
                                        console.error(e);
                                        showNotification('Error fetching versions');
                                    } finally {
                                        useLoadingStore.getState().setLoading(false);
                                    }
                                }}
                                role="button"
                                tabIndex={0}
                            >
                                <span style={{ fontWeight: 'bold' }}>{proj.name}</span>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                    {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))}
                    </div>
                ) : (
                    // Step 2: Version List (Drill Down)
                    <div className={styles.versionView}>
                        <div className={styles.versionHeader} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                            <button onClick={() => setSelectedProjectId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                                &larr; Back
                            </button>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>{projectNameInput}</h3>
                        </div>
                        <div className={styles.projectList}>
                            {versionList.map(ver => (
                                <div key={ver.id} className={styles.projectItem}
                                    onClick={() => loadProjectVersion(ver)}
                                    role="button"
                                    tabIndex={0}
                                >
                                    <span style={{ fontWeight: 'bold' }}>v{ver.versionNumber}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                        {new Date(ver.createdAt).toLocaleString()}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </Modal>

            {/* About Modal */}
            <Modal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} title={t('topbar.menu.about')}>
                <div className={styles.aboutContent}>
                    <h2>BOUMBAPP</h2>
                    <p style={{ color: '#aaa', marginBottom: '20px' }}>v0.1.0 (MVP)</p>
                    <p style={{ lineHeight: '1.6', marginBottom: '20px' }}>
                        {t('hero.subtitle')}
                        <br />
                        Built with React, Tone.js & Symfony.
                    </p>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                        &copy; {new Date().getFullYear()} - Boumb'App Studio
                    </div>
                </div>
            </Modal>

        </div>
    );
};

export default TopBar;
