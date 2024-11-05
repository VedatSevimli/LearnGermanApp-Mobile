import React, { useEffect, useRef, useState } from 'react';
import {
    getVideoTranscript,
    videoDataType
} from '../../../API/Listening/fetchYouTubeVideos';
import { TensesE, Verb } from '../../../modules/verbs/verbs.type';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LoadingSpinner from '../../LoadingSpinner/LoadingSpinner';
import { play_circle } from '../../../images/image';
import Dialog from '../../Dialog/dialog';
import DialogHeader from '../../Dialog/DialogHeader/dialogHeader';
import { geminiPrompt } from '../../../API/AI/gemini';
import { MultipleChoice } from '../../MultipleChoice/multipleChoice';
import { TruncatedText } from '../../TruncatedText/truncatedText';

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
    const [questions, setQuestions] = useState<any>([]);
    const [startQuiz, setStartQuiz] = useState<boolean>(false);
    const videoTranscriptRef = useRef<string>('');

    useEffect(() => {
        const getVideoTranscr = async (videoId: string) => {
            try {
                setUsedVerbs({ verbs: [], isLoading: true });
                const videoTranscript = await getVideoTranscript(videoId);
                const transScript = videoTranscript
                    .map((vt) => vt.text)
                    .join(' ');
                videoTranscriptRef.current = transScript;

                const usedVerbs = findVerbsInText(transScript, props.verbList);
                setUsedVerbs({ verbs: usedVerbs, isLoading: false });
            } catch (err) {
                setUsedVerbs({ verbs: [], isLoading: false });
                console.error(err);
            }
        };
        void getVideoTranscr(videoId);
    }, []);

    useEffect(() => {
        const generateQuestions = async () => {
            {
                try {
                    const prompt = defaultPrompt + videoTranscriptRef.current;
                    const res = await geminiPrompt(videoTranscriptRef.current);
                    setQuestions(
                        JSON.parse(
                            res.output.replace(/\n/g, '').replace(/'/g, '"')
                        )
                    );
                } catch (error) {
                    console.log(error);
                }
            }
        };

        videoTranscriptRef && startQuiz && void generateQuestions();
    }, [startQuiz]);

    const handleStartQuiz = () => {
        setStartQuiz(true);
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

    const renderQuiz = () => {
        return (
            <Dialog className="video-dialog">
                <DialogHeader onDismiss={() => setShowVideo(false)}>
                    <h3>{title}</h3>
                </DialogHeader>
                <MultipleChoice
                    verbList={props.verbList}
                    questionType="conjugation"
                    tense={TensesE.presens}
                    mixedQuestions={questions}
                ></MultipleChoice>
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

            <h3>{t('Listening.Used.Verbs.Header')}</h3>
            <div className="used-verbs-container">
                {usedVerbs.isLoading ? (
                    <LoadingSpinner
                        isLoading={usedVerbs.isLoading}
                        message={t('Listening.Used.Verbs.Loading')}
                    ></LoadingSpinner>
                ) : (
                    usedVerbs.verbs.map((uv, idx) => {
                        const isLearned = props.learnedWords?.includes(uv.word);
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

const defaultPrompt =
    // eslint-disable-next-line quotes
    "i will give you a text and you have to read the text and create questions from this text. at least 5 questions you have to generate. The questions should be simple sentences. Dont put any thing before the response. it should look like  this example for you: [{ 'id': 0, 'question': 'Ich habe einen Kuchen gemacht', 'options': [ {'text': 'Onlar bir kek yapiyorlar', 'isCorrect': false }, { text': 'Bir kek yaptım.','isCorrect': true   },  { 'text': 'Dün akşam ev ödevi yaptım.','isCorrect': false},{'text': 'Siz bir hata yaptınız.','isCorrect': false}]},{...},{...}, ...], here is the text: ";
