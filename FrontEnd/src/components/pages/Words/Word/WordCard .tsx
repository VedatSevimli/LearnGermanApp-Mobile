import React, { useState } from 'react';

import { Verb } from '../../../../modules/verbs/verbs.type';
import { useNavigate } from 'react-router-dom';
import ProgressBar from '../../../ProgressBar/progressBar';
import { UserData } from '../../../../modules/login/login.type';
import { Popup } from '../../../Popup/popup';
import { Button } from '../../../Button/button';
import { geminiPrompt } from '../../../../API/AI/gemini';
import LoadingSpinner from '../../../LoadingSpinner/LoadingSpinner';
import { Popover } from '../../../Popover/popover';
import { useTranslation } from 'react-i18next';
import { getLanguageFromISO } from '../../../../utils/util';

type WordProps = {
    wordData: Verb;
    classes: string[];
    userData: UserData;
};

export const WordCard: React.FC<WordProps> = ({
    wordData,
    classes,
    ...props
}) => {
    const {
        word,
        def,
        isReflexiv,
        isSeparable,
        hasAkkObject,
        hasDativObject,
        isModalVerb
    } = wordData;
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [isOpen, setIsOpen] = React.useState<boolean>(false);
    const [openInfoPopup, setOpenInfoPopup] = React.useState<{
        isLoading: boolean;
        isOpen: boolean;
        info: string;
    }>({ isOpen: false, info: '', isLoading: true });
    const [popoverPos, setPopoverPos] = useState<{
        top: number;
        left: number;
        width: number;
        height: number;
    }>();

    const handleCardClick = () => {
        if (!props.userData) {
            setIsOpen(true);
        } else {
            navigate(`/wordDetails/${word}`);
        }
    };

    const learnProgress =
        props.userData?.progress.find((p) => p.word === word)?.progress ?? 0;

    const handleInfoClick = async (
        ev: React.MouseEvent<HTMLDivElement, MouseEvent>,
        info: string
    ) => {
        ev.stopPropagation();
        const rect = JSON.parse(
            JSON.stringify(ev.currentTarget.getBoundingClientRect())
        );
        adjustPopoverPosition(rect);
        const promptToGemini = `Erkläre mir bitte ${info}  mit 5 einfachen deutschen Sätzen mit verb ${word}. Du musst das auf ${getLanguageFromISO(
            localStorage.getItem('language') ?? 'de'
        )} erklären.`;
        setOpenInfoPopup({ isLoading: true, isOpen: true, info: '' });
        const res = await geminiPrompt(promptToGemini);
        setOpenInfoPopup({
            isLoading: false,
            isOpen: true,
            info: res.output.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        });
    };

    const adjustPopoverPosition = (rect: DOMRect) => {
        const popoverPadding = 16;
        const maxPopoverWidth = 375;
        const maxPopoverHeight = 500;

        const spaceAbove = rect.top - popoverPadding;
        const spaceBelow = window.innerHeight - rect.bottom - popoverPadding;
        const spaceLeft = rect.left - popoverPadding;
        const spaceRight = window.innerWidth - rect.right - popoverPadding;

        let popoverWidth = Math.min(
            maxPopoverWidth,
            window.innerWidth - popoverPadding * 2
        );
        let popoverHeight = Math.min(
            maxPopoverHeight,
            window.innerHeight - popoverPadding * 2
        );

        // Adjust width and height based on available space
        if (spaceRight >= popoverWidth) {
            popoverWidth = Math.min(popoverWidth, spaceRight);
        } else if (spaceLeft >= popoverWidth) {
            popoverWidth = Math.min(popoverWidth, spaceLeft);
        }

        if (spaceBelow >= popoverHeight) {
            popoverHeight = Math.min(popoverHeight, spaceBelow);
        } else if (spaceAbove >= popoverHeight) {
            popoverHeight = Math.min(popoverHeight, spaceAbove);
        }

        let top = rect.bottom + window.scrollY + popoverPadding;
        let left = rect.left + window.scrollX;

        // Vertical position adjustments
        if (spaceBelow < popoverHeight && spaceAbove > popoverHeight) {
            top = rect.bottom - popoverHeight + window.scrollY - popoverPadding;
            popoverHeight = spaceAbove;
        } else if (spaceBelow > popoverHeight) {
            top = rect.bottom + window.scrollY + popoverPadding;
            popoverHeight = spaceBelow;
        } else {
            top = 0;
        }

        // Horizontal position adjustments
        if (spaceRight < popoverWidth && spaceLeft > popoverWidth) {
            left = rect.right - popoverWidth + window.scrollX - popoverPadding;
        } else if (spaceRight > popoverWidth) {
            left = rect.left + window.scrollX + popoverPadding;
            popoverWidth = spaceRight;
        } else {
            left = 0;
        }

        setPopoverPos({
            top,
            left,
            width: popoverWidth,
            height: popoverHeight
        });
    };

    const renderInfoPopup = () => {
        return (
            <Popover
                className="grammer-info-popover"
                isOpen={openInfoPopup.isOpen}
                autoPosition
                style={{ ...popoverPos }}
                onDismiss={() =>
                    setOpenInfoPopup({
                        info: '',
                        isLoading: false,
                        isOpen: false
                    })
                }
            >
                <div className="info-contnet">
                    <LoadingSpinner
                        isLoading={openInfoPopup.isLoading}
                        message={t('WordCard.Verb.Info.Popover.Loading.Txt')}
                    ></LoadingSpinner>
                    <p
                        dangerouslySetInnerHTML={{
                            __html: openInfoPopup.info
                        }}
                    ></p>
                    {!openInfoPopup.isLoading && (
                        <Button
                            onClick={() => navigate(`/wordDetails/${word}`)}
                        >
                            {t('WordCard.Verb.Info.Popover.Btn.Text', {
                                verb: word
                            })}
                        </Button>
                    )}
                </div>
            </Popover>
        );
    };

    return (
        <>
            <div
                className={`word-card ${
                    isModalVerb ? 'modal-verb' : ''
                } ${classes.join(' ')}`}
                onClick={handleCardClick}
            >
                <h2>{word}</h2>
                <p>{def?.tr}</p>
                <p>{def?.en}</p>
                <div className="bottom-section">
                    {hasAkkObject && (
                        <div
                            className="info-label info-label-akk"
                            onClick={(e) => {
                                void handleInfoClick(e, 'Akkusativ');
                            }}
                        >
                            {t('WordCard.Verb.Info.Akk')}
                        </div>
                    )}
                    {hasDativObject && (
                        <div
                            className="info-label info-label-dativ"
                            onClick={(e) => {
                                void handleInfoClick(e, 'Dativ');
                            }}
                        >
                            {t('WordCard.Verb.Info.Dativ')}
                        </div>
                    )}
                    {isReflexiv && (
                        <div
                            className="info-label info-label-reflexiv"
                            onClick={(e) => {
                                void handleInfoClick(e, 'Reflexiv');
                            }}
                        >
                            {t('WordCard.Verb.Info.Reflexiv')}
                        </div>
                    )}
                    {isSeparable && (
                        <div
                            className="info-label info-label-separable"
                            onClick={(e) => {
                                void handleInfoClick(e, 'Trennbare Verben');
                            }}
                        >
                            {t('WordCard.Verb.Info.Sperable')}
                        </div>
                    )}
                    {isModalVerb && (
                        <div
                            className="info-label info-label-modal"
                            onClick={(e) => {
                                void handleInfoClick(e, 'modal verben');
                            }}
                        >
                            {t('WordCard.Verb.Info.ModalVerb')}
                        </div>
                    )}
                </div>

                {wordData.imageUrl ? (
                    <img
                        src={wordData.imageUrl}
                        alt="test"
                        className="verbImg"
                    />
                ) : null}

                <div className="progress-bar-wrapper">
                    <ProgressBar
                        percentage={
                            classes.includes('disable') ? 0 : learnProgress
                        }
                    />
                </div>
            </div>

            {isOpen && (
                <Popup isOpen={isOpen} onClose={() => setIsOpen(false)}>
                    <div className="popup-info">
                        {t('WordCard.Login.Info.Text')}

                        <div className="btn-wrapper">
                            <Button
                                type="secondary"
                                onClick={() => navigate(`/wordDetails/${word}`)}
                            >
                                {t('WordCard.Login.Info.Continue')}
                            </Button>
                            <Button
                                type="primary"
                                onClick={() => navigate('/login')}
                            >
                                {t('WordCard.Login.Info.LoggIn')}
                            </Button>
                        </div>
                    </div>
                </Popup>
            )}

            {openInfoPopup.isOpen && renderInfoPopup()}
        </>
    );
};
