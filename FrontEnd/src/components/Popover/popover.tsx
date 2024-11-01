import React, {
    CSSProperties,
    useCallback,
    useLayoutEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import useResizeObserver from 'use-resize-observer';
import { useWindowSize } from '../../hooks/useWindowSize';
import useClickOutside from '../common/hooks/useClickOutside';
import './popover.scss';

export type BaseProps = {
    style?: CSSProperties;
    className?: string;
    children?: React.ReactNode;
};

type PopoverProps = {
    onResizePopover?: (
        dimension: { width: number | undefined; height: number | undefined },
        rect?: DOMRect
    ) => void;
    onPopoverRender?: (rect?: DOMRect) => void;
    onDismiss: () => void;
    isOpen: boolean;
    autoPosition?: boolean;
} & BaseProps;

export const Popover: React.FC<PopoverProps> = ({
    onResizePopover,
    onPopoverRender,
    onDismiss,
    isOpen,
    autoPosition,
    className = '',
    style = {},
    children
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const size = useWindowSize();

    // Set the horizontal and vertical dock states
    const [horizontalDock, setHorizontalDock] = useState<
        'left' | 'right' | null
    >(null);
    const [verticalDock, setVerticalDock] = useState<'top' | 'bottom' | null>(
        null
    );

    // Handle resizing and updating the popover position
    useResizeObserver<HTMLDivElement>({
        ref: containerRef,
        onResize: (dimension) => {
            if (onResizePopover) {
                const rect =
                    containerRef.current?.parentElement?.getBoundingClientRect();
                onResizePopover(dimension, rect);
            }
        }
    });

    // Handle initial render to capture the popover's position
    useLayoutEffect(() => {
        if (onPopoverRender && isOpen && containerRef.current) {
            onPopoverRender(containerRef.current.getBoundingClientRect());
        }
    }, [isOpen]);

    // Auto-position the popover if the `autoPosition` prop is set
    const autoPositionPopover = useCallback(
        (element: HTMLDivElement) => {
            if (!element || !autoPosition) return;

            const { x, y, width, height } = element.getBoundingClientRect();
            if (x < 0) setHorizontalDock('left');
            else if (x + width > innerWidth) setHorizontalDock('right');

            if (y < 0) setVerticalDock('top');
            else if (y + height > innerHeight) setVerticalDock('bottom');
        },
        [autoPosition, size]
    );

    // Assign the callback ref for auto-positioning
    const callbackRef = useCallback(
        (element: HTMLDivElement) => {
            containerRef.current = element;
            if (element) autoPositionPopover(element);
        },
        [autoPositionPopover]
    );

    // Dismiss the popover when clicking outside
    useClickOutside(() => isOpen && onDismiss(), [containerRef]);

    // Calculate popover styles based on docking position
    const popoverStyles: CSSProperties = useMemo(() => {
        const parentRect =
            containerRef.current?.parentElement?.getBoundingClientRect();
        const spacing = 5;

        const calculatePosition = (
            dock: 'left' | 'right',
            parentEdge: number,
            offsetWidth: number
        ) => {
            return dock === 'right'
                ? Math.max(
                      innerWidth - parentEdge - offsetWidth - spacing,
                      spacing
                  )
                : Math.min(
                      parentEdge + spacing,
                      innerWidth - offsetWidth - spacing
                  );
        };

        const { width = 0 } =
            containerRef.current?.getBoundingClientRect() ?? {};
        return {
            top: verticalDock === 'top' ? spacing : 'auto',
            bottom: verticalDock === 'bottom' ? spacing : 'auto',
            left:
                horizontalDock === 'left' && parentRect
                    ? calculatePosition('left', parentRect.x, width)
                    : 'auto',
            right:
                horizontalDock === 'right' && parentRect
                    ? calculatePosition('right', parentRect.right, width)
                    : 'auto',
            ...style
        };
    }, [horizontalDock, verticalDock, size, style]);
    console.log(style);
    return isOpen ? (
        <div
            ref={callbackRef}
            className={`popover ${className}`}
            style={popoverStyles}
        >
            {children}
        </div>
    ) : null;
};
