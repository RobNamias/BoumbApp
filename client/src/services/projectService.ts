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

    getLatestVersion: async (projectId: string): Promise<any | null> => {
        const projects = read();
        const project = projects.find((p: any) => p.id === projectId);
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

    saveVersion: async (projectId: string, data: ProjectData) => {
        const projects = read();
        const idx = projects.findIndex((p: any) => p.id === projectId);

        if (idx >= 0) {
            projects[idx] = { ...projects[idx], data, updatedAt: Date.now() };
            write(projects);
        } else {
            // Should not happen if flow is correct, but safe fallback
            projects.unshift({ id: projectId, name: 'Untitled', data, updatedAt: Date.now() });
            write(projects);
        }

        console.log('[LITE] Fake saveVersion', { projectId, data });
        return 2; // fake next version number
    }
};

