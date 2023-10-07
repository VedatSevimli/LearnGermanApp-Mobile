import React, { useEffect, useState } from 'react';
import './progressBar.scss';

interface ProgressBarProps {
    percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        const timer = setInterval(() => {
            if (progress < percentage) {
                setProgress(progress + 1);
            } else {
                clearInterval(timer);
            }
        }, 10);

        return () => {
            clearInterval(timer);
        };
    }, [progress]);

    return (
        <div className="progress-bar-container">
            <div className="progress-bar">
                <div
                    className="progress"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <span className="percentage-label">{percentage}%</span>
        </div>
    );
};

export default ProgressBar;
