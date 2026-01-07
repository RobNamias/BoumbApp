import React from 'react';
import '../../styles/components/_button.scss';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    icon?: React.ReactNode;
    label?: string; // Optional redundancy with children, keeping for compatibility if needed, but children is preferred
    children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    variant = 'primary',
    size = 'md',
    icon,
    className = '',
    children,
    label,
    ...props
}) => {
    const baseClass = 'btn';
    const variantClass = `btn--${variant}`;
    const sizeClass = `btn--${size}`;

    // Determine content: children takes precedence, then label
    const content = children || label;

    return (
        <button
            className={`${baseClass} ${variantClass} ${sizeClass} ${className}`}
            {...props}
        >
            {icon && <span className="btn__icon">{icon}</span>}
            {content && <span className="btn__label">{content}</span>}
        </button>
    );
};

export default Button;
