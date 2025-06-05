import './App.scss';
import { useEffect, useState } from 'react';
import { Header } from '../src/components/header/Header';
import { Route, Routes } from 'react-router-dom';
import '././i18n/i18n'; // Initialize i18n

import { Reading } from './components/pages/Reading/Reading';
import { Listening } from './components/pages/Listening/Listening';
import { Quiz } from './components/pages/Quiz/Quiz';
import { NoMatch } from './components/pages/NoMatch';
import { Words } from './components/pages/Words/Words';
import { Home } from './components/pages/Home/Home';
import { Login } from './components/pages/login/Login';
import { Footer } from './components/Footer/footer';

import { getVerbList, verbLevelE } from './API/VerbList/verb';
import { Verb } from './modules/verbs/verbs.type';
import { VerbDetails } from './components/pages/Worddetails/Worddetails';

import { sortVerbsOrderLerning } from './utils/util';
import { TextDetails } from './components/pages/TextDetails/TextDetails';
import { UserProvider } from './context/userContext/userContext';
import { setSeo } from './utils/seo';
import { ChatBot } from './components/ChatBot/chatBot';
import { Button } from './components/Button/button';
import { chatBotWithoutBg } from './images/image';
import { Dashboard } from './components/pages/Dashboard/dashboard';
import { defaultConfig } from './config/defaultConfig';
import { Popup } from './components/Popup/popup';
import i18n from '././i18n/i18n';
export interface AppConfig {
    baseApiPath: string;
    allowedOrigin: string;
    apiKey: string;
}

let config: AppConfig;

export const loadConfig = async () => {
    const isLocalhost = window.location.hostname === 'localhost';
    const configFile = isLocalhost ? '/config.dev.json' : '/config.prod.json';
    try {
        const response = await fetch(configFile);
        const customConfig = await response.json();
        config = { ...defaultConfig(), ...customConfig };
    } catch (error) {
        console.error(error);
    }
};

export const getCustomConfig = () => config;

export type UserInfo = {
    name: string;
    lasName: string;
    token: string;
};
function App(): JSX.Element {
    const [verbList, setVerbList] = useState<Verb[]>([]);
    const [showChat, setShowChat] = useState<boolean>(false);
    const [showPopup, setShowPopup] = useState<boolean>(false);
    const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

    useEffect(() => {
        const getVerbListA = async (): Promise<void> => {
            const verbs = await getVerbList({ level: verbLevelE.A1 });
            verbs && setVerbList(sortVerbsOrderLerning(verbs));
        };
        try {
            void getVerbListA();
        } catch (error) {
            console.log(error);
        }

        setSeo(
            'Deutsch-Turkish App',
            'Lerne Deutsch mit verschiedenen Übungen'
        );

        window.addEventListener(
            'beforeinstallprompt',
            handleBeforeInstallprompt
        );

        return () => {
            window.removeEventListener(
                'beforeinstallprompt',
                handleBeforeInstallprompt
            );
        };
    }, []);

    const handleBeforeInstallprompt = (e: any) => {
        e.preventDefault();
        setDeferredPrompt(e);
        setShowPopup(true);
    };

    const handleInstallClick = () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        setDeferredPrompt(null);
        setShowPopup(false);
    };

    return (
        <UserProvider>
            <div className="App">
                <Header />
                <main className="main">
                    <Routes>
                        <Route index path="/" element={<Home />} />
                        <Route index path="/home" element={<Home />} />
                        <Route
                            path="/reading"
                            element={<Reading verbList={verbList} />}
                        />
                        <Route
                            path="/listening"
                            element={<Listening verbList={verbList} />}
                        />
                        <Route
                            path="/words"
                            element={<Words words={verbList} />}
                        />
                        <Route
                            path="/quiz/:word/:qtype/:tense/:quizOpt"
                            element={<Quiz verbList={verbList} />}
                        />
                        <Route
                            path="/quiz"
                            element={<Quiz verbList={verbList} />}
                        />
                        <Route
                            path="/wordDetails/:word"
                            element={<VerbDetails verbList={verbList} />}
                        />
                        <Route
                            path="/reading/:textId"
                            element={<TextDetails />}
                        />
                        <Route path="/login" element={<Login />}></Route>
                        <Route
                            path="/dashboard"
                            element={<Dashboard verbList={verbList} />}
                        ></Route>
                        <Route path="*" element={<NoMatch />} />
                    </Routes>
                </main>

                <Footer />
                <div className="chatBot" style={{}}>
                    <ChatBot
                        className={!showChat ? 'hidden' : 'show'}
                        setShowChat={setShowChat}
                    ></ChatBot>
                    {!showChat && (
                        <Button
                            type="secondary"
                            onClick={() => setShowChat(!showChat)}
                        >
                            <img
                                src={chatBotWithoutBg}
                                alt="message"
                                title="Chat with AI to learn german"
                            />
                        </Button>
                    )}
                </div>
                {showPopup && (
                    <Popup
                        className="pwa-install-popup"
                        isOpen={showPopup}
                        onClose={() => setShowPopup(false)}
                    >
                        <div>
                            <p>{i18n.t('App.Pwa.Popup.Text')}</p>
                        </div>
                        <div className="button-wrapper">
                            <Button type="primary" onClick={handleInstallClick}>
                                {i18n.t('App.Pwa.Popup.Button.Accept.Txt')}{' '}
                            </Button>
                            <Button
                                type="secondary"
                                onClick={() => setShowPopup(false)}
                            >
                                {i18n.t('App.Pwa.Popup.Button.Cancel.Txt')}{' '}
                            </Button>
                        </div>
                    </Popup>
                )}
            </div>
        </UserProvider>
    );
}

export default App;
