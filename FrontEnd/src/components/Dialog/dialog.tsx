import React, { ReactNode } from 'react';
import './dialog.scss';

export type DialogProps = {
    onDismiss?: () => void;
    style?: any;
    className?: string;
    children?: ReactNode;
};

const Dialog: React.FC<DialogProps> = ({ style, className, children }) => {
    return (
        <div className="dialog-overlay">
            <div className={`dialog ${className}`} style={style}>
                <div className="dialog-content">{children}</div>
            </div>
        </div>
    );
};

export default Dialog;
