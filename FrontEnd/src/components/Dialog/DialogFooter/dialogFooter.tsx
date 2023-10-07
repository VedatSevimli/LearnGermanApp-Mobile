import React, { ReactNode } from 'react';
import Button from '../../Button/buttons';

export type DialogFooter = {
    children: ReactNode;
    onDismiss: () => void;
};

const DialogFooter: React.FC<DialogFooter> = ({ children, onDismiss }) => {
    return (
        <div className="dialog-footer">
            <Button onClick={onDismiss}>Ok</Button>
            {children}
        </div>
    );
};

export default DialogFooter;
