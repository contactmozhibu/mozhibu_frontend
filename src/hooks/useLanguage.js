import { useEffect } from "react";
import { useTranslation } from "react-i18next";

/**
 * Custom hook for handling language persistence and initialization
 * Ensures the app loads in the user's previously selected language
 */
export const useLanguage = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    // Load language preference from localStorage on mount
    const savedLang = localStorage.getItem("lang");
    if (savedLang && savedLang !== i18n.language) {
      i18n.changeLanguage(savedLang);
    }
    
    // Set document language attribute
    document.documentElement.lang = i18n.language;
  }, [i18n]);

  // Function to change language and persist it
  const setLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  };

  return { currentLanguage: i18n.language, setLanguage };
};

export default useLanguage;
