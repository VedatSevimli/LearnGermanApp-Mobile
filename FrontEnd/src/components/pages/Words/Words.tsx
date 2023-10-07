import React from 'react';
import './Words.scss';
import { Verb } from '../../../modules/verbs/verbs.type';
import { WordCard } from './Word/WordCard ';

type WordsProps = {
    words: Verb[];
};
export const Words: React.FC<WordsProps> = ({ words }): JSX.Element => {
    return (
        <div className="words-page">
            {words.map((wordData, idx) => (
                <WordCard
                    classes={idx > 0 ? ['disable'] : ['']}
                    key={idx}
                    wordData={wordData}
                />
            ))}
        </div>
    );
};
