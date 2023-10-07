import React, { ReactNode } from 'react';

export type DialogBodyProps = {
    children: ReactNode;
};

const DialogBody: React.FC<DialogBodyProps> = ({ children }) => {
    return <div className="dialog-body">{children}</div>;
};

export default DialogBody;
