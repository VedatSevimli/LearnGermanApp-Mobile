import React from 'react';
import './Sentences.scss';
import { Sentences } from '../../modules/verbs/verbs.type';
import { Sentence } from './sentence';
import { useTranslation } from 'react-i18next';

export type SentencesComponentProps = {
    sentencesData: Sentences;
    word: string;
};

export enum quizOptE {
    MultipleChoice = 'MultipleChoice',
    DragDrop = 'DragDrop',
    MatchWords = 'MatchWords',
    LearnMode = 'LearnMode',
    FillTheBlanks = 'FillTheBlanks'
}

export const SentencesComponent: React.FC<SentencesComponentProps> = ({
    sentencesData
}): JSX.Element => {
    const { t } = useTranslation();
    const { presens, pastTense, perfect } = sentencesData;

    return (
        <div className="sentence-component">
            <div className="sentence-section">
                <h2>{t('Components.Sentences.Text')}Sentences</h2>
                <div className="sentence-list">
                    {presens.map((sentence, index) => (
                        <Sentence key={index} sentence={sentence}></Sentence>
                    ))}
                    {pastTense.map((sentence, index) => (
                        <Sentence key={index} sentence={sentence}></Sentence>
                    ))}
                    {perfect.map((sentence, index) => (
                        <Sentence key={index} sentence={sentence}></Sentence>
                    ))}
                </div>
            </div>
        </div>
    );
};
