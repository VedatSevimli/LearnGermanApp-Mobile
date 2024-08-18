import React from 'react';
import './quizSections.scss';
import { quizOptE } from '../../../Sentences/Sentences';
import { DropDown } from '../../../Dropdown/dropDown';
import {
    SentencesAndConjugation,
    TensesE
} from '../../../../modules/verbs/verbs.type';
import { Button } from '../../../Button/button';

export type QuizSectionsProps = {
    onQuizoptClick: (
        QuestionType: SentencesAndConjugation,
        tense: TensesE,
        quizOpt: quizOptE
    ) => void;
    onLearnModeClick: () => void;
};

const dropdownitems = [
    'sentences-presens',
    // 'sentences-pastTense',
    'sentences-perfect',
    '----------',
    'conjugation-presens',
    // 'conjugation-pastTense',
    'conjugation-perfect'
];
export const QuizSections: React.FC<QuizSectionsProps> = ({
    onQuizoptClick,
    onLearnModeClick
}) => {
    const handleQuizoptClicked = (item: string, quizOpt: quizOptE) => {
        const [QuestionType, tense] = item.split('-');

        onQuizoptClick(
            QuestionType as SentencesAndConjugation,
            tense as TensesE,
            quizOpt
        );
    };
    return (
        <div className="quiz-section">
            <h2>Übung Optionen</h2>
            <div className="quiz-options">
                <DropDown
                    className="quiz-option"
                    defaultOption={'Multiple Choice'}
                    onSelect={(item) =>
                        handleQuizoptClicked(item, quizOptE.MultipleChoice)
                    }
                    options={dropdownitems}
                ></DropDown>

                <DropDown
                    className="quiz-option"
                    defaultOption={'Drag and Drop'}
                    onSelect={(item) =>
                        handleQuizoptClicked(item, quizOptE.DragDrop)
                    }
                    options={dropdownitems}
                ></DropDown>

                <DropDown
                    className="quiz-option"
                    defaultOption={'Match the Words'}
                    onSelect={(item) =>
                        handleQuizoptClicked(item, quizOptE.MatchWords)
                    }
                    options={dropdownitems.slice(
                        dropdownitems.indexOf('----------') + 1
                    )}
                ></DropDown>
                <Button type="primary" onClick={onLearnModeClick}>
                    Lernen Modus
                </Button>
            </div>
        </div>
    );
};
