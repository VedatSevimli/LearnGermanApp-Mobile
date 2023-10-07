import React, { useState, useEffect } from 'react';
import './MatchingWordQuiz.scss';

export type matchingWords = {
    word: string;
    def: string;
};
export type MatchingWordQuizProps = {
    words: matchingWords[];
};
const MatchingWordQuiz: React.FC<MatchingWordQuizProps> = ({ words }) => {
    const [shuffledWords, setShuffledWords] = useState<matchingWords[]>([]);
    const [shuffledDefs, setShuffledDefs] = useState<matchingWords[]>([]);
    const [selectedWord, setSelectedWord] = useState<string>('');
    const [selectedDefinition, setSelectedDefinition] = useState<string>('');
    const [matchedPairs, setMatchedPairs] = useState<
        { word: string; definition: string }[]
    >([{ word: '', definition: '' }]);

    useEffect(() => {
        shuffleWords();
    }, []);

    const shuffleWords = () => {
        const shuffledW = [...words].sort(() => Math.random() - 0.5);
        const shuffledD = [...words].sort(() => Math.random() - 0.5);
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
            (wordObj) => wordObj.def === definition
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
                            } ${
                                matchedPairs.some(
                                    (pair) => pair.word === wordObj.word
                                )
                                    ? 'matched'
                                    : ''
                            }`}
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
                            } ${
                                matchedPairs.some(
                                    (pair) => pair.definition === wordObj.def
                                )
                                    ? 'matched'
                                    : selectedDefinition &&
                                      selectedDefinition === wordObj.def
                                    ? 'not-matched'
                                    : ''
                            }`}
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
