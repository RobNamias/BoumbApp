type AuthResult = {
    user: { username: string };
    token: string;
};

export const authService = {
    login: async (_email: string, _password: string): Promise<AuthResult> => {
        return { user: { username: 'Guest' }, token: 'fake-token' };
    },

    register: async (_username: string, _email: string, _password: string): Promise<AuthResult> => {
        return { user: { username: 'Guest' }, token: 'fake-token' };
    }
};

