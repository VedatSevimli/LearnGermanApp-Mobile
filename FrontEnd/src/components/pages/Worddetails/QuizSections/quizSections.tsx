import React, { useState } from 'react';
import './quizSections.scss';
import { quizOptE } from '../../../Sentences/Sentences';
import { Popup } from '../../../Popup/popup';
import { DropDown } from '../../../Dropdown/dropDown';
import {
    SentencesAndConjugation,
    TensesE
} from '../../../../modules/verbs/verbs.type';

export type QuizSectionsProps = {
    onQuizoptClick: (
        QuestionType: SentencesAndConjugation,
        tense: TensesE,
        quizOpt: quizOptE
    ) => void;
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
    onQuizoptClick
}) => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);

    const openPopup = () => {
        setIsPopupOpen(true);
    };

    const closePopup = () => {
        setIsPopupOpen(false);
    };
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
                    defaultOption={'Übung with Questions'}
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
            </div>
        </div>
    );
};
