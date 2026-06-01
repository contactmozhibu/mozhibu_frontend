import api from "./api";

/**
 * Translate text using backend Gemini API
 * @param {string} text - Text to translate
 * @param {string} targetLang - Target language (e.g., "Tamil", "English")
 * @returns {Promise<string>} Translated text
 */
export const translateText = async (text, targetLang) => {
  try {
    if (!text || !text.trim()) {
      return "";
    }

    const response = await api.post("/translate", {
      text: text.trim(),
      targetLang
    });

    return response.data.translated || text;
  } catch (error) {
    console.error("Translation error:", error);
    return text; // Fallback to original text on error
  }
};

/**
 * Batch translate multiple texts
 * @param {Array<string>} texts - Array of texts to translate
 * @param {string} targetLang - Target language
 * @returns {Promise<Array<string>>} Array of translated texts
 */
export const batchTranslate = async (texts, targetLang) => {
  try {
    const promises = texts.map(text => translateText(text, targetLang));
    return await Promise.all(promises);
  } catch (error) {
    console.error("Batch translation error:", error);
    return texts;
  }
};

export default {
  translateText,
  batchTranslate
};
