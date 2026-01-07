import React from 'react';
import '../../styles/components/_led.scss';

export interface LedProps extends React.HTMLAttributes<HTMLDivElement> {
    active?: boolean;
    color?: string;
    size?: number | string;
}

const Led: React.FC<LedProps> = ({ active = false, color, size = 12, className = '', style, ...props }) => {
    const combinedStyle: React.CSSProperties = {
        width: size,
        height: size,
        ...style,
        ...(color && { '--led-color': color } as React.CSSProperties),
    };

    return (
        <div
            className={`led ${active ? 'led--active' : ''} ${className}`}
            style={combinedStyle}
            {...props}
        />
    );
};

export default Led;
