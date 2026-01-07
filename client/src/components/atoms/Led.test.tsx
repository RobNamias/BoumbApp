import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Led from './Led';

describe('Led Atom', () => {
    it('renders with default class', () => {
        const { container } = render(<Led />);
        expect(container.firstChild).toHaveClass('led');
    });

    it('applies active class when active prop is true', () => {
        const { container } = render(<Led active={true} />);
        expect(container.firstChild).toHaveClass('led--active');
    });

    it('applies custom color style', () => {
        const { container } = render(<Led color="#ff0000" />);
        expect(container.firstChild).toHaveStyle({ '--led-color': '#ff0000' });
    });
});
