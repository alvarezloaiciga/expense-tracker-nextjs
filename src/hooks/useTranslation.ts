"use client"

import { useLocale } from "@/contexts/LocaleContext";
import enTranslations from '@/locales/en.json';
import esTranslations from '@/locales/es.json';

const translations = { en: enTranslations, es: esTranslations };

export function useTranslation() {
  const { locale, setLocale } = useLocale();

  const t = (key: string, params?: Record<string, string | number>) => {
    const keys = key.split('.');
    let value: any = translations[locale] || translations.en;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = translations.en;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key;
          }
        }
        break;
      }
    }
    if (typeof value === 'string' && params) {
      return value.replace(/\{(\w+)\}/g, (match, param) => {
        return params[param]?.toString() || match;
      });
    }
    return value || key;
  };

  const changeLocale = (newLocale: "en" | "es") => setLocale(newLocale);

  return { t, locale, changeLocale, isRTL: false };
} 