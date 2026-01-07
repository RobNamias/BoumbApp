import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Nettoyer le DOM après chaque test
afterEach(() => {
    cleanup();
});
