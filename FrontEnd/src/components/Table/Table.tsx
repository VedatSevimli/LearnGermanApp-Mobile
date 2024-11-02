import React from 'react';
import './ConjugationTable.scss';
import { useTranslation } from 'react-i18next';
export type ConjugationTableProps = {
    tense?: string;
    conjugations?: string[];
    isSeparable?: boolean;
};
export const ConjugationTable: React.FC<ConjugationTableProps> = ({
    tense,
    conjugations,
    isSeparable
}): JSX.Element => {
    const { t } = useTranslation();

    return (
        <div className="conjugation-table">
            <div className="header">{tense} </div>
            <div
                className={`conjugation-rows ${isSeparable ? 'separable' : ''}`}
            >
                <div className="person-header">
                    {t('Conjugation.Table.Person')}
                </div>
                <div className="conjugation-header">
                    {t('Conjugation.Table.Conjugation')}
                </div>
                {isSeparable && <div className="conjugation-header"></div>}
                {conjugations?.map((conjugation, index) => {
                    const [person, conj, conj2] = conjugation.split(' ');
                    return (
                        <React.Fragment key={index}>
                            <div className="person-cell">{person}</div>
                            <div className="conjugation-cell">{conj}</div>
                            {conj2 && (
                                <div className="conjugation-cell">{conj2}</div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
