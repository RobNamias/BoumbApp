import type { ProjectData } from '../store/projectStore';

const LS_KEY = 'lite_projects_v1';

function read() {
    try { return JSON.parse(localStorage.getItem(LS_KEY) || '[]'); }
    catch { return []; }
}

function write(data: any[]) {
    localStorage.setItem(LS_KEY, JSON.stringify(data));
}

export interface ProjectSummary {
    id: string; // Changed to string for UUID
    name: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
}

export const projectService = {
    getAllProjects: async (): Promise<ProjectSummary[]> => {
        return read();
    },

    getLatestVersion: async (projectId: string | number): Promise<any | null> => {
        const projects = read();
        const project = projects.find((p: any) => p.id === String(projectId));
        // In our simplified mock, the project directly contains the data or the latest version data
        // Let's assume the project structure in LS stores the latest 'data' directly or in a versions array.
        // For this simple mock, let's assume 'data' is top level or we return the project itself if it matches structure.
        // However, the original code expects a Version object.
        if (!project) return null;

        return {
            id: 1,
            versionNumber: 1,
            data: project.data,
            createdAt: new Date(project.updatedAt).toISOString()
        };
    },

    getProjectVersions: async (projectId: string | number): Promise<any[]> => {
        const projects = read();
        const project = projects.find((p: any) => p.id === String(projectId));
        if (!project) return [];
        // Return a single version representing the current state
        return [{
            id: 1,
            versionNumber: 1,
            data: project.data,
            createdAt: new Date(project.updatedAt).toISOString()
        }];
    },

    createProject: async (name: string, data: ProjectData) => {
        const projects = read();
        const newProject = {
            id: crypto.randomUUID?.() ?? String(Date.now()),
            name,
            isPublic: false,
            data: data, // Store data directly for simplicity
            createdAt: new Date().toISOString(),
            updatedAt: Date.now(),
        };
        projects.unshift(newProject);
        write(projects);
        return newProject;
    },

    saveVersion: async (projectId: string | number, data: ProjectData) => {
        const projects = read();
        const idx = projects.findIndex((p: any) => p.id === String(projectId));

        if (idx >= 0) {
            projects[idx] = { ...projects[idx], data, updatedAt: Date.now() };
            write(projects);
        } else {
            projects.unshift({ id: projectId, name: 'Untitled', data, updatedAt: Date.now() });
            write(projects);
        }

        console.log('Project saved locally', { projectId });
        return 2; // Stub version number
    },

    exportProjectToJSON: async (project: any) => {
        const fileName = `${project.meta.title || 'project'}.json`;
        const jsonStr = JSON.stringify(project, null, 2);

        try {
            // @ts-ignore
            if (globalThis.showSaveFilePicker) {
                // @ts-ignore
                const handle = await globalThis.showSaveFilePicker({
                    suggestedName: fileName,
                    types: [{
                        description: 'BoumbApp Project',
                        accept: { 'application/json': ['.json'] },
                    }],
                });
                const writable = await handle.createWritable();
                await writable.write(jsonStr);
                await writable.close();
                return;
            }
        } catch (err: any) {
            if (err.name === 'AbortError') return; // User cancelled
            console.warn('File System Access API failed, falling back to download', err);
        }

        // Fallback
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(jsonStr);
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", fileName);
        document.body.appendChild(downloadAnchorNode); // required for firefox
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    },

    validateProjectData: (data: any): boolean => {
        // Basic schema validation
        if (!data || typeof data !== 'object') return false;
        // Check for critical top-level properties
        if (!data.meta || typeof data.meta !== 'object') return false;
        if (!data.tracks || typeof data.tracks !== 'object') return false;
        if (!data.drumPatterns || typeof data.drumPatterns !== 'object') return false;

        // Optional: Check version compatibility
        // if (data.version && data.version > CURRENT_VERSION) return false;

        return true;
    }
};

