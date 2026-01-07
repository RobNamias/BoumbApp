

import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import AIComposerPopover from './AIComposerPopover';

// Mock Lucide icons if needed, but usually they render fine.
// Mock Store if component connects immediately.

describe('AIComposerPopover', () => {
    it('renders without crashing', () => {
        // Mock handlers
        const onClose = vi.fn();
        const onGenerated = vi.fn();

        render(
            <AIComposerPopover
                onClose={onClose}
                onGenerated={onGenerated}
                triggerRef={{ current: document.createElement('button') }}
            />
        );

        // Assert basic elements (Textarea, Generate Button)
        expect(screen.getByPlaceholderText(/describe your melody/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument();
    });
});
