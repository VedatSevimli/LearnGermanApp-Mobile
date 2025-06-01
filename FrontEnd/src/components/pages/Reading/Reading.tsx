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
import { useTranslation } from 'react-i18next';
import { reading_fallback_image } from '../../../images/image';
import { Popup } from '../../Popup/popup';
import { Button } from '../../Button/button';

type ReadingProps = {
    verbList?: Verb[];
};

export const Reading: React.FC<ReadingProps> = ({
    verbList
}: ReadingProps): JSX.Element => {
    const navigate = useNavigate();
    const { userData } = useUser();
    const { t } = useTranslation();

    const [readingTexts, setReadingTexts] = useState<ITextData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isMounted = useRef<boolean>(false);
    const [openPopup, setOpenPopup] = useState<{
        isOpen: boolean;
        infoMessage?: string;
    }>();

    useEffect(() => {
        isMounted.current = true;
        const getTexts = async () => {
            setIsLoading(true);
            const texts = await getReadingTexts();
            isMounted.current && setIsLoading(false);
            isMounted.current && setReadingTexts(() => texts);
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
        const textData = readingTexts.find((text) => text.textId === textId);
        const isLearnedEveryUsedVerb = textData?.usedVerbs.every((uv) =>
            userData?.progress.map((ud) => ud.word).includes(uv)
        );

        if (userData && isLearnedEveryUsedVerb) {
            navigate(`/reading/${textId}`);
        } else {
            setOpenPopup({
                isOpen: true,
                infoMessage: t('Reading.Popup.Info.Text')
            });
        }
    };

    const learnedWords = userData?.progress.map((p) => p.word);

    if (isLoading) {
        return <LoadingOverlay></LoadingOverlay>;
    }

    return (
        <div className="reading">
            {readingTexts.map((text, idx) => {
                const showText = text.usedVerbs.every((uv) =>
                    learnedWords?.includes(uv)
                );
                return (
                    <div
                        key={idx}
                        className="text-card-wrapper"
                        onClick={() => handleClickText(idx)}
                    >
                        <div className="img-container">
                            <img
                                src={text.image ?? reading_fallback_image}
                                alt=""
                            />
                        </div>
                        {
                            <TruncatedText
                                text={text.text.replace(/<\/?strong>/g, '')}
                                linesToShow={3}
                                style={{
                                    filter: !showText ? 'blur(3px)' : '',
                                    margin: '1.5em'
                                }}
                            />
                        }
                        <div className="text-card">
                            {!showText ? (
                                <h3>{t('Reading.TextHeader.Text')}</h3>
                            ) : (
                                <h3>{t('Reading.TextHeader.Used.Verbs')}</h3>
                            )}
                            <div className="used-verbs-wrapper">
                                {text.usedVerbs.map((uv, idx) => {
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

            {openPopup?.isOpen && (
                <Popup
                    isOpen={openPopup.isOpen}
                    onClose={() => setOpenPopup({ isOpen: false })}
                >
                    <div className="popup-info">
                        {openPopup.infoMessage
                            ? openPopup.infoMessage
                            : t('WordCard.Login.Info.Text')}

                        <div className="btn-wrapper">
                            <Button
                                type="primary"
                                onClick={() => setOpenPopup({ isOpen: false })}
                            >
                                Ok
                            </Button>
                        </div>
                    </div>
                </Popup>
            )}
        </div>
    );
};
