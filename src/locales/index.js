/* eslint-disable no-prototype-builtins */
import en from './en';
import zh from './zh';

export const replace = (template, data = {}) =>
  template.replace(/{(\w*)}/g, (_, key) => (data.hasOwnProperty(key) ? data[key] : ''));

export const createTranslator = ({ translations, fallbackLocale = 'en' }) => {
  return (key, locale = fallbackLocale, data = {}) => {
    // @ts-ignore
    if (!translations[locale] || !translations[locale][key]) {
      if (fallbackLocale && translations[fallbackLocale]?.[key]) {
        // @ts-ignore
        return replace(translations[fallbackLocale]?.[key], data);
      }

      return key;
    }

    // @ts-ignore
    return replace(translations[locale][key], data);
  };
};

// eslint-disable-next-line import/prefer-default-export
export const translations = {
  zh,
  en,
};

export const translate = createTranslator({ translations });
