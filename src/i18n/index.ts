import enUS from './locales/en-US';
import zhCN from './locales/zh-CN';
import zhTW from './locales/zh-TW';

export type Locale = 'en-US' | 'zh-CN' | 'zh-TW';
export type TranslationKeys = keyof typeof enUS;
export type Translations = Record<TranslationKeys, string>;

export const locales: Record<Locale, Translations> = {
  'en-US': enUS,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
};

export const localeLabels: Record<Locale, string> = {
  'en-US': 'English',
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
};

export const defaultLocale: Locale = 'en-US';
