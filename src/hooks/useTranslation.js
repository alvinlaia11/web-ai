import { translations } from '../locales/translations'

export const useTranslation = (language = 'id') => {
  const t = (key) => {
    const keys = key.split('.')
    let value = translations[language]
    
    for (const k of keys) {
      if (value && value[k]) {
        value = value[k]
      } else {
        return key
      }
    }
    
    return value
  }

  return { t }
}
