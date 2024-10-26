import React, { useState, useRef, useEffect, CSSProperties } from 'react';
type TruncatedTextP = {
    text: string;
    linesToShow: number;
    lineHeight?: string;
    style?: CSSProperties;
};
export const TruncatedText: React.FC<TruncatedTextP> = ({
    text,
    linesToShow,
    style,
    lineHeight = '1.5em'
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isTruncated, setIsTruncated] = useState(false);

    useEffect(() => {
        if (containerRef.current) {
            const container = containerRef.current;
            const lineHeight = parseFloat(
                getComputedStyle(container).lineHeight
            );
            const maxHeight = lineHeight * linesToShow;

            if (container.scrollHeight > maxHeight) {
                setIsTruncated(true);
            }
        }
    }, [text, linesToShow]);

    return (
        <div
            ref={containerRef}
            style={{
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitBoxOrient: 'vertical',
                textOverflow: 'ellipsis',
                WebkitLineClamp: linesToShow,
                maxHeight: `calc(${linesToShow} * ${lineHeight}`,
                lineHeight: `${lineHeight}`,
                ...style
            }}
        >
            {text}
        </div>
    );
};
