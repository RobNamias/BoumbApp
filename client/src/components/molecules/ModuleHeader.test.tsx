import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ModuleHeader from './ModuleHeader';
import { Citrus } from 'lucide-react';
import React from 'react';

describe('ModuleHeader Component', () => {
    it('renders title and icon correctly', () => {
        render(
            <ModuleHeader
                title="Test Module"
                icon={Citrus}
                color="#ff0000"
            />
        );

        // Check Title
        expect(screen.getByText('Test Module')).toBeInTheDocument();

        // Check Icon (Lucide renders SVGs, we can check for SVG presence or class if we add one)
        // Simple check: the container should likely contain the svg
        const header = screen.getByText('Test Module').closest('div'); // Assuming header container
        expect(header?.innerHTML).toContain('<svg');
    });

    it('renders children (toolbar content)', () => {
        render(
            <ModuleHeader
                title="Test Module"
                icon={Citrus}
                color="#ff0000"
            >
                <button>Action Button</button>
            </ModuleHeader>
        );

        expect(screen.getByRole('button', { name: 'Action Button' })).toBeInTheDocument();
    });

    it('applies color style', () => {
        const testColor = '#123456';
        render(
            <ModuleHeader
                title="Colored Module"
                icon={Citrus}
                color={testColor}
            />
        );

        const titleElement = screen.getByText('Colored Module');
        // We expect the color to be applied either to the text or parent
        // Let's assume title text color for now based on previous designs
        expect(titleElement).toHaveStyle({ color: testColor });
    });
});
