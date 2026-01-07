import apiClient from '../api/client';

export interface LoginResponse {
    token: string;
}

export const authService = {
    login: async (email: string, password: string): Promise<LoginResponse> => {
        const response = await apiClient.post<LoginResponse>('/login_check', { email, password });
        return response.data;
    },

    register: async (email: string, password: string, username: string) => {
        const response = await apiClient.post('/users', { email, plainPassword: password, username }, {
            headers: { 'Content-Type': 'application/ld+json' }
        });
        return response.data;
    }
};
