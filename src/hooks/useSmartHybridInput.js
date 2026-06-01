/**
 * useSmartHybridInput - React Hook for Smart Hybrid Transliteration
 * 
 * Features:
 * - Real-time Tamil/English detection
 * - Preserve English, convert Tanglish to Tamil on SPACE
 * - Maintain cursor position
 * - Support for rich text editors (React Quill)
 * 
 * Usage:
 * const { text, setText, handleKeyDown, stats } = useSmartHybridInput();
 * 
 * <input
 *   value={text}
 *   onChange={(e) => setText(e.target.value)}
 *   onKeyDown={handleKeyDown}
 * />
 */

import { useState, useCallback, useRef } from "react";
import {
  smartTransliterate,
  getLanguageInfo,
} from "../utils/smartHybridTransliterator";

/**
 * Smart Hybrid Input Hook
 * Manages state and logic for hybrid Tamil/English input
 */
export const useSmartHybridInput = () => {
  const [text, setText] = useState("");
  const [stats, setStats] = useState({
    englishWords: 0,
    tamilWords: 0,
    mixedMode: false,
    lastWordType: "",
  });

  const inputRef = useRef(null);
  const cursorPosRef = useRef(0);

  /**
   * Handle real-time input changes
   * Track cursor position and update statistics
   */
  const handleInputChange = useCallback((e) => {
    const newText = e.target.value;
    setText(newText);

    // Update cursor position
    if (e.target) {
      cursorPosRef.current = e.target.selectionStart || 0;
    }

    // Update statistics
    const langInfo = getLanguageInfo(newText);
    const hasEnglish = /[a-zA-Z]/.test(newText);
    const hasTamil = /[\u0B80-\u0BFF]/.test(newText);

    setStats({
      englishWords: (newText.match(/[a-zA-Z]+/g) || []).length,
      tamilWords: (newText.match(/[\u0B80-\u0BFF]+/g) || []).length,
      mixedMode: hasEnglish && hasTamil,
      lastWordType: langInfo.type,
    });
  }, []);

  /**
   * Handle SPACE key - convert text on every SPACE press
   * Uses smartTransliterate for full conversion
   */
  const handleKeyDown = useCallback(
    (e) => {
      // Only process SPACE key
      if (e.key !== " ") {
        return;
      }

      // Get current input value
      const inputElement = e.target;
      const currentText = inputElement.value;
      const cursorPos = inputElement.selectionStart || 0;

      // Add the space and convert full text
      const textWithSpace = currentText + " ";
      const converted = smartTransliterate(textWithSpace);

      if (converted !== textWithSpace) {
        // Prevent default space input
        e.preventDefault();
        
        // Update with converted text
        setText(converted);
        inputElement.value = converted;
        
        // Maintain cursor position (approximately)
        setTimeout(() => {
          inputElement.setSelectionRange(cursorPos + 1, cursorPos + 1);
        }, 0);

        // Update stats
        const langInfo = getLanguageInfo(converted);
        setStats({
          englishWords: (converted.match(/[a-zA-Z]+/g) || []).length,
          tamilWords: (converted.match(/[\u0B80-\u0BFF]+/g) || []).length,
          mixedMode: /[a-zA-Z]/.test(converted) && /[\u0B80-\u0BFF]/.test(converted),
          lastWordType: langInfo.type,
        });
      }
    },
    []
  );

  /**
   * Handle full text conversion (manual button click)
   */
  const convertFullText = useCallback(() => {
    const converted = smartTransliterate(text);
    setText(converted);
    return converted;
  }, [text]);

  /**
   * Clear input
   */
  const clear = useCallback(() => {
    setText("");
    setStats({
      englishWords: 0,
      tamilWords: 0,
      mixedMode: false,
      lastWordType: "",
    });
  }, []);

  /**
   * Set text programmatically
   */
  const setTextValue = useCallback((newText) => {
    setText(newText);
    const langInfo = getLanguageInfo(newText);
    const hasEnglish = /[a-zA-Z]/.test(newText);
    const hasTamil = /[\u0B80-\u0BFF]/.test(newText);

    setStats({
      englishWords: (newText.match(/[a-zA-Z]+/g) || []).length,
      tamilWords: (newText.match(/[\u0B80-\u0BFF]+/g) || []).length,
      mixedMode: hasEnglish && hasTamil,
      lastWordType: langInfo.type,
    });
  }, []);

  /**
   * Get language breakdown
   */
  const getLanguageBreakdown = useCallback(() => {
    return {
      englishWords: stats.englishWords,
      tamilWords: stats.tamilWords,
      isMixed: stats.mixedMode,
      languageType: stats.lastWordType,
      totalCharacters: text.length,
    };
  }, [stats, text]);

  return {
    // State
    text,
    setText: setTextValue,
    stats,

    // Event handlers
    handleInputChange,
    handleKeyDown,
    inputRef,

    // Methods
    convertFullText,
    clear,
    getLanguageBreakdown,
  };
};

export default useSmartHybridInput;
