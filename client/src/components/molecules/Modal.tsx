import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.8)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            zIndex: 2000
        }}>
            <div style={{
                backgroundColor: '#1e1e1e', padding: '24px', borderRadius: '8px',
                minWidth: '400px', maxWidth: '90%',
                maxHeight: '80vh', overflowY: 'auto',
                border: '1px solid #333', color: '#eee',
                boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
            }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', borderBottom: '1px solid #333', paddingBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem' }}>{title}</h3>
                    <button
                        onClick={onClose}
                        style={{
                            background: 'none', border: 'none', color: '#aaa',
                            cursor: 'pointer', fontSize: '1.2rem', padding: '0 5px'
                        }}
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export default Modal;
