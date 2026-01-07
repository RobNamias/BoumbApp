import apiClient from '../api/client';
import type { ProjectData } from '../store/projectStore';

export interface ProjectSummary {
    id: number;
    name: string;
    isPublic: boolean;
    createdAt: string;
    updatedAt: string;
    // Owner info if needed
}

export interface ProjectVersion {
    id: number;
    versionNumber: number;
    data: ProjectData;
    createdAt: string;
}

export const projectService = {
    // 1. Get All Projects (for Load Modal)
    getAllProjects: async (): Promise<ProjectSummary[]> => {
        const response = await apiClient.get<any>('/projects', {
            headers: { 'Accept': 'application/ld+json' }
        });
        const data = response.data;
        if (data && (data['hydra:member'] || data['member'])) {
            return data['hydra:member'] || data['member'];
        }
        return Array.isArray(response.data) ? response.data : [];
    },

    // 2. Get Specific Project Version (Load Logic)
    // For now we get the LATEST version.
    // Ideally backend exposes /projects/{id}/latest-version or we fetch versions list.
    // Let's assume we fetch project details which includes versions.
    getProjectDetails: async (id: number) => {
        const response = await apiClient.get<any>(`/projects/${id}`);
        // API Platform usually returns versions collection IRI.
        // We might need a custom endpoint or expand the request.
        return response.data;
    },

    // For MVP: We fetch all versions of a project to load the last one.
    getLatestVersion: async (projectId: number): Promise<ProjectVersion | null> => {
        // This query might need adjustment based on how API Platform filters.
        // /project_versions?project=1&order[versionNumber]=desc&page=1
        const response = await apiClient.get<any>('/project_versions', {
            params: {
                project: projectId,
                'order[versionNumber]': 'desc',
                page: 1,
                itemsPerPage: 1
            }
        });

        const data = response.data;
        const versions = (data && (data['hydra:member'] || data['member'])) ? (data['hydra:member'] || data['member']) : [];
        if (versions.length > 0) return versions[0];
        return null;
    },

    // 2.5 Get All Versions for a Project
    getProjectVersions: async (projectId: number): Promise<ProjectVersion[]> => {
        const response = await apiClient.get<any>('/project_versions', {
            params: {
                project: projectId,
                'order[versionNumber]': 'desc'
            }
        });
        const data = response.data;
        return (data && (data['hydra:member'] || data['member'])) ? (data['hydra:member'] || data['member']) : [];
    },

    // 3. Create New Project
    createProject: async (name: string, data: ProjectData) => {
        // A. Create Project Container
        const projectRes = await apiClient.post<ProjectSummary>('/projects', {
            name: name,
            isPublic: false
        }, {
            headers: { 'Content-Type': 'application/ld+json' }
        });
        const newProject = projectRes.data;

        // B. Create Initial Version
        await apiClient.post('/project_versions', {
            project: `/api/projects/${newProject.id}`,
            versionNumber: 1,
            data: data
        }, {
            headers: { 'Content-Type': 'application/ld+json' }
        });

        return newProject;
    },

    // 4. Save New Version (Update)
    saveVersion: async (projectId: number, data: ProjectData) => {
        // We catch the latest version number first to increment it?
        // Or backend handles auto-increment.
        // Custom logic: Get max version.
        const latest = await projectService.getLatestVersion(projectId);
        const nextVersion = (latest?.versionNumber || 0) + 1;

        await apiClient.post('/project_versions', {
            project: `/api/projects/${projectId}`,
            versionNumber: nextVersion,
            data: data
        }, {
            headers: { 'Content-Type': 'application/ld+json' }
        });

        return nextVersion;
    }
};
