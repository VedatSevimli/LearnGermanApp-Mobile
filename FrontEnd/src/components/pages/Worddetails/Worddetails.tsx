import React, { useEffect, useState } from 'react';

import './Worddetails.scss';
import { ConjugationTable } from '../../Table/Table';
import { getWord } from '../../../API/VerbList/verb';
import {
    SentencesAndConjugation,
    TensesE,
    Verb
} from '../../../modules/verbs/verbs.type';
import { useNavigate, useParams } from 'react-router-dom';
import { SentencesComponent, quizOptE } from '../../Sentences/Sentences';
import { LoadingOverlay } from '../../LoadingOverlay/LoadingOverlay';
import { QuizSections } from './QuizSections/quizSections';

export const VerbDetails: React.FC = (): JSX.Element => {
    const { word } = useParams();
    const navigate = useNavigate();

    const [verb, setVerb] = useState<Verb>();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const getVerbListA = async (): Promise<void> => {
            try {
                setIsLoading(true);
                const verbs = await getWord({ word: word as string });
                setVerb(verbs);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        void getVerbListA();
    }, [word]);

    const handleQuizoptClick = (
        QuestionType: SentencesAndConjugation,
        tense: TensesE,
        quizOpt: quizOptE
    ) => {
        navigate(`/quiz/${word}/${QuestionType}/${tense}/${quizOpt}`);
    };

    if (isLoading && !verb) {
        return <LoadingOverlay />;
    }

    return (
        <div className="verb-details">
            <h2>Verb Details</h2>
            <div className="conjugation-section">
                <h3>Conjugations</h3>
                <div className="conjugation-content">
                    <ConjugationTable
                        tense="Presens"
                        conjugations={verb?.conjugation?.presens}
                        isSeparable={verb?.isSeparable}
                    />
                    <ConjugationTable
                        tense="Past Tense"
                        conjugations={verb?.conjugation?.pastTense}
                        isSeparable={verb?.isSeparable}
                    />
                    <ConjugationTable
                        tense="Past Tense"
                        conjugations={verb?.conjugation?.perfect}
                        isSeparable={true}
                    />
                </div>
            </div>
            <div className="sentences-section">
                <h3>Sentences</h3>
                <div className="sentences">
                    <div className="sentence">
                        {verb && (
                            <SentencesComponent
                                sentencesData={verb.sentences}
                                word={verb.word}
                            ></SentencesComponent>
                        )}

                        <QuizSections
                            onQuizoptClick={handleQuizoptClick}
                        ></QuizSections>
                    </div>
                </div>
            </div>
        </div>
    );
};
