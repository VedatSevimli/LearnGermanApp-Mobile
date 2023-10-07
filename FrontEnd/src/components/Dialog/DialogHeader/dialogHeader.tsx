import React, { ReactNode } from 'react';
import { times } from '../../../images/image';

export type DialogHeaderProps = {
    children: ReactNode;
};

const DialogHeader: React.FC<DialogHeaderProps> = ({ children }) => {
    return (
        <div className="dialog-header">
            <div>
                <img src={times}></img>
            </div>
            {children}
        </div>
    );
};

export default DialogHeader;
