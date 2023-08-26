import React from 'react';
import './ConjugationTable.scss';
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
    console.log({ conjugations });
    return (
        <div className="conjugation-table">
            <div className="header">{tense} Tense</div>
            <div
                className={`conjugation-rows ${isSeparable ? 'separable' : ''}`}
            >
                <div className="person-header">Person</div>
                <div className="conjugation-header">Conjugation</div>
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
