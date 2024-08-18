import React, { ReactNode } from 'react';
import { times } from '../../../images/image';

export type DialogHeaderProps = {
    children: ReactNode;
    onDismiss: () => void;
};

const DialogHeader: React.FC<DialogHeaderProps> = ({ onDismiss, children }) => {
    return (
        <div className="dialog-header">
            <div>
                {children}
                <img onClick={() => onDismiss()} src={times}></img>
            </div>
        </div>
    );
};

export default DialogHeader;
