import React from 'react';
import './Home.scss';
import { Link } from 'react-router-dom';
import { listening, quiz, reading, words } from '../../../images/image';
import { setSeo } from '../../../utils/seo';
import { useTranslation } from 'react-i18next';

export const Home: React.FC = (): JSX.Element => {
    const { t } = useTranslation();
    setSeo(
        'Deutsch-Turkish App - Home',
        'Mit unserer App können Sie schnell Deutsch lernen. Wir bieten Ihnen eine umfangreiche Sammlung von 1000 Verben und zahlreichen Substantiven, um Ihren Wortschatz zu erweitern.Unsere interaktive Plattform sorgt für ein intensives Lernerlebnis und macht das Erlernen der deutschen Sprache zu einer angenehmen Reis'
    );
    return (
        <div className="home-container">
            <div className="home-banner" style={{ display: 'none' }}>
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
                        <img
                            src={words}
                            alt="Word"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                    <h2> {t('Home.Word.Info.Text.Header')}</h2>
                    <p>{t('Home.Word.Info.Text.Content')}</p>
                    <Link to="/words">{t('Home.Word.Info.Text.Footer')} </Link>
                </div>

                <div className="feature">
                    <div className="img-container">
                        <img
                            src={quiz}
                            alt="Quiz"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                    <h2> {t('Home.Quiz.Info.Text.Header')}</h2>
                    <p>{t('Home.Quiz.Info.Text.Content')}</p>
                    <Link to="/quiz"> {t('Home.Quiz.Info.Text.Footer')}</Link>
                </div>

                <div className="feature">
                    <div className="img-container">
                        <img
                            src={reading}
                            alt="Reading"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                    <h2>{t('Home.Reading.Info.Text.Header')}</h2>
                    <p>{t('Home.Reading.Info.Text.Content')}</p>
                    <Link to="/reading">
                        {t('Home.Reading.Info.Text.Footer')}
                    </Link>
                </div>

                <div className="feature">
                    <div className="img-container">
                        <img
                            src={listening}
                            alt="Listening"
                            loading="lazy"
                            decoding="async"
                        />
                    </div>
                    <h2>{t('Home.Listening.Info.Text.Header')}</h2>
                    <p>{t('Home.Listening.Info.Text.Content')}</p>
                    <Link to="/listening">
                        {t('Home.Listening.Info.Text.Footer')}
                    </Link>
                </div>
            </section>
        </div>
    );
};
