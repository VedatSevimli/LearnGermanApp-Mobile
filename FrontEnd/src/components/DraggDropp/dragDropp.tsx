import React, { useEffect, useRef, useState } from 'react';

import './dragDropp.scss';
import { speakSentence } from '../../utils/speech';
import { speaker } from '../../images/image';
import { Button } from '../Button/button';

export type DragDroppProps = {
    question: string;
    definition: string;
    mixConj: string[];
    setNext?: React.Dispatch<React.SetStateAction<number>>;
};

export const DraggQuiz: React.FC<DragDroppProps> = (props): JSX.Element => {
    const { question, definition, mixConj } = props;
    const isMounted = useRef<boolean>(false);
    const [widgets, setWidgets] = useState<string[]>([]);
    const [mixedWid, setMixedWid] = useState<string[]>(
        shuffleArray(question.split(' '))
    );
    const [showDef, setShowDef] = useState<boolean>(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    useEffect(() => {
        setWidgets([]);
        const concatItems = shuffleArray([...question.split(' '), ...mixConj]);
        const widgetSet = new Set(concatItems);
        isMounted.current && setMixedWid(Array.from(widgetSet));
        isMounted.current && setShowDef(false);
    }, [question]);

    useEffect(() => {
        widgets.join(' ').length === question.toString().length &&
            widgets.join(' ') === question.toString() &&
            setTimeout(() => {
                isMounted.current &&
                    props.setNext?.((prev) => (prev = prev + 1));
            }, 1.5 * 1000);
    }, [widgets, question]);

    const handleOnDrag = (
        e: React.DragEvent<HTMLDivElement>,
        widgetType: string
    ) => {
        e.dataTransfer.setData('widgetType', widgetType);
    };

    const handleOnDrop = (ev: React.DragEvent<HTMLDivElement>) => {
        const widgetType = ev.dataTransfer.getData('widgetType');
        setWidgets([...widgets, widgetType]);
        setMixedWid((prev) => {
            const fw = prev.filter((w) => w !== widgetType);
            return fw;
        });
    };

    const handleDragOver = (ev: React.DragEvent<HTMLDivElement>) => {
        ev.preventDefault();
    };

    function shuffleArray(array: string[]) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
    }

    const handleReset = () => {
        setWidgets([]);
        setMixedWid([
            ...shuffleArray(question.split(' ')),
            ...shuffleArray(mixConj)
        ]);
    };

    const handleWidgetClick = (word: string) => {
        speakSentence(word, { rate: 1 });
        setMixedWid((prev) => {
            const idx = prev.indexOf(word);
            let filteredArr;
            if (idx !== -1) {
                filteredArr = prev.filter((_, i) => i !== idx);
            }
            return filteredArr ?? [];
        });
        setWidgets((prev) => [...prev, word]);
    };

    return (
        <div className="draggQuestion">
            <h2>Bitte ordnen Sie den Satz zu</h2>

            <div className="definition" onClick={() => setShowDef(!showDef)}>
                <p>
                    {!showDef && definition
                        ? 'Anlamini görmek için tıkla'
                        : definition}
                </p>
            </div>

            <div className="widgets">
                {mixedWid?.map((w, i) => {
                    return (
                        <div
                            className="widget"
                            draggable
                            onDragStart={(e) => handleOnDrag(e, w)}
                            key={i}
                            onClick={() => handleWidgetClick(w)}
                        >
                            {w}
                        </div>
                    );
                })}
                <button
                    className="speaker"
                    onClick={() => speakSentence(question)}
                >
                    {/* Speak Sentence */}
                    <img src={speaker} alt="speaker" />
                </button>
            </div>

            <div
                className="dropArea"
                onDrop={handleOnDrop}
                onDragOver={handleDragOver}
            >
                <div className="dropped-widget-wrapper">
                    {widgets.map((w, i) => (
                        <div
                            className="dropped-widget"
                            title="listeden kaldır.."
                            onClick={() => {
                                setWidgets((prev) =>
                                    prev?.filter((wd) => wd !== w)
                                );
                                setMixedWid((prev) => [...prev, w]);
                            }}
                            key={i}
                        >
                            {w}
                        </div>
                    ))}
                    {widgets.join(' ').length === question.toString().length &&
                    widgets.join(' ') === question.toString() ? (
                        <span>✔️</span>
                    ) : //*eslint no-nested-ternary: "error"
                    !mixedWid.length ? (
                        <>
                            <span> ❌ </span>
                        </>
                    ) : null}
                </div>
                {widgets.length > 0 && (
                    <Button className="rest-btn" onClick={handleReset}>
                        Reset
                    </Button>
                )}
            </div>
        </div>
    );
};
