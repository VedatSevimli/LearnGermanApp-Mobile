import React from 'react';
import './Words.scss';
import { Verb } from '../../../modules/verbs/verbs.type';
import { WordCard } from './Word/WordCard ';
import { UserData } from '../../../modules/login/login.type';
import { useUser } from '../../../context/userContext/userContext';

type WordsProps = {
    words: Verb[];
};
export const Words: React.FC<WordsProps> = ({ words }): JSX.Element => {
    const { userData } = useUser();

    const isDisable = (word: string) => {
        return !userData?.progress.map((p) => p.word).includes(word);
    };

    return (
        <div className="words-page">
            {words.map((wordData, idx) => (
                <WordCard
                    classes={
                        isDisable(wordData.word) &&
                        idx !== userData?.progress.length
                            ? ['disable']
                            : ['']
                    }
                    key={idx}
                    wordData={wordData}
                    userData={userData as UserData}
                />
            ))}
        </div>
    );
};
