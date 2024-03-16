import React, { useEffect, useState } from 'react';

import './Worddetails.scss';
import { ConjugationTable } from '../../Table/Table';
import { getWord, getWords } from '../../../API/VerbList/verb';
import {
    Conjugation,
    SentencesAndConjugation,
    TensesE,
    Verb
} from '../../../modules/verbs/verbs.type';
import { useNavigate, useParams } from 'react-router-dom';
import { SentencesComponent, quizOptE } from '../../Sentences/Sentences';
import { LoadingOverlay } from '../../LoadingOverlay/LoadingOverlay';
import { QuizSections } from './QuizSections/quizSections';
import MatchingWordQuiz, {
    matchingWords
} from '../../matchingWordQuiz/MatchingWordQuiz';
import { MultipleChoice } from '../../MultipleChoice/multipleChoice';
import { QuizOptions } from '../../../config/configProps';
import { defaultConfig } from '../../../config/defaultConfig';
import Dialog from '../../Dialog/dialog';
import DialogHeader from '../../Dialog/DialogHeader/dialogHeader';
import DialogBody from '../../Dialog/DialogBody/dialogBody';

type VerbDetailsP = {
    verbList: Verb[];
};
export const VerbDetails: React.FC<VerbDetailsP> = ({
    verbList
}): JSX.Element => {
    const { word } = useParams();
    const navigate = useNavigate();
    const { learnedWords } = defaultConfig();
    const [openDialog, setOpenDialog] = useState<boolean>(false);
    const [activeQuiz, setActiveQuiz] = useState<quizOptE>(
        quizOptE.MultipleChoice
    );
    const [verbs, setVerbs] = useState<Verb[]>([]);
    const [verb, setVerb] = useState<Verb>({} as Verb);
    const [isLoading, setIsLoading] = useState(true);
    const [showSentences, setShowSentences] = useState(false);
    const [options, setOptions] = useState<{
        QuestionType: SentencesAndConjugation;
        tense: TensesE;
        quizOpt: quizOptE;
    }>({
        QuestionType: 'conjugation',
        quizOpt: quizOptE.MultipleChoice,
        tense: TensesE.presens
    });

    useEffect(() => {
        const getVerbListA = async (): Promise<void> => {
            try {
                setIsLoading(true);
                const verbsList = await getWords({
                    words: learnedWords
                });
                setVerbs(verbsList);
                const verb = await getWord({ word: word as string });
                setVerb(verb);

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
        setOptions({ QuestionType, quizOpt, tense });
        handleOptionClick(quizOpt);
        // navigate(`/quiz/${word}/${QuestionType}/${tense}/${quizOpt}`);
    };

    const renderActiveQuiz = (activeQuiz: quizOptE) => {
        if (activeQuiz === quizOptE.MultipleChoice) {
            return (
                <MultipleChoice
                    verb={verb}
                    verbList={verbList}
                    tense={options.tense}
                    questionType={options.QuestionType}
                />
            );
        } else if (activeQuiz === quizOptE.MatchWords) {
            return (
                <MatchingWordQuiz
                    verb={verb}
                    tense={options.tense}
                ></MatchingWordQuiz>
            );
        }

        return <></>;
    };

    const handleOptionClick = (option: quizOptE) => {
        setActiveQuiz(option);
        setOpenDialog(true);
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
                        tense="Präsens"
                        conjugations={verb?.conjugation?.presens}
                        isSeparable={verb?.isSeparable}
                    />
                    {verb?.word === 'sein' || verb?.word === 'haben' ? (
                        <ConjugationTable
                            tense="Präteritum"
                            conjugations={verb?.conjugation?.pastTense}
                            isSeparable={verb?.isSeparable}
                        />
                    ) : (
                        <ConjugationTable
                            tense="Perfekt"
                            conjugations={verb?.conjugation?.perfect}
                            isSeparable={true}
                        />
                    )}
                </div>
            </div>
            {showSentences && (
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
                        </div>
                    </div>
                </div>
            )}
            <QuizSections onQuizoptClick={handleQuizoptClick}></QuizSections>

            {openDialog && learnedWords.length > 0 && (
                <Dialog className="quiz-dialog">
                    <DialogHeader onDismiss={() => setOpenDialog(false)}>
                        <h3>{activeQuiz}</h3>
                    </DialogHeader>
                    <DialogBody>{renderActiveQuiz(activeQuiz)}</DialogBody>
                </Dialog>
            )}
        </div>
    );
};
