import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Reading.scss';
import { Verb } from '../../../modules/verbs/verbs.type';

import { germanText } from '../../../utils/lesen';

type ReadingProps = {
    verbList: Verb[];
};

export const Reading: React.FC<ReadingProps> = ({ verbList }): JSX.Element => {
    const navigate = useNavigate();
    const handleClickUsedWord = (uv: string) => {
        navigate(`/wordDetails/${uv}`);
    };
    return (
        <div className="reading">
            <div className="german-texts">
                {germanText.map((gt, idx) => {
                    return (
                        <div key={idx} className="text-card-wrapper">
                            <span
                                dangerouslySetInnerHTML={{ __html: gt.text }}
                            ></span>
                            <div className="text-card">
                                <h3>Metinde kullanilan Kelimer</h3>
                                <div className="used-verbs-wrapper">
                                    {gt.usedVerbs.map((uv) => {
                                        return (
                                            <span
                                                key={uv}
                                                className="used-verb"
                                                onClick={() =>
                                                    handleClickUsedWord(uv)
                                                }
                                            >
                                                {uv}
                                                <div className="tooltip-text">
                                                    {verbList.find(
                                                        (verb) =>
                                                            verb.word === uv
                                                    )?.def.tr ?? ''}
                                                </div>
                                            </span>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
