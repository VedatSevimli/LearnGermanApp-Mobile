import React from 'react';
import './Home.scss';
import { Link } from 'react-router-dom';
import { listening, quiz, reading, words } from '../../../images/image';
import { setSeo } from '../../../utils/seo';

export const Home: React.FC = (): JSX.Element => {
    setSeo(
        'Deutsch-Turkish App - Home',
        'Mit unserer App können Sie schnell Deutsch lernen. Wir bieten Ihnen eine umfangreiche Sammlung von 1000 Verben und zahlreichen Substantiven, um Ihren Wortschatz zu erweitern.Unsere interaktive Plattform sorgt für ein intensives Lernerlebnis und macht das Erlernen der deutschen Sprache zu einer angenehmen Reis'
    );
    return (
        <div className="home-container">
            <div className="home-banner">
                <h1>Willkommen bei unserer Deutsch-Lern-App</h1>
                <p>
                    Mit unserer App können Sie schnell Deutsch lernen. Wir
                    bieten Ihnen eine umfangreiche Sammlung von 1000 Verben und
                    zahlreichen Substantiven, um Ihren Wortschatz zu erweitern.
                </p>
                <p>
                    Unsere interaktive Plattform sorgt für ein intensives
                    Lernerlebnis und macht das Erlernen der deutschen Sprache zu
                    einer angenehmen Reise.
                </p>
            </div>

            <section className="features-section">
                <div className="feature">
                    <div className="img-container">
                        <img src={quiz} alt="Quiz" />
                    </div>
                    <h2>Quiz</h2>
                    <p>
                        Testen Sie Ihr Wissen mit fesselnden Quizfragen, die das
                        Ihr Lernen.
                    </p>
                    <Link to="/quiz">Quiz starten</Link>
                </div>

                <div className="feature">
                    <div className="img-container">
                        <img src={reading} alt="Reading" />
                    </div>
                    <h2>Lesen</h2>
                    <p>
                        Verbessern Sie Ihre Lesekompetenz mit verschiedenen
                        Texten, die für unterschiedliche Leistungsniveaus.
                    </p>
                    <Link to="/reading">Lesen beginnen</Link>
                </div>

                <div className="feature">
                    <div className="img-container">
                        <img src={words} alt="Word" />
                    </div>
                    <h2>Wörter</h2>
                    <p>
                        Erweitern Sie Ihren Wortschatz durch interaktive Übungen
                        und Vokabel-Lernmodule.
                    </p>
                    <Link to="/words">Wörter erkunden</Link>
                </div>

                <div className="feature">
                    <div className="img-container">
                        <img src={listening} alt="Listening" />
                    </div>
                    <h2>Hören</h2>
                    <p>
                        Verbessern Sie Ihr Hörverstehen mit einer Vielzahl von
                        Audiomaterialien.
                    </p>
                    <Link to="/listening">Hören beginnen</Link>
                </div>
            </section>
        </div>
    );
};
