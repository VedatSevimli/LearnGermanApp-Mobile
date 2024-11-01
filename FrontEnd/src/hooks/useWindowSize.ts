import React, { useEffect, useState } from 'react';

export const useWindowSize = (): { width: number; height: number } => {
    const [windowSize, setWindowSize] = useState({
        width: 0,
        height: 0
    });

    useEffect(() => {
        const onResize = () => {
            setWindowSize({ width: innerWidth, height: innerHeight });
        };

        window.addEventListener('resize', onResize);

        onResize();

        return () => window.removeEventListener('resize', onResize);
    }, []);

    return windowSize;
};
