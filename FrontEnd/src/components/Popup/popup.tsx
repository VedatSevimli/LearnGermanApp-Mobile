import React, { ReactNode } from 'react';
import './popup.scss';

export type PopupProps = {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
    className?: string;
};

export const Popup: React.FC<PopupProps> = ({
    isOpen,
    onClose,
    children,
    ...props
}) => {
    if (!isOpen) {
        return null;
    }

    return (
        <div className="popup-overlay">
            <div className={`popup ${props.className}`}>
                <button className="close-button" onClick={onClose}>
                    X
                </button>
                <div className="popup-content">{children}</div>
            </div>
        </div>
    );
};
