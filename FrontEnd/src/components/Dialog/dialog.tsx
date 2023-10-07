import React, { ReactNode, useState } from 'react';
import './Dialog.scss';

export type DialogProps = {
    onDismiss: () => void;
    style: any;
    className: string;
    children: ReactNode;
};

const Dialog: React.FC<DialogProps> = ({
    onDismiss,
    style,
    className,
    children
}) => {
    return (
        <div className={`dialog ${className}`} style={style}>
            <div className="dialog-content">{children}</div>
            <button className="dismiss-button" onClick={onDismiss}>
                Close
            </button>
        </div>
    );
};

export default Dialog;
