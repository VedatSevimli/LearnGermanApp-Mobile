import React, { useEffect, useState } from 'react';
import './Quiz.scss';
import MatchingWordQuiz from '../../matchingWordQuiz/MatchingWordQuiz';
import { useParams } from 'react-router-dom';
import { quizOptE } from '../../Sentences/Sentences';
import { getWord } from '../../../API/VerbList/verb';
import {
    Conjugation,
    SentencesAndConjugation,
    Verb
} from '../../../modules/verbs/verbs.type';
import { LoadingOverlay } from '../../LoadingOverlay/LoadingOverlay';
import { DraggQuiz } from '../../DraggDropp/dragDropp';

export enum ConjTypeEnum {
    presens = 'presens',
    pastTense = 'pastTense',
    perfect = 'perfect',
    konjuktiv = 'konjuktiv',
    imperativ = 'konjuktiv'
}

export const Quiz: React.FC = (): JSX.Element => {
    const { word, qtype, tense, quizOpt } = useParams();

    const [isLoading, setIsLoading] = useState(true);
    const [verb, setVerb] = useState<Verb>();
    const [matchingWords, setMatchingWords] =
        useState<{ word: string; def: string }[]>();
    const [selectedConj, setSelectedConj] = useState<ConjTypeEnum>(
        ConjTypeEnum[tense as ConjTypeEnum]
    );

    useEffect(() => {
        const getVerbListA = async (): Promise<void> => {
            try {
                setIsLoading(true);
                const verbs = await getWord({ word: word as string });
                setVerb(verbs);
                const mw = (verbs.conjugation as Conjugation).presens.map(
                    (pc) => {
                        const [subj, verb, verb2] = pc.split(' ');
                        return {
                            word: subj,
                            def: verb + ' ' + (verb2 ?? '')
                        };
                    }
                );
                console.log({ mw });
                setMatchingWords(mw);
                setIsLoading(false);
            } catch (error) {
                setIsLoading(false);
            }
        };
        void getVerbListA();
    }, [word]);

    if (isLoading) {
        return <LoadingOverlay></LoadingOverlay>;
    }

    return (
        <div className="quiz">
            {quizOpt === quizOptE.MatchWords && matchingWords && (
                <MatchingWordQuiz
                    words={matchingWords}
                    key={matchingWords.length}
                ></MatchingWordQuiz>
            )}

            {quizOpt === quizOptE.Question && verb && (
                <div className="div">quiz questions</div>
            )}

            {quizOpt === quizOptE.DragDrop &&
                qtype &&
                verb &&
                verb[qtype as SentencesAndConjugation][selectedConj].map(
                    (question: any, index: number, arr: any) => {
                        if (qtype === 'sentences') {
                            return (
                                <DraggQuiz
                                    key={index}
                                    question={question.sentence}
                                    definition={question.def.tr}
                                    mixConj={[]}
                                ></DraggQuiz>
                            );
                        } else {
                            return (
                                <DraggQuiz
                                    key={index}
                                    question={question}
                                    mixConj={arr.map(
                                        (w: string) => w.split(' ')[1]
                                    )}
                                    definition={verb.def.tr}
                                ></DraggQuiz>
                            );
                        }
                    }
                )}
        </div>
    );
};
