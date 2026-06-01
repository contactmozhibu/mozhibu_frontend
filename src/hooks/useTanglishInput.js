import { useState, useCallback, useRef } from "react";
import { convertTanglishToTamil, transliterateToTamil, isTanglish } from "../utils/tanglishTransliterator";

/**
 * Hook to enable Tanglish typing for input fields
 * Automatically converts English transliteration to Tamil in real-time
 */
export const useTanglishInput = () => {
  const [isTanglishMode, setIsTanglishMode] = useState(false);

  /**
   * Process text - convert complete words to Tamil
   * Handles: typing, pasting, autocomplete
   */
  const handleTanglishChange = useCallback((text) => {
    if (!isTanglishMode || !text) {
      return text;
    }

    // Split by spaces but keep them
    const parts = text.split(/(\s+)/);
    let result = "";

    parts.forEach((part) => {
      // If it's whitespace, keep as is
      if (/^\s+$/.test(part)) {
        result += part;
        return;
      }

      // For each word part, try to convert it
      const converted = transliterateToTamil(part);
      result += converted;
    });

    return result;
  }, [isTanglishMode]);

  /**
   * Convert entire text at once (used for paste operations)
   */
  const convertFullText = useCallback((text) => {
    if (!isTanglishMode) {
      return text;
    }

    if (isTanglish(text)) {
      return convertTanglishToTamil(text);
    }
    
    return text;
  }, [isTanglishMode]);

  const toggleTanglishMode = useCallback(() => {
    setIsTanglishMode((prev) => !prev);
  }, []);

  return {
    isTanglishMode,
    toggleTanglishMode,
    handleTanglishChange,
    convertFullText,
  };
};

export default useTanglishInput;
