import React, { useState, useEffect } from 'react';
import './MatchingWordQuiz.scss';
import { TensesE } from '../../modules/verbs/verbs.type';

export type matchingWords = {
    word: string;
    def: string;
};

export type MatchingWordQuizProps = {
    tense: TensesE;
    matchingWords: matchingWords[];
    setNext?: React.Dispatch<React.SetStateAction<number>>;
};

const MatchingWordQuiz: React.FC<MatchingWordQuizProps> = ({
    setNext,
    ...props
}) => {
    const [shuffledWords, setShuffledWords] = useState<matchingWords[]>([]);
    const [shuffledDefs, setShuffledDefs] = useState<matchingWords[]>([]);
    const [selectedWord, setSelectedWord] = useState<string>('');
    const [selectedDefinition, setSelectedDefinition] = useState<string>('');
    const [matchedPairs, setMatchedPairs] = useState<
        { word?: string; definition?: string }[]
    >([]);
    const [matchingWords, setMatchingWords] = useState<matchingWords[]>(
        props.matchingWords ?? []
    );

    useEffect(() => {
        setMatchedPairs([]);
        setShuffledWords([]);
        setShuffledDefs([]);
        setMatchingWords(props.matchingWords ?? []);
    }, [props.matchingWords]);

    useEffect(() => {
        matchingWords.length && shuffleWords();
    }, [matchingWords]);

    useEffect(() => {
        matchedPairs.length === props.matchingWords?.length
            ? setNext?.((prev) => (prev = prev + 1))
            : null;
    }, [matchedPairs]);

    const shuffleWords = () => {
        const shuffledW = [...matchingWords].sort(() => Math.random() - 0.5);
        const shuffledD = [...matchingWords].sort(() => Math.random() - 0.5);
        setShuffledWords(shuffledW);
        setShuffledDefs(shuffledD);
    };

    const handleWordClick = (word: string) => {
        setSelectedWord(word);
        setSelectedDefinition('');
    };

    const handleDefinitionClick = (definition: string) => {
        setSelectedDefinition(definition);
        if (selectedWord) {
            checkMatch(selectedWord, definition);
        }
    };

    const checkMatch = (word: string, definition: string) => {
        const matchingWord = shuffledWords.find(
            (wordObj) => wordObj.def === definition && wordObj.word === word
        );
        if (matchingWord?.word === word) {
            setSelectedWord('');
            setSelectedDefinition('');
            setMatchedPairs((prev) => [...prev, { word, definition }]);
        } else {
            setTimeout(() => {
                setSelectedDefinition('');
            }, 500);
        }
    };

    const ismatched = (wordObj: matchingWords): string => {
        if (matchedPairs.filter((mp) => mp.word && mp.definition).length) {
            const matchedPair = matchedPairs.find(
                (pair) =>
                    pair.definition === wordObj.def &&
                    pair.word === wordObj.word
            );
            if (matchedPair) {
                return 'matched';
            } else {
                if (selectedDefinition && selectedDefinition === wordObj.def) {
                    return 'not-matched';
                }
            }
        }

        return '';
    };

    return (
        <div className="matching-quiz">
            <h2>Matching Word Quiz</h2>
            <div className="wrapper">
                <div className="word-cards">
                    {shuffledWords.map((wordObj, index) => (
                        <div
                            key={index}
                            className={`word-card ${
                                selectedWord === wordObj.word ? 'selected' : ''
                            } ${ismatched(wordObj)}`}
                            onClick={() => handleWordClick(wordObj.word)}
                        >
                            <p className="german-word">{wordObj.word}</p>
                        </div>
                    ))}
                </div>
                <div className="definition-cards">
                    {shuffledDefs.map((wordObj, index) => (
                        <div
                            key={index}
                            className={`definition-card ${
                                selectedDefinition === wordObj.def
                                    ? 'selected'
                                    : ''
                            } ${ismatched(wordObj)}`}
                            onClick={() => handleDefinitionClick(wordObj.def)}
                        >
                            <p className="definition-text">{wordObj.def}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MatchingWordQuiz;
