import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { useProjectStore } from '../../store/projectStore';
import { useLoadingStore } from '../../store/loadingStore';
import { projectService, type ProjectSummary } from '../../services/projectService';
import TransportControls from '../molecules/TransportControls';
import Knob from '../atoms/Knob';
import Led from '../atoms/Led';
import Modal from '../molecules/Modal';
import ConfirmModal from '../molecules/ConfirmModal';
import PromptModal from '../molecules/PromptModal';
import DropdownMenu from '../molecules/DropdownMenu';
import { Save, FolderOpen, Globe, FilePlus, Download, HelpCircle, Book, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useKeyboardShortcuts } from '../../hooks/useKeyboardShortcuts';
import styles from '../../styles/modules/TopBar.module.scss';
import modalStyles from '../../styles/modules/Modal.module.scss';
import GlobalKeySelector from '../molecules/GlobalKeySelector';
import { ExportManager } from '../../services/ExportManager';


// Internal Components styles
// Removed btnStyle and badgeStyle as they are now in SCSS

const MiniKnob = ({ value, onChange, color, label, size = 28 }: any) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
        <Knob value={value * 100} onChange={(v: number) => onChange(v / 100)} size={size} min={0} max={100} color={color} />
        <span style={{ fontSize: '9px', color: '#666', textTransform: 'uppercase' }}>{label}</span>
    </div>
);

interface TopBarProps {
    isRecording?: boolean;
    onRecord?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ isRecording, onRecord }) => {
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


    // Local State for Modals
    const [isLoadModalOpen, setIsLoadModalOpen] = useState(false);
    const [isAboutModalOpen, setIsAboutModalOpen] = useState(false);
    const [isConfirmNewProjectOpen, setIsConfirmNewProjectOpen] = useState(false);

    // Prompt Modals (Save & Export)
    const [isSavePromptOpen, setIsSavePromptOpen] = useState(false);
    const [isExportPromptOpen, setIsExportPromptOpen] = useState(false);
    const [defaultPromptValue, setDefaultPromptValue] = useState('');

    const [projectList, setProjectList] = useState<ProjectSummary[]>([]);
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
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

    const handleSaveClick = () => {
        // Prepare default name
        setDefaultPromptValue(project.meta.title || 'My Song');
        setIsSavePromptOpen(true);
    };

    const handleExportClick = () => {
        setDefaultPromptValue(project.meta.title || 'My Song');
        setIsExportPromptOpen(true);
    };

    // ... Keyboard shortcuts
    useKeyboardShortcuts({
        onSave: handleSaveClick
    });

    const confirmSaveProject = async (name: string) => {
        if (!name) return;

        useLoadingStore.getState().setLoading(true, 'Saving...');
        try {
            // Update Store Name first
            const updatedProject = {
                ...project,
                meta: { ...project.meta, title: name }
            };

            setProject(updatedProject); // Update local store

            // Trigger enhanced export (Modal/File Picker)
            await projectService.exportProjectToJSON(updatedProject);

            showNotification(t('topbar.notifications.saved', { version: 'JSON' }));
        } catch (e) {
            console.error(e);
            showNotification("Save failed");
        } finally {
            useLoadingStore.getState().setLoading(false);
            setIsSavePromptOpen(false);
        }
    };

    const confirmExportWav = async (name: string) => {
        if (!name) return;

        useLoadingStore.getState().setLoading(true, 'Exporting WAV...');
        try {
            await ExportManager.exportOfflineProject(project, name);
            showNotification(t('topbar.notifications.saved', { version: 'WAV' }));
        } catch (e) {
            console.error(e);
            showNotification("Export failed");
        } finally {
            useLoadingStore.getState().setLoading(false);
            setIsExportPromptOpen(false);
        }
    };



    const loadProjectVersion = (version: any) => {
        useLoadingStore.getState().setLoading(true, 'Chargement du projet...');
        try {
            if (version?.data) {
                const restoredData = { ...version.data, backendId: selectedProjectId };
                setProject(restoredData);
                if (restoredData.meta?.bpm) {
                    setBpm(restoredData.meta.bpm);
                }

                setIsLoadModalOpen(false);
                setSelectedProjectId(null);
                setVersionList([]);
                showNotification(t('topbar.notifications.loaded', { name: restoredData.meta.title || 'Project', version: version.versionNumber }));
                // Stop playback to avoid glitches                stop();
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

    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const handleFileLoad = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const text = await file.text();
            const json = JSON.parse(text);

            // Validate Schema
            if (!projectService.validateProjectData(json)) {
                showNotification("Invalid Project File");
                return;
            }

            // Security/Sanity Check: Ensure project ID is present or regenerate
            const secureProject = {
                ...json,
                backendId: json.backendId || Date.now().toString() // Use file ID or generate temp
            };

            // Load into Store
            useLoadingStore.getState().setLoading(true, 'Chargement du fichier...');

            // Simulate delay for effect
            await new Promise(r => setTimeout(r, 500));

            setProject(secureProject);
            if (secureProject.meta?.bpm) {
                setBpm(secureProject.meta.bpm);
            }

            showNotification(t('topbar.notifications.loaded', { name: secureProject.meta?.title || 'Project', version: 'File' }));

        } catch (err) {
            console.error("File load error", err);
            showNotification("Error loading file");
        } finally {
            useLoadingStore.getState().setLoading(false);
            // Reset input
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const loadVersions = async (projId: string, name?: string) => {
        useLoadingStore.getState().setLoading(true, 'Récupération des versions...');
        try {
            const versions = await projectService.getProjectVersions(projId);
            setVersionList(versions);
            setSelectedProjectId(projId);
            setDefaultPromptValue(name || ''); // Set default prompt value for version view header
        } catch (e) {
            console.error(e);
            showNotification('Error fetching versions');
        } finally {
            useLoadingStore.getState().setLoading(false);
        }
    };

    return (
        <div className={styles.topBar}>
            {/* Hidden File Input for Load */}
            <input
                type="file"
                accept=".json"
                ref={fileInputRef}
                style={{ display: 'none' }}
                onChange={(e) => void handleFileLoad(e)}
            />

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
                    isRecording={isRecording}
                    onRecord={onRecord}
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
                            onClick: () => fileInputRef.current?.click()
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
                            onClick: handleExportClick,
                            disabled: false
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
                            onClick: () => {
                                const lang = i18n.language || 'en';
                                globalThis.open(`${import.meta.env.BASE_URL}manual/${lang}/index.html`, '_blank');
                            }
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
                            <div className={`${styles.ledContainer} ${isMasterMuted ? '' : styles.active}`}>
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

                    <div className={styles.userInfo}>
                        <span className={styles.username}>Local Studio</span>
                    </div>
                </div>
            </div>

            {/* --- Modals --- */}

            <ConfirmModal
                isOpen={isConfirmNewProjectOpen}
                onClose={() => setIsConfirmNewProjectOpen(false)}
                onConfirm={performNewProjectReset}
                title={t('topbar.modals.confirm_new_title')}
                message={t('topbar.notifications.new_confirm')}
                confirmLabel="Reset Studio"
                isDestructive={true}
            />

            {/* Save Prompt */}
            <PromptModal
                isOpen={isSavePromptOpen}
                onClose={() => setIsSavePromptOpen(false)}
                onConfirm={confirmSaveProject}
                title={t('topbar.menu.save')}
                message={t('topbar.modals.project_name')}
                defaultValue={defaultPromptValue}
                confirmLabel={t('topbar.menu.save_to_disk') || 'Save'}
            />

            {/* Export Prompt */}
            <PromptModal
                isOpen={isExportPromptOpen}
                onClose={() => setIsExportPromptOpen(false)}
                onConfirm={confirmExportWav}
                title={t('topbar.menu.export_wav')}
                message="Choose a filename for your WAV export:"
                defaultValue={defaultPromptValue}
                confirmLabel={t('topbar.menu.export_wav') || 'Export'}
            />

            {/* Load Modal */}
            <Modal isOpen={isLoadModalOpen} onClose={() => { setIsLoadModalOpen(false); setProjectList([]); setVersionList([]); setSelectedProjectId(null); }} title={t('topbar.modals.load_title')}>
                {selectedProjectId ? (
                    // Step 2: Version List (Drill Down)
                    <div className={modalStyles.versionView}>
                        <div className={modalStyles.versionHeader} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' }}>
                            <button onClick={() => setSelectedProjectId(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#888' }}>
                                &larr; Back
                            </button>
                            <h3 style={{ margin: 0, fontSize: '1rem' }}>{defaultPromptValue}</h3>
                        </div>
                        <div className={modalStyles.projectList}>
                            {versionList.map(ver => (
                                <button key={ver.id} className={modalStyles.projectItem}
                                    onClick={() => loadProjectVersion(ver)}
                                    type="button"
                                >
                                    <span style={{ fontWeight: 'bold' }}>v{ver.versionNumber}</span>
                                    <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                        {new Date(ver.createdAt).toLocaleString()}
                                    </span>
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    // Step 1: Project List
                    <div className={modalStyles.projectList}>
                        {projectList.length === 0 ? <p style={{ color: '#666', textAlign: 'center' }}>{t('topbar.modals.no_projects')}</p> : projectList.map(proj => (
                            <button key={proj.id} className={modalStyles.projectItem}
                                onClick={() => void loadVersions(proj.id, proj.name)}
                                type="button"
                            >
                                <span style={{ fontWeight: 'bold' }}>{proj.name}</span>
                                <span style={{ fontSize: '0.8rem', color: '#666' }}>
                                    {new Date(proj.updatedAt || proj.createdAt).toLocaleDateString()}
                                </span>
                            </button>
                        ))}
                    </div>
                )}
            </Modal>

            {/* About Modal */}
            <Modal isOpen={isAboutModalOpen} onClose={() => setIsAboutModalOpen(false)} title={t('topbar.menu.about')}>
                <div className={modalStyles.aboutContent}>
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
