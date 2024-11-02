import React, { useEffect, useState } from 'react';
import './writingQuiz.scss';
import { QuizSection, TensesE, Verb } from '../../modules/verbs/verbs.type';

type WritingQuizP = {
    data: { sentence: string; tense: keyof QuizSection }[];
    verbList: Verb[];
    onQuizFinish?: React.Dispatch<React.SetStateAction<number>>;
};

const findVerbsInSentence = (
    sentence: string,
    verbList: Verb[]
): {
    verb: string;
    position: number;
    originalVerb: string;
}[] => {
    const words: string[] = sentence.trim().split(' ');
    const foundVerbs: {
        verb: string;
        position: number;
        originalVerb: string;
    }[] = [];

    verbList.forEach((verb) => {
        const { pastTense, perfect, presens } = verb.conjugation;
        const allConjugations = [...presens, ...perfect, ...pastTense].map(
            (conj) => {
                const conjugation = conj.trim().split(' ');
                return conjugation.at(-1);
            }
        );

        words.forEach((word, index) => {
            if (
                allConjugations.some(
                    (cnj) =>
                        cnj?.toLocaleLowerCase() ===
                        word.replace(/[.,!?]/g, '').toLowerCase()
                )
            ) {
                foundVerbs.push({
                    verb: word,
                    position: index,
                    originalVerb: verb.word
                });
            }
        });
    });
    return foundVerbs.sort((a, b) => a.position - b.position);
};

export const WritingQuiz: React.FC<WritingQuizP> = ({
    data,
    verbList,
    onQuizFinish
}: WritingQuizP) => {
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>(
        {}
    );
    const [isCorrect, setIsCorrect] = useState<{ [key: string]: boolean }>({});
    const [openTooltipIndex, setOpenTooltipIndex] = useState<number>(-1);

    useEffect(() => {
        if (
            Object.keys(isCorrect).length === data.length &&
            Object.values(isCorrect).every((val) => val)
        ) {
            setTimeout(() => {
                onQuizFinish?.((prev) => (prev = prev + 1));
                setInputValues({});
                setIsCorrect({});
            }, 1000 * 1);
        }
    }, [isCorrect]);

    const toggleTooltip = (index: number) => {
        setOpenTooltipIndex((prevIndex) => (prevIndex === index ? -1 : index));
    };

    const handleInputChange = (
        value: string,
        sentenceIndex: number,
        verbIndex: number,
        verb: string
    ) => {
        setInputValues((prev) => ({
            ...prev,
            [`${sentenceIndex}-${verbIndex}`]: value
        }));

        setIsCorrect((prev) => ({
            ...prev,
            [`${sentenceIndex}-${verbIndex}`]: value === verb
        }));
    };

    return (
        <div className="writing-quiz-container">
            <h3>
                {data[0].tense === TensesE.presens && 'Präsens'}
                {data[0].tense === TensesE.perfect && 'Perfekt'}
                {data[0].tense === TensesE.pastTense && 'Präteritum'}
            </h3>
            {data.map((st, sentenceIndex) => {
                const verbs = findVerbsInSentence(st.sentence, verbList);
                const words = st.sentence.trim().split(' ');
                let lastPosition = 0;
                let orglVerb = '';
                const sentenceParts = verbs.map(
                    ({ verb, position, originalVerb }, verbIndex) => {
                        const beforeVerb = words
                            .slice(lastPosition, position)
                            .join(' ');

                        lastPosition = position + 1;
                        orglVerb = originalVerb;

                        return (
                            <React.Fragment
                                key={`${sentenceIndex}-${verbIndex}`}
                            >
                                <span>{beforeVerb} </span>
                                <input
                                    type="text"
                                    className={`quiz-input ${
                                        isCorrect[
                                            `${sentenceIndex}-${verbIndex}`
                                        ]
                                            ? 'correct'
                                            : 'incorrect'
                                    }`}
                                    placeholder="Type conjugation"
                                    value={
                                        inputValues[
                                            `${sentenceIndex}-${verbIndex}`
                                        ] || ''
                                    }
                                    onChange={(e) =>
                                        handleInputChange(
                                            e.target.value,
                                            sentenceIndex,
                                            verbIndex,
                                            verb
                                        )
                                    }
                                />
                                <span
                                    className="info-icon"
                                    onClick={() => toggleTooltip(sentenceIndex)}
                                >
                                    ℹ️
                                </span>
                                {openTooltipIndex === sentenceIndex && (
                                    <span className="tooltip">
                                        {data[sentenceIndex].sentence}
                                    </span>
                                )}
                            </React.Fragment>
                        );
                    }
                );

                return (
                    <div className="quiz-item" key={sentenceIndex}>
                        {sentenceParts}
                        <span>{words.slice(lastPosition).join(' ')}</span>

                        <span>
                            {'('}
                            <small>{orglVerb}</small>
                            {')'}
                        </span>
                    </div>
                );
            })}
        </div>
    );
};
