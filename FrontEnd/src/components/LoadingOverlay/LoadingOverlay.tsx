import React from 'react';
import './LoadingOverlay.scss';

export const LoadingOverlay: React.FC = (): JSX.Element => {
    return (
        <div className="loading-overlay">
            <div className="loading-spinner">
                <div className="spinner-inner"></div>
            </div>
        </div>
    );
};
