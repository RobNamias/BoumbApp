import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

interface DropdownItem {
    label: string;
    icon?: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    divider?: boolean;
}

interface DropdownMenuProps {
    label: string;
    items: DropdownItem[];
    icon?: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ label, items, icon }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close on click outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleItemClick = (item: DropdownItem) => {
        if (item.disabled || item.divider) return;
        if (item.onClick) item.onClick();
        setIsOpen(false);
    };

    return (
        <div ref={containerRef} style={{ position: 'relative' }}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#e1e1e6',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '8px 12px',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    fontWeight: 500,
                    transition: 'background 0.2s',
                    backgroundColor: isOpen ? 'rgba(255, 255, 255, 0.1)' : 'transparent'
                }}
                onMouseOver={(e) => { if (!isOpen) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
                onFocus={(e) => { if (!isOpen) e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'; }}
                onMouseOut={(e) => { if (!isOpen) e.currentTarget.style.backgroundColor = 'transparent'; }}
                onBlur={(e) => { if (!isOpen) e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
                {icon}
                {label}
                <ChevronDown size={14} style={{ opacity: 0.7 }} />
            </button>

            {isOpen && (
                <div style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    minWidth: '180px',
                    backgroundColor: '#252525',
                    border: '1px solid #333',
                    borderRadius: '4px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                    padding: '5px 0',
                    zIndex: 1000,
                    marginTop: '5px'
                }}>
                    {items.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.divider ? (
                                <div style={{ height: '1px', background: '#333', margin: '5px 0' }} />
                            ) : (
                                <button
                                    onClick={() => handleItemClick(item)}
                                    disabled={item.disabled}
                                    style={{
                                        width: '100%',
                                        textAlign: 'left',
                                        background: 'transparent',
                                        border: 'none',
                                        color: item.disabled ? '#666' : '#e1e1e6',
                                        padding: '8px 15px',
                                        fontSize: '0.85rem',
                                        cursor: item.disabled ? 'default' : 'pointer',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        transition: 'background 0.1s'
                                    }}
                                    onMouseOver={(e) => { if (!item.disabled) e.currentTarget.style.backgroundColor = '#333'; }}
                                    onFocus={(e) => { if (!item.disabled) e.currentTarget.style.backgroundColor = '#333'; }}
                                    onMouseOut={(e) => { if (!item.disabled) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                    onBlur={(e) => { if (!item.disabled) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                >
                                    {item.icon && <span style={{ opacity: 0.8 }}>{item.icon}</span>}
                                    {item.label}
                                </button>
                            )}
                        </React.Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default DropdownMenu;
