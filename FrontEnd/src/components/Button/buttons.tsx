import React from 'react';
import './button.scss';

interface ButtonProps {
    onClick: () => void;
    type?: 'primary' | 'secondary' | 'danger';
    disabled?: boolean;
    className?: string;
    children: React.ReactNode;
    style?: React.CSSProperties;
}

const Button: React.FC<ButtonProps> = ({
    onClick,
    type = 'primary',
    disabled = false,
    className,
    style,
    children
}) => {
    const buttonClasses = `button button-${type} ${className ? className : ''}`;

    return (
        <button
            style={style}
            className={buttonClasses}
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    );
};

export default Button;
