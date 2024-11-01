import React from 'react';
import './Words.scss';
import { Verb } from '../../../modules/verbs/verbs.type';
import { WordCard } from './Word/WordCard ';
import { UserData } from '../../../modules/login/login.type';
import { useUser } from '../../../context/userContext/userContext';
import { setSeo } from '../../../utils/seo';
import { LoadingOverlay } from '../../LoadingOverlay/LoadingOverlay';

type WordsProps = {
    words: Verb[];
};
export const Words: React.FC<WordsProps> = ({ words }): JSX.Element => {
    const { userData } = useUser();
    setSeo('Deutsch-Turkish App - Verben', 'Lerne Verben');

    const isDisable = (word: string, idx: number): boolean => {
        if (userData?.email) {
            return (
                !userData?.progress.map((p) => p.word).includes(word) &&
                idx !== userData?.progress.length
            );
        }
        return false;
    };

    return words.length > 0 ? (
        <div className="words-page">
            {words.map((wordData, idx) => (
                <WordCard
                    classes={isDisable(wordData.word, idx) ? ['disable'] : ['']}
                    key={idx}
                    wordData={wordData}
                    userData={userData as UserData}
                />
            ))}
        </div>
    ) : (
        <LoadingOverlay></LoadingOverlay>
    );
};
