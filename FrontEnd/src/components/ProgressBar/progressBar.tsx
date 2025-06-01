import React, { useEffect, useState } from 'react';
import './progressBar.scss';

interface ProgressBarProps {
    percentage: number;
    type?: 'bar' | 'circle';
    size?: number; // for circle size
}

const ProgressBar: React.FC<ProgressBarProps> = ({
    percentage,
    type = 'bar',
    size = 60
}) => {
    const [progress, setProgress] = useState<number>(0);

    useEffect(() => {
        const timer = setInterval(() => {
            if (progress < percentage) {
                setProgress((prev) => Math.min(prev + 1, percentage));
            } else {
                clearInterval(timer);
            }
        }, 10);

        return () => {
            clearInterval(timer);
        };
    }, [percentage, progress]);

    if (type === 'circle') {
        const strokeWidth = 6;
        const radius = (size - strokeWidth) / 2;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset =
            circumference - (progress / 100) * circumference;

        return (
            <div
                className="progress-circle"
                style={{ width: size, height: size }}
            >
                <svg width={size} height={size}>
                    <circle
                        className="progress-bg"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                    />
                    <circle
                        className="progress-fg"
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                    />
                </svg>
                <span className="circle-label">
                    {progress ? `${progress}%` : `🔒`}
                </span>
            </div>
        );
    }

    // Default horizontal bar
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
