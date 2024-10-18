import { useEffect, useState } from 'react';
import './timer.scss';

type Timerprops = {
    setTimeOut: React.Dispatch<React.SetStateAction<boolean>>;
    questionNumber: number;
    timerCount?: number;
};

export const Timer: React.FC<Timerprops> = ({
    setTimeOut,
    questionNumber,
    ...props
}: Timerprops): JSX.Element => {
    const [timer, setTimer] = useState(props.timerCount ?? 30);

    useEffect(() => {
        if (timer === 0) return setTimeOut(true);
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, setTimeOut]);

    useEffect(() => {
        setTimer(props.timerCount ?? 30);
    }, [questionNumber]);

    return (
        <div
            className={`timer ${
                // eslint-disable-next-line no-nested-ternary
                timer < 20 && timer > 10 ? 'warn' : timer < 10 ? 'less' : ''
            }`}
        >
            {timer}
        </div>
    );
};
