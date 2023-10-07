import { useEffect } from 'react';

/**
 * Hook to clickouside an element
 * @param callback function to call when it is clicked outside the ref element
 */

function useClickOutside(
    callback: () => void,
    targets: React.RefObject<HTMLElement>[]
) {
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            // Check if the click occurred outside of the specified targets
            const isOutside = targets.every((target) => {
                return (
                    target.current &&
                    !target.current.contains(event.target as Node)
                );
            });

            isOutside && callback();
        }

        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [callback, targets]);
}

export default useClickOutside;
