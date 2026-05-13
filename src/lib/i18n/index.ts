import { getLocales } from 'expo-localization';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEn from './locales/en/translation.json';
import validationEn from './locales/en/validation.json';
import translationZh from './locales/zh-CN/translation.json';
import validationZh from './locales/zh-CN/validation.json';

const resources = {
  en: { translation: translationEn, validation: validationEn },
  zh: { translation: translationZh, validation: validationZh },
};

const initI18n = async () => {
  const locale = getLocales()[0]?.languageCode ?? 'en';

  i18n.use(initReactI18next).init({
    resources,
    lng: locale,
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;

export const requiredMessage = (field: string) => {
  return i18n.t('required', {
    ns: 'validation',
    field: field,
  });
};
