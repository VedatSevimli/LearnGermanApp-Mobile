import React, { useEffect, useMemo, useRef, useState } from 'react';
import './writingQuiz.scss';
import { QuizSection, TensesE, Verb } from '../../modules/verbs/verbs.type';
import { seperableVerbEndings } from '../../utils/util';
import { useTranslation } from 'react-i18next';

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
        const allConjugations = [
            ...presens.map((p) =>
                verb.isSeparable || verb.isReflexiv
                    ? p.split(' ').slice(1, 3).join(' ')
                    : p
            ),
            ...perfect,
            ...pastTense.map((p) =>
                verb.isSeparable || verb.isReflexiv
                    ? p.split(' ').slice(1, 3).join(' ')
                    : p
            )
        ].map((conj) => {
            const conjugation = conj.trim().split(' ');
            return verb.isSeparable || verb.isReflexiv
                ? conjugation.join(' ')
                : conjugation.at(-1);
        });

        const endOfVerb = words[words.length - 1];
        const isSeparable = seperableVerbEndings.includes(endOfVerb);

        words.forEach((word, index) => {
            if (
                allConjugations.some((cnj) => {
                    const conjunction =
                        index === 0 ? cnj?.toLocaleLowerCase() : cnj;
                    word =
                        index === 0
                            ? word.replace(/[.,!?]/g, '').toLowerCase()
                            : word.replace(/[.,!?]/g, '');

                    return isSeparable
                        ? conjunction ===
                              word + ' ' + endOfVerb.replace(/[.,!?]/g, '')
                        : conjunction === word;
                })
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
    const { t } = useTranslation();
    const inputCount = useRef<number>(0);
    const [inputValues, setInputValues] = useState<{ [key: string]: string }>(
        {}
    );
    const [isCorrect, setIsCorrect] = useState<{ [key: string]: boolean }>({});
    const [openTooltipIndex, setOpenTooltipIndex] = useState<number>(-1);

    useEffect(() => {
        if (
            Object.keys(isCorrect).length === inputCount.current &&
            Object.values(isCorrect).every((val) => val)
        ) {
            setTimeout(() => {
                onQuizFinish?.((prev) => (prev = prev + 1));
                setInputValues({});
                setIsCorrect({});
            }, 750 * 1);
        }
    }, [isCorrect]);

    const newData = useMemo(() => {
        let _inputCount = 0;
        const mappedData = data.map((st) => {
            const verbs = findVerbsInSentence(st.sentence, verbList);
            _inputCount = _inputCount + verbs.length;
            return {
                ...st,
                verbs
            };
        });
        inputCount.current = _inputCount;
        return mappedData;
    }, [data]);

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
                {data[0].tense === TensesE.presens &&
                    t('Page.Quiz.Quiz.QuizDetails.Tense.Presens')}
                {data[0].tense === TensesE.perfect &&
                    t('Page.Quiz.Quiz.QuizDetails.Tense.Perfect')}
                {data[0].tense === TensesE.pastTense &&
                    t('Page.Quiz.Quiz.QuizDetails.Tense.Past')}
            </h3>
            {newData.map((st, sentenceIndex) => {
                const words = st.sentence.trim().split(' ');
                let lastPosition = 0;
                const sentenceParts = st.verbs.map(
                    ({ verb, position, originalVerb }, verbIndex) => {
                        const beforeVerb = words
                            .slice(lastPosition, position)
                            .join(' ');

                        lastPosition = position + 1;

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
                                <span>
                                    {'('}
                                    <small>{originalVerb}</small>
                                    {')'}
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
                    </div>
                );
            })}
        </div>
    );
};
