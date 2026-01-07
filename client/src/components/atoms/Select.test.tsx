import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Select from './Select';

describe('Select Atom', () => {
    const options = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
    ];

    it('renders with label and options', () => {
        render(<Select label="Test Select" options={options} value="option1" onChange={() => { }} />);
        expect(screen.getByText('Test Select')).toBeInTheDocument();
        // Check display value might depend on browser implementation of select, usually option text is visible
        // getByDisplayValue works for inputs/selects
        expect(screen.getByDisplayValue('Option 1')).toBeInTheDocument();
        expect(screen.getAllByRole('option')).toHaveLength(2);
    });

    it('calls onChange when selection changes', () => {
        const handleChange = vi.fn();
        render(<Select options={options} value="option1" onChange={handleChange} />);

        fireEvent.change(screen.getByRole('combobox'), { target: { value: 'option2' } });
        expect(handleChange).toHaveBeenCalledWith('option2');
    });

    it('is disabled when disabled prop is true', () => {
        render(<Select options={options} value="option1" onChange={() => { }} disabled />);
        expect(screen.getByRole('combobox')).toBeDisabled();
    });
});
