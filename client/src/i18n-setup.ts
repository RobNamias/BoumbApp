// SANITY CHECK: No imports at all.
console.log("i18n-setup loaded - SANITY CHECK");

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';
import fr from './locales/fr.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: true,
    resources: {
      en: { translation: en },
      fr: { translation: fr }
    },
    fallbackLng: 'fr',
    react: {
      useSuspense: false
    },
    interpolation: {
      escapeValue: false
    }
  });

// eslint-disable-next-line import/no-named-as-default-member
export default i18n;
