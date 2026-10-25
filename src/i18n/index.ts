import { uz } from './uz';
import { ru } from './ru';
import { en } from './en';
import { Language } from '../types';

export const translations = {
  uz,
  ru,
  en,
};

export function getT(lang: Language) {
  return translations[lang] || translations.uz;
}
