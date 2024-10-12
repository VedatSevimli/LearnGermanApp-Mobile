import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import enTranslations from './locales/en/translation.json';
import deTranslations from './locales/de/translation.json';
import trTranslations from './locales/tr/translation.json';

const savedLanguage = localStorage.getItem('language') || 'de';

async function initI18n() {
    await i18n.use(initReactI18next).init({
        resources: {
            en: {
                translation: enTranslations
            },
            de: {
                translation: deTranslations
            },
            tr: {
                translation: trTranslations
            }
        },
        lng: savedLanguage,
        fallbackLng: 'de',
        interpolation: {
            escapeValue: false
        }
    });
}

initI18n().catch((error) => {
    console.error('Failed to initialize i18n:', error);
});

export default i18n;
