
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ConfirmModal from './ConfirmModal';
import { describe, it, expect, vi } from 'vitest';

describe('ConfirmModal', () => {
    const defaultProps = {
        isOpen: true,
        onClose: vi.fn(),
        onConfirm: vi.fn(),
        title: 'Confirm Action',
        message: 'Are you sure?',
        confirmLabel: 'Yes',
        cancelLabel: 'No'
    };

    it('renders correctly when open', () => {
        render(<ConfirmModal {...defaultProps} />);

        expect(screen.getByText('Confirm Action')).toBeInTheDocument();
        expect(screen.getByText('Are you sure?')).toBeInTheDocument();
        expect(screen.getByText('Yes')).toBeInTheDocument();
        expect(screen.getByText('No')).toBeInTheDocument();
    });

    it('does not render when closed', () => {
        render(<ConfirmModal {...defaultProps} isOpen={false} />);

        expect(screen.queryByText('Confirm Action')).not.toBeInTheDocument();
    });

    it('calls onConfirm when confirm button is clicked', () => {
        render(<ConfirmModal {...defaultProps} />);

        fireEvent.click(screen.getByText('Yes'));
        expect(defaultProps.onConfirm).toHaveBeenCalled();
    });

    it('calls onClose when cancel button is clicked', () => {
        render(<ConfirmModal {...defaultProps} />);

        fireEvent.click(screen.getByText('No'));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });
});
