import React, { ReactNode } from 'react';
import { times } from '../../../images/image';

export type DialogHeaderProps = {
    children: ReactNode;
    onDismiss: () => void;
};

const DialogHeader: React.FC<DialogHeaderProps> = ({ onDismiss, children }) => {
    return (
        <div className="dialog-header">
            <div onClick={() => onDismiss()}>
                {children}
                <img src={times}></img>
            </div>
        </div>
    );
};

export default DialogHeader;
