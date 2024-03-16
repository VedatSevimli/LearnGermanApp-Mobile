import { useEffect, useState } from 'react';

type Timerprops = {
    setTimeOut: React.Dispatch<React.SetStateAction<boolean>>;
    questionNumber: number;
};
export const Timer: React.FC<Timerprops> = ({
    setTimeOut,
    questionNumber
}): JSX.Element => {
    const [timer, setTimer] = useState(30);

    useEffect(() => {
        if (timer === 0) return setTimeOut(true);
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(interval);
    }, [timer, setTimeOut]);

    useEffect(() => {
        setTimer(30);
    }, [questionNumber]);
    return (
        <div
            className={`timer ${
                timer < 20 && timer > 10 ? 'warn' : timer < 10 ? 'less' : ''
            }`}
        >
            {timer}
        </div>
    );
};
