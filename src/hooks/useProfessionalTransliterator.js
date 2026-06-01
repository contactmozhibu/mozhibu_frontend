import { useState, useCallback } from 'react';
import { 
  professionalTransliterate,
  convertRealTime,
  convertBatch,
  isEnglishWord,
  isTamilWord
} from '../utils/professionalTransliterator';

/**
 * Professional Hybrid Input Hook
 * Implements smart selective transliteration as per Pratilipi-style UX
 * 
 * Features:
 * - Real-time word detection
 * - Smart English word preservation
 * - Tamil/Tanglish conversion
 * - Professional-grade performance
 */
export const useProfessionalTransliterator = () => {
  const [enabled, setEnabled] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState(null);

  /**
   * Process input on keystroke
   */
  const processInput = useCallback((text) => {
    if (!enabled || !text) return text;

    const result = convertRealTime(text);
    setLastAnalysis(result.wordInfo);
    return result.converted;
  }, [enabled]);

  /**
   * Process batch (paste operations)
   */
  const processBatch = useCallback((text) => {
    if (!enabled || !text) return text;
    return convertBatch(text);
  }, [enabled]);

  /**
   * Toggle transliteration on/off
   */
  const toggle = useCallback(() => {
    setEnabled(prev => !prev);
  }, []);

  /**
   * Enable/disable explicitly
   */
  const setEnabled_ = useCallback((value) => {
    setEnabled(value);
  }, []);

  return {
    enabled,
    toggle,
    setEnabled: setEnabled_,
    processInput,
    processBatch,
    lastAnalysis,
    isEnglishWord,
    isTamilWord,
  };
};

export default useProfessionalTransliterator;
