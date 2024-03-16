import React, { useEffect, useState } from 'react';

import './dragDropp.scss';
import Button from '../Button/buttons';
import { speakSentence } from '../../utils/speech';
import { speaker } from '../../images/image';

export type DragDroppProps = {
    question: string;
    definition: string;
    mixConj: string[];
};

//TODO: show one by one the questions not all of them..
export const DraggQuiz: React.FC<DragDroppProps> = (props): JSX.Element => {
    const { question, definition, mixConj } = props;
    const [widgets, setWidgets] = useState<string[]>([]);
    const [mixedWid, setMixedWid] = useState<string[]>(
        shuffleArray(question.split(' '))
    );
    const [showDef, setShowDef] = useState<boolean>(false);

    useEffect(() => {
        setWidgets([]);
        const concatItkems = shuffleArray([...question.split(' '), ...mixConj]);
        setMixedWid(concatItkems);
        setShowDef(false);
    }, [question]);

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

    return (
        <div className="draggQuestion">
            <h2>Bitten ordnen Sie den Satz zu</h2>

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
                            onClick={() => {
                                setMixedWid((prev) => {
                                    const idx = prev.indexOf(w);
                                    let filteredArr;
                                    if (idx !== -1) {
                                        filteredArr = prev.filter(
                                            (item, i) => i !== idx
                                        );
                                    }
                                    return filteredArr ?? [];
                                });
                                setWidgets((prev) => [...prev, w]);
                            }}
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
