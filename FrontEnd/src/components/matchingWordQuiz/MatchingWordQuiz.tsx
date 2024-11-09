import React, { useState, useEffect } from 'react';
import './MatchingWordQuiz.scss';
import { TensesE } from '../../modules/verbs/verbs.type';
import { useTranslation } from 'react-i18next';

export type MatchingWords = {
    word: string;
    def: string;
    id: string;
};

export type MatchingWordQuizProps = {
    tense: TensesE;
    matchingWords: MatchingWords[];
    onQuizFinish?: React.Dispatch<React.SetStateAction<number>>;
};

const MatchingWordQuiz: React.FC<MatchingWordQuizProps> = ({
    onQuizFinish,
    ...props
}) => {
    const { t } = useTranslation();
    const [shuffledWords, setShuffledWords] = useState<MatchingWords[]>([]);
    const [shuffledDefs, setShuffledDefs] = useState<MatchingWords[]>([]);
    const [selectedWord, setSelectedWord] = useState<string>('');
    const [selectedDefinition, setSelectedDefinition] = useState<string>('');
    const [matchedPairs, setMatchedPairs] = useState<
        { wordId?: string; definitionId?: string }[]
    >([]);
    const [matchingWords, setMatchingWords] = useState<MatchingWords[]>(
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
            ? onQuizFinish?.((prev) => (prev = prev + 1))
            : null;
    }, [matchedPairs]);

    const shuffleWords = () => {
        const shuffledW = [...matchingWords].sort(() => Math.random() - 0.5);
        const shuffledD = [...matchingWords].sort(() => Math.random() - 0.5);
        setShuffledWords(shuffledW);
        setShuffledDefs(shuffledD);
    };

    const handleWordClick = (word: MatchingWords) => {
        setSelectedWord(word.id);
        setSelectedDefinition('');
    };

    const handleDefinitionClick = (definition: MatchingWords) => {
        setSelectedDefinition(definition.id);
        if (selectedWord) {
            checkMatch(selectedWord, definition.id);
        }
    };

    const checkMatch = (wordId: string, definitionId: string) => {
        const matchingWord = shuffledWords.find(
            (word) => word.id === definitionId && word.id === wordId
        );
        if (matchingWord?.id === wordId) {
            setSelectedWord('');
            setSelectedDefinition('');
            setMatchedPairs((prev) => [...prev, { wordId, definitionId }]);
        } else {
            setTimeout(() => {
                setSelectedDefinition('');
            }, 500);
        }
    };

    const ismatched = (wordObj: MatchingWords): string => {
        if (matchedPairs.filter((mp) => mp.wordId && mp.definitionId).length) {
            const matchedPair = matchedPairs.find(
                (pair) =>
                    pair.definitionId === wordObj.id &&
                    pair.wordId === wordObj.id
            );
            if (matchedPair) {
                return 'matched';
            } else {
                if (selectedDefinition && selectedDefinition === wordObj.id) {
                    return 'not-matched';
                }
            }
        }

        return '';
    };

    return (
        <div className="matching-quiz">
            <h2>
                {t('Components.MatchingWord.Header.Text')}Matching Word Quiz
            </h2>
            <div className="wrapper">
                <div className="word-cards">
                    {shuffledWords.map((wordObj) => (
                        <div
                            key={wordObj.id}
                            className={`word-card ${
                                selectedWord === wordObj.id ? 'selected' : ''
                            } ${ismatched(wordObj)}`}
                            onClick={() => handleWordClick(wordObj)}
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
                                selectedDefinition === wordObj.id
                                    ? 'selected'
                                    : ''
                            } ${ismatched(wordObj)}`}
                            onClick={() => handleDefinitionClick(wordObj)}
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
