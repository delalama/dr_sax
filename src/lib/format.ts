type AppLang = "es" | "en" | "ca";

const DATE_LOCALE_BY_LANG: Record<AppLang, string> = {
  es: "es-ES",
  en: "en-GB",
  ca: "ca-ES"
};

export function formatDate(input: string, lang: AppLang = "es") {
  const date = new Date(input);
  const locale = DATE_LOCALE_BY_LANG[lang] ?? DATE_LOCALE_BY_LANG.es;

  return new Intl.DateTimeFormat(locale, {
    day: "2-digit",
    month: "long",
    year: "numeric"
  }).format(date);
}
