import React from 'react';
import './LoadingSpinner.scss';

interface Props {
    isLoading: boolean;
    message?: string;
    small?: boolean;
    big?: boolean;
}

const LoadingSpinner: React.FC<Props> = ({ isLoading, small, message }) => {
    let additionalClass = '';
    if (small) {
        additionalClass = 'small';
    } else {
        additionalClass = 'big';
    }
    return isLoading ? (
        <div className="loading-spinner">
            <div className={`spinner ${additionalClass}`}></div>
            {message ? <div className="message">{message}</div> : null}
        </div>
    ) : null;
};

export default LoadingSpinner;
