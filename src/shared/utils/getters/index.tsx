export type currentLangType  = "ru" | "uz" | "en";

export const getCurrentLang = (): currentLangType => {
  const lang = localStorage.getItem("i18nextLng") || "ru";

  return lang as currentLangType;
};