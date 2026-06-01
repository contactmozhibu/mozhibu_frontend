import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./en.json";
import ta from "./ta.json";

// Load saved language preference from localStorage
const savedLang = localStorage.getItem("lang") || "en";

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      ta: { translation: ta }
    },
    lng: savedLang,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false
    },
    // Prevent memory leak: initialize immediately
    react: {
      useSuspense: false
    }
  });

// Update HTML lang attribute when language changes
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng;
  document.documentElement.dir = lng === "ta" ? "ltr" : "ltr"; // Both LTR, but could extend for RTL langs
  localStorage.setItem("lang", lng);
});

// Set initial language
document.documentElement.lang = savedLang;

export default i18n;

