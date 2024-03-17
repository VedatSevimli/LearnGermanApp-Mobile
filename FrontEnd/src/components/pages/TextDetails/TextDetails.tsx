import React, { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    ITextData,
    TextDataQuestion,
    FillTheBlank
} from '../../../modules/texts/texts.type';
import './TextDetails.scss';
import { Verb } from '../../../modules/verbs/verbs.type';
import { FillBlanksApp } from '../../FillTheBlanks/fillTheBlanks';
import { speakSentence } from '../../../utils/speech';
import { speaker } from '../../../images/image';
import { getReadingTexts } from '../../../API/ReadingTexts/texts';
import { LoadingOverlay } from '../../LoadingOverlay/LoadingOverlay';

type MultipleChoiceQuestionP = {
    questionData: TextDataQuestion;
    setScore: React.Dispatch<React.SetStateAction<number>>;
    setCurrentQuestion: React.Dispatch<React.SetStateAction<number>>;
};
export const MultipleChoiceQuestion: React.FC<MultipleChoiceQuestionP> = ({
    questionData,
    setScore,
    setCurrentQuestion
}) => {
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [options] = useState(() => {
        const options = [...questionData.options];
        for (let i = options.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [options[i], options[j]] = [options[j], options[i]];
        }
        return options;
    });

    const handleOptionChange = (option: string) => {
        setSelectedOption(option);
        if (option === questionData.correctAnswer) {
            setScore((prev) => prev + 1);
        }
        setCurrentQuestion((prev) => prev + 1);
    };
    //TODO:Improve the UI
    return (
        <div className="multiple-choice-question">
            <p>{questionData.question}</p>
            <ul>
                {options.map((option, index) => (
                    <li key={index}>
                        <input
                            type="radio"
                            id={option}
                            value={option}
                            checked={selectedOption === option}
                            onChange={() => handleOptionChange(option)}
                        />
                        <label htmlFor={option}>{option}</label>
                    </li>
                ))}
            </ul>
            {/* <p>
                {selectedOption === questionData.correctAnswer
                    ? 'Correct!'
                    : selectedOption
                    ? 'Incorrect!'
                    : ''}
            </p> */}
        </div>
    );
};

function generateFillTheBlank(text: string): FillTheBlank {
    const sentences = [];
    const regex =
        /(?:\s|^)([^<]*?)\s*<strong>(.*?)<\/strong>\s*(.*?)\s*(?=(?:\s|$))/g;

    let match;
    while ((match = regex.exec(text)) !== null) {
        const prefix = match[1].trim();
        const verb = match[2];
        const suffix = match[3].trim();

        sentences.push({ prefix, verb, suffix });
    }

    return { sentences };
}
type TextDetailsProps = {
    verbList?: Verb[];
};
export const TextDetails: React.FC<TextDetailsProps> = () => {
    const isMounted = useRef<boolean>(false);
    const { textId } = useParams();

    const [textData, setText] = useState<ITextData>();
    const [score, setScore] = useState<number>(0);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isPlaying, setIsPlaying] = useState<boolean | null>(null);
    const [utterance, setUtterance] = useState<SpeechSynthesisUtterance>();

    useEffect(() => {
        isMounted.current = true;
        const getTextData = async () => {
            setIsLoading(true);
            const textData = await getReadingTexts(textId);
            isMounted.current && setIsLoading(false);

            if (textData) {
                const newTextData = [...textData];
                if (
                    newTextData &&
                    !textData[0].fillTheBlank?.sentences?.length
                ) {
                    const fillTheBlank = generateFillTheBlank(textData[0].text);
                    newTextData[0].fillTheBlank = fillTheBlank;
                }
                isMounted.current && setText(newTextData[0]);
            }
        };
        void getTextData();

        return () => {
            window.speechSynthesis.cancel();
            isMounted.current = false;
        };
    }, [textId]);

    const handleSpeakerClick = (text: string) => {
        if (isPlaying === null) {
            const newUtterance = speakSentence(
                text.replace(/<strong>(.*?)<\/strong>/g, '$1'),
                { rate: 1.0 }
            );
            setUtterance(newUtterance);
            setIsPlaying(true);
        } else {
            if (!isPlaying && utterance) {
                window.speechSynthesis.pause();
                setIsPlaying(true);
            } else {
                setIsPlaying(false);
                window.speechSynthesis.resume();
            }
        }
    };

    if (isLoading) {
        return <LoadingOverlay></LoadingOverlay>;
    }

    return (
        <div className="text-details">
            {textData?.text && (
                <div className="text-content">
                    <span
                        dangerouslySetInnerHTML={{
                            __html: textData.text as string
                        }}
                    ></span>
                    <button
                        className="speaker"
                        onClick={() => handleSpeakerClick(textData.text)}
                    >
                        <img src={speaker} alt="speaker" />
                    </button>
                </div>
            )}

            {textData?.questions && (
                <div className="questions-container">
                    {textData && currentQuestion < textData.questions.length ? (
                        textData.questions?.map((question, idx) => {
                            return (
                                <MultipleChoiceQuestion
                                    key={idx}
                                    questionData={question}
                                    setScore={setScore}
                                    setCurrentQuestion={setCurrentQuestion}
                                ></MultipleChoiceQuestion>
                            );
                        })
                    ) : (
                        <div>
                            <h3>Quiz Completed!</h3>
                            <p>
                                {`Your Score: ${score} out of ${textData?.questions?.length}`}
                            </p>
                        </div>
                    )}
                </div>
            )}

            <div className="fill-the-blanks">
                {textData && <FillBlanksApp textData={textData} />}
            </div>
        </div>
    );
};
