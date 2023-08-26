import React, { useEffect, useState } from 'react';

import './Worddetails.scss';
import { ConjugationTable } from '../../Table/Table';
import { getWord } from '../../API/Login/getVerbListWithLevel';
import { Verb } from '../../modules/verbs/verbs.type';
import { useParams } from 'react-router-dom';
import { SentencesComponent } from '../../Sentences/Sentences';
import { LoadingOverlay } from '../../LoadingOverlay/LoadingOverlay';

export const VerbDetails: React.FC = (): JSX.Element => {
    const { word } = useParams();

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

    if (isLoading && !verb) {
        return <LoadingOverlay />;
    }

    return verb ? (
        <div className="verb-details">
            <h2>Verb Details</h2>
            <div className="conjugation-section">
                <h3>Conjugations</h3>
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
            <div className="sentences-section">
                <h3>Sentences</h3>
                <div className="sentences">
                    <div className="sentence">
                        <SentencesComponent
                            sentencesData={verb.sentences}
                        ></SentencesComponent>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div></div>
    );
};
