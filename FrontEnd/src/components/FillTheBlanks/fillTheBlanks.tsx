import React, { useState } from 'react';

import './fillTheBlanks.scss';
import { ITextData } from '../../modules/texts/texts.type';
import { useTranslation } from 'react-i18next';

type FillBlankProps = {
    textData: ITextData;
};
export const FillBlanksApp: React.FC<FillBlankProps> = ({ textData }) => {
    const { t } = useTranslation();

    const initialUserInputs = Array(
        textData.fillTheBlank?.sentences.length
    ).fill('');
    const [userInputs, setUserInputs] = useState<string[]>(initialUserInputs);
    const [correctness, setCorrectness] = useState(
        Array(textData.fillTheBlank?.sentences.length).fill(null)
    );

    const handleInputChange = (index: number, value: string) => {
        const newInputs = [...userInputs];
        newInputs[index] = value;
        setUserInputs(newInputs);

        const isCorrect =
            value.toLowerCase() ===
            textData.fillTheBlank?.sentences[index].verb.trim().toLowerCase();
        const newCorrectness = [...correctness];
        newCorrectness[index] = isCorrect;
        setCorrectness(newCorrectness);
    };

    const resetForm = () => {
        setUserInputs(initialUserInputs);
        setCorrectness(
            Array(textData.fillTheBlank?.sentences.length).fill(null)
        );
    };

    return (
        <div>
            {textData.fillTheBlank?.sentences && (
                <>
                    <h1>{t('Reading.FillTheBlanks.Text')}</h1>
                    <div>
                        {textData.fillTheBlank?.sentences.map(
                            (sentence, index) => (
                                <span key={index}>
                                    {` ${sentence.prefix} `}
                                    <input
                                        type="text"
                                        value={userInputs[index]}
                                        onChange={(e) =>
                                            handleInputChange(
                                                index,
                                                e.target.value.trim()
                                            )
                                        }
                                        placeholder={`${textData.usedVerbs?.[index]}`}
                                        style={{
                                            borderColor:
                                                correctness[index] !== null
                                                    ? correctness[index]
                                                        ? 'green'
                                                        : 'red'
                                                    : ''
                                        }}
                                    />
                                    {` ${sentence.suffix} `}
                                </span>
                            )
                        )}
                    </div>
                    <div>
                        <button onClick={resetForm}>
                            {t('Components.FillBlank.Btn.Text')}
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};
