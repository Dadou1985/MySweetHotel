import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18next.use(LanguageDetector).init({
    fallbackLng: 'fr',
    resources: {
        fr: {
            translations: require('./locales/fr/translation.json')
        },
        en: {
            translations: require('./locales/en/translation.json')
        },
        de: {
            translations: require('./locales/de/translation.json')
        },
        es: {
            translations: require('./locales/es/translation.json')
        },
        it: {
            translations: require('./locales/it/translation.json')
        },
        pt: {
            translations: require('./locales/pt/translation.json')
        },
    },
    ns: ['translations'],
    defaultNS: 'translations',
    returnObjects: true,
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
        escapeValue: false, // not needed for react!!
    },
    react: {
        wait: true,
    },
});

i18next.languages = ['fr', 'en', 'es', 'de', 'it', 'pt'];

export default i18next;