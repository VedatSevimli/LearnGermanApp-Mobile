// import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Reading.scss';
import { Verb } from '../../../modules/verbs/verbs.type';
import { TruncatedText } from '../../TruncatedText/truncatedText';
import { useEffect, useRef, useState } from 'react';
import { getReadingTexts } from '../../../API/ReadingTexts/texts';
import { ITextData } from '../../../modules/texts/texts.type';
import { LoadingOverlay } from '../../LoadingOverlay/LoadingOverlay';
import { useUser } from '../../../context/userContext/userContext';
import { setSeo } from '../../../utils/seo';

type ReadingProps = {
    verbList?: Verb[];
};

export const Reading: React.FC<ReadingProps> = ({
    verbList
}: ReadingProps): JSX.Element => {
    const navigate = useNavigate();
    const { userData } = useUser();

    const [texts, setTexts] = useState<ITextData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isMounted = useRef<boolean>(false);

    useEffect(() => {
        isMounted.current = true;
        const getTexts = async () => {
            setIsLoading(true);
            const texts = await getReadingTexts();
            isMounted.current && setIsLoading(false);
            isMounted.current && setTexts(() => texts);
        };
        void getTexts();

        setSeo(
            'Deutsch-Turkish App - Lesetexten',
            'Deutsche texte lesen und üben'
        );

        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleClickUsedWord = (uv: string) => {
        navigate(`/wordDetails/${uv}`);
    };

    const handleClickText = (textId: number) => {
        const textData = texts.find((text) => text.textId === textId);
        const isLearnedEveryUsedVerb = textData?.usedVerbs.every((uv) =>
            userData?.progress.map((ud) => ud.word).includes(uv)
        );

        if (userData && isLearnedEveryUsedVerb) {
            navigate(`/reading/${textId}`);
        } else {
            alert(
                'Du musst zuerst alle verben lernen, danach kannst du den text öffnen'
            );
        }
    };

    const learnedWords = userData?.progress.map((p) => p.word);

    if (isLoading) {
        return <LoadingOverlay></LoadingOverlay>;
    }
    return (
        <div className="reading">
            {texts.map((gt, idx) => {
                const showText = gt.usedVerbs.every((uv) =>
                    learnedWords?.includes(uv)
                );
                return (
                    <div
                        key={idx}
                        className="text-card-wrapper"
                        onClick={() => handleClickText(idx)}
                    >
                        {
                            <TruncatedText
                                text={gt.text.replace(/<\/?strong>/g, '')}
                                linesToShow={3}
                                style={{
                                    filter: !showText ? 'blur(3px)' : ''
                                }}
                            />
                        }
                        <div className="text-card">
                            {!showText ? (
                                <h3>
                                    Metni açmak için kırmızı fiiller
                                    öğrenilmelidir..
                                </h3>
                            ) : (
                                <h3>Metinde kullanilan fiiller</h3>
                            )}
                            <div className="used-verbs-wrapper">
                                {gt.usedVerbs.map((uv, idx) => {
                                    const isLearned =
                                        learnedWords?.includes(uv);
                                    return (
                                        <span
                                            key={idx}
                                            className={`used-verb ${
                                                isLearned ? 'learned' : ''
                                            }`}
                                            onClick={(e) => (
                                                e.stopPropagation(),
                                                handleClickUsedWord(uv)
                                            )}
                                        >
                                            {uv}
                                            {verbList && (
                                                <div className="tooltip-text">
                                                    {verbList.find(
                                                        (verb) =>
                                                            verb.word === uv
                                                    )?.def.tr ?? ''}
                                                </div>
                                            )}
                                        </span>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
