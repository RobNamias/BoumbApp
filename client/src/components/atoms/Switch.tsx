import React from 'react';
import '../../styles/components/_switch.scss';

export interface SwitchProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onChange'> {
    checked?: boolean;
    onChange?: (checked: boolean) => void;
    label?: string;
}

const Switch: React.FC<SwitchProps> = ({ checked = false, onChange, label, className = '', ...props }) => {
    return (
        <button
            type="button"
            className={`switch ${className}`}
            role="switch"
            aria-checked={checked}
            onClick={() => onChange?.(!checked)}
            aria-label={label}
            {...props}
        >
            <div className="switch__track">
                <div className={`switch__thumb ${checked ? 'switch__thumb--checked' : ''}`} />
            </div>
            {label && <span className="switch__label">{label}</span>}
        </button>
    );
};

export default Switch;
