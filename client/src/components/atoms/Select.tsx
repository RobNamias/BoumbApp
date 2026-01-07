import React, { type ChangeEvent } from 'react';
import '../../styles/components/_select.scss'; // Assuming style file exists or will be generic

export interface SelectOption {
    label: string;
    value: string | number;
}

export interface SelectProps {
    options?: SelectOption[];
    value?: string | number;
    onChange: (value: string | number) => void;
    label?: string;
    disabled?: boolean;
    className?: string; // Standard prop often passed
}

/**
 * Select Atom
 * Simple wrapper around native select for styling consistency.
 */
const Select: React.FC<SelectProps> = ({
    options = [],
    value,
    onChange,
    label,
    disabled = false,
    className = ''
}) => {
    const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onChange(e.target.value);
    };

    return (
        <div className={`select-container ${className}`}>
            {label && <label className="select-label">{label}</label>}
            <select
                className="select-input"
                value={value}
                onChange={handleChange}
                disabled={disabled}
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default Select;
