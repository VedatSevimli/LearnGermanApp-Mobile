import React, { useEffect, useRef, useState } from 'react';
import {
    getVideoTranscript,
    videoDataType
} from '../../../API/Listening/fetchYouTubeVideos';
import { Question, TensesE, Verb } from '../../../modules/verbs/verbs.type';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { chevron_svg, play_circle } from '../../../images/image';
import Dialog from '../../Dialog/dialog';
import DialogHeader from '../../Dialog/DialogHeader/dialogHeader';
import { geminiPrompt } from '../../../API/AI/gemini';
import { MultipleChoice } from '../../MultipleChoice/multipleChoice';
import { TruncatedText } from '../../TruncatedText/truncatedText';
import { Button } from '../../Button/button';
import DialogBody from '../../Dialog/DialogBody/dialogBody';

type VideoPlayerYouTubeP = {
    videoData: videoDataType;
    verbList: Verb[];
    learnedWords: string[] | undefined;
};
export const VideoPlayerYouTube: React.FC<VideoPlayerYouTubeP> = (
    props: VideoPlayerYouTubeP
) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const { videoId } = props.videoData.id;
    const { title, thumbnails } = props.videoData.snippet;
    const [usedVerbs, setUsedVerbs] = useState<{
        verbs: Verb[];
        isLoading: boolean;
    }>({ verbs: [], isLoading: false });
    const [showVideo, setShowVideo] = useState<boolean>(false);
    const [questions, setQuestions] = useState<{
        isLoading: boolean;
        questions: Question[];
    }>({ isLoading: false, questions: [] });
    const [startQuiz, setStartQuiz] = useState<boolean>(false);
    const [showUsedVerbs, setShowUsedVerbs] = useState<boolean>(false);
    const videoTranscriptRef = useRef<string>('');

    useEffect(() => {
        showUsedVerbs && void getVideoTranscr(videoId);
    }, [showUsedVerbs]);

    useEffect(() => {
        const generateQuestions = async () => {
            {
                try {
                    setQuestions({ isLoading: true, questions: [] });
                    const prompt = getQuizPrompt(videoTranscriptRef.current);
                    const res = await geminiPrompt(prompt);

                    const cleaned = res.output
                        .replace(/```json|```/g, '')
                        .trim();
                    const data = JSON.parse(cleaned);

                    setQuestions({ isLoading: false, questions: data });
                } catch (error) {
                    setQuestions({ isLoading: false, questions: [] });
                }
            }
        };

        videoTranscriptRef.current &&
            startQuiz &&
            !questions.questions.length &&
            void generateQuestions();
    }, [startQuiz]);

    const handleStartQuiz = async () => {
        await getVideoTranscr(videoId);
        setStartQuiz(true);
    };

    const getVideoTranscr = async (videoId: string) => {
        try {
            if (usedVerbs.verbs.length) {
                return;
            }
            setUsedVerbs({ verbs: [], isLoading: true });
            const videoTranscript = await getVideoTranscript(videoId);
            const transScript = videoTranscript.map((vt) => vt.text).join(' ');
            videoTranscriptRef.current = transScript;

            const verbs = findVerbsInText(transScript, props.verbList);
            setUsedVerbs({ verbs, isLoading: false });
        } catch (err) {
            setUsedVerbs({ verbs: [], isLoading: false });
        }
    };

    const renderVideo = () => {
        return (
            <Dialog className="video-dialog">
                <DialogHeader onDismiss={() => setShowVideo(false)}>
                    <h3>{title}</h3>
                </DialogHeader>
                <div className="iframe-container">
                    <iframe
                        src={`https://www.youtube.com/embed/${videoId}`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </Dialog>
        );
    };

    const renderMultipleChoice = (): JSX.Element => {
        return questions.questions.length ? (
            <MultipleChoice
                verbList={props.verbList}
                questionType="conjugation"
                tense={TensesE.presens}
                mixedQuestions={questions.questions}
            ></MultipleChoice>
        ) : (
            <div className="noQuestions">
                <p>{t('Listening.Video.Quizz.No.Question')}</p>
            </div>
        );
    };

    const renderQuiz = () => {
        return (
            <Dialog className="video-dialog">
                <DialogHeader onDismiss={() => setStartQuiz(false)}>
                    <h3>{title}</h3>
                </DialogHeader>
                <DialogBody>
                    {questions.isLoading ? (
                        <LoadingSpinner
                            isLoading={questions.isLoading}
                            message="Quizz is loading..."
                        ></LoadingSpinner>
                    ) : (
                        renderMultipleChoice()
                    )}
                </DialogBody>
            </Dialog>
        );
    };

    return (
        <div className="video-container">
            <TruncatedText
                linesToShow={1}
                text={title}
                style={{ fontWeight: 'bold' }}
            ></TruncatedText>

            <div className="img-container" onClick={() => setShowVideo(true)}>
                <img src={thumbnails.high.url} alt={title} />
                <img className="play-icon" src={play_circle}></img>
            </div>

            <div
                className="used-verbs-header"
                onClick={() => setShowUsedVerbs(!showUsedVerbs)}
            >
                <h3>{t('Listening.Used.Verbs.Header')}</h3>
                <span>
                    <img
                        className={`chevron-icon ${showUsedVerbs ? 'up' : ''}`}
                        src={chevron_svg}
                    ></img>
                </span>
            </div>
            {showUsedVerbs && (
                <div className="used-verbs-container">
                    {usedVerbs.isLoading ? (
                        <LoadingSpinner
                            isLoading={usedVerbs.isLoading}
                            message={t('Listening.Used.Verbs.Loading')}
                        ></LoadingSpinner>
                    ) : (
                        usedVerbs.verbs.map((uv, idx) => {
                            const isLearned = props.learnedWords?.includes(
                                uv.word
                            );
                            const { tr, en } =
                                props.verbList.find(
                                    (verb) =>
                                        props.verbList && verb.word === uv.word
                                )?.def ?? {};

                            return (
                                <span
                                    key={idx}
                                    className={`used-verb ${
                                        isLearned ? 'learned' : ''
                                    }`}
                                    onClick={(e) => (
                                        e.stopPropagation(),
                                        navigate(`/wordDetails/${uv.word}`)
                                    )}
                                >
                                    {uv.word}
                                    {props.verbList && (
                                        <div className="tooltip-text">
                                            {tr || en}
                                        </div>
                                    )}
                                </span>
                            );
                        })
                    )}
                </div>
            )}

            <div className="quiz-btn-wrapper">
                <Button type="primary" onClick={handleStartQuiz}>
                    {t('Listening.Video.Quizz.Start')}
                </Button>
            </div>

            {showVideo && renderVideo()}
            {startQuiz && renderQuiz()}
        </div>
    );
};

export const findVerbsInText = (text: string, verbs: Verb[]): Verb[] => {
    const wordsInText = text.split(/\s+/);
    const foundVerbs: Verb[] = [];

    verbs.forEach((verb) => {
        const { pastTense, perfect, presens } = verb.conjugation;
        const allConjugations = [...presens, ...perfect, ...pastTense].map(
            (conj) => {
                const conjugation = conj.split(' ');
                return conjugation.at(-1);
            }
        );

        wordsInText.forEach((word) => {
            if (
                allConjugations.some(
                    (cnj) => cnj?.toLocaleLowerCase() === word.toLowerCase()
                )
            ) {
                foundVerbs.push(verb);
            }
        });
    });

    return [...new Set(foundVerbs)];
};

const getQuizPrompt = (text: string, lang = 'turkish') => {
    return `
You will receive a text, and your task is to generate at least 4 simple questions based on it. Format the response as a JSON array of question objects, each containing:

id (a unique number starting from 0),

question (the question text),

options (an array of 10 answer choices, with only one correct option marked "isCorrect": true).

Response Format Example: [  
  {  
    "id": 0,  
    "question": "Ich habe einen Kuchen gemacht",  
    "options": [  
      {"text": "Onlar bir kek yapiyorlar", "isCorrect": false},  
      {"text": "Bir kek yaptım.", "isCorrect": true},  
      {"text": "Dün akşam ev ödevi yaptım.", "isCorrect": false},  
      {"text": "Siz bir hata yaptınız.", "isCorrect": false}  
    ]  
  },  
  {...}  
]  

Rules:

Only return the raw JSON—no additional explanations, headings, or formatting.

Keep questions and answers simple.

Ensure only one correct option per question.

the questions should in german language and the options in german laguage too

the correct answers should not always be at the same option index 

Text to process: ${text}`;
};
