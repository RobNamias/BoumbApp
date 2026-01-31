import React from 'react';
import Modal from './Modal';
import styles from '../../styles/modules/Modal.module.scss';

interface ConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    isDestructive?: boolean;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmLabel = 'Confirm',
    cancelLabel = 'Cancel',
    isDestructive = false
}) => {
    return (
        <Modal isOpen={isOpen} onClose={onClose} title={title}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', padding: '10px 0' }}>
                <p style={{ color: '#ccc', fontSize: '1rem', lineHeight: '1.5', margin: 0 }}>
                    {message}
                </p>

                <div className={styles.modalFooter}>
                    <button
                        onClick={onClose}
                        className={styles.btnCancel}
                    >
                        {cancelLabel}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`${styles.btnConfirm} ${isDestructive ? styles.destructive : ''}`}
                    >
                        {confirmLabel}
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default ConfirmModal;
