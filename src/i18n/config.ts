// Global Language Map
export const langMap: Record<string, string[]> = {
  ko: ['ko-KR'],
  en: ['en-US'],
}

// Giscus Language Map
// https://giscus.app/
export const giscusLocaleMap: Record<string, string> = {
  ko: 'ko',
  en: 'en',
}

// Waline Language Map
// https://waline.js.org/en/guide/features/i18n.html
export const walineLocaleMap: Record<string, string> = {
  ko: 'ko-KR',
  en: 'en-US',
}

// Supported Languages
export const supportedLangs = Object.keys(langMap).flat()
