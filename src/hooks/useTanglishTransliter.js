/**
 * useTanglishTransliter - React Hook
 * 
 * Custom React hook for managing Tanglish to Tamil transliteration
 * Handles state management, real-time conversion, and API calls
 */

import { useState, useCallback, useRef, useEffect } from 'react';
import toast from 'react-hot-toast';
import {
  convertRealTime,
  isTanglish,
  isTamilOnly,
  prepareTamilForStorage,
  isConversionSuccessful,
} from '../utils/tanglishTransliterator';

export const useTanglishTransliter = (options = {}) => {
  const {
    onSave = null,
    autoSave = false,
    autoSaveInterval = 5000,
    maxLength = 5000,
  } = options;

  // State management
  const [tanglishText, setTanglishText] = useState('');
  const [tamilText, setTamilText] = useState('');
  const [isConverting, setIsConverting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [conversionStats, setConversionStats] = useState(null);
  const [error, setError] = useState(null);

  const autoSaveTimerRef = useRef(null);
  const lastSavedRef = useRef(null);

  /**
   * Perform real-time conversion
   */
  const convertText = useCallback((text) => {
    if (!text) {
      setTanglishText('');
      setTamilText('');
      setConversionStats(null);
      return;
    }

    try {
      setIsConverting(true);
      setError(null);

      // Check length limit
      if (text.length > maxLength) {
        const errorMsg = `Text exceeds maximum length of ${maxLength} characters`;
        setError(errorMsg);
        toast.error(errorMsg);
        return;
      }

      // Perform conversion
      const result = convertRealTime(text);
      setTanglishText(text);
      setTamilText(result.converted);

      // Update stats
      setConversionStats({
        ...result,
        isSuccessful: isConversionSuccessful(text, result.converted),
        isTanglish: isTanglish(text),
        isTamil: isTamilOnly(result.converted),
        conversionRatio: result.convertedLength / result.originalLength,
      });

      // Auto-save if enabled
      if (autoSave && result.converted !== text) {
        scheduleAutoSave();
      }
    } catch (err) {
      const errorMsg = `Conversion error: ${err.message}`;
      setError(errorMsg);
      console.error(errorMsg, err);
    } finally {
      setIsConverting(false);
    }
  }, [maxLength, autoSave]);

  /**
   * Schedule auto-save
   */
  const scheduleAutoSave = useCallback(() => {
    // Clear existing timer
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    // Set new timer
    autoSaveTimerRef.current = setTimeout(() => {
      handleAutoSave();
    }, autoSaveInterval);
  }, [autoSaveInterval]);

  /**
   * Handle auto-save
   */
  const handleAutoSave = useCallback(async () => {
    if (!onSave || !tamilText || tamilText === lastSavedRef.current) {
      return;
    }

    try {
      setIsSaving(true);
      await onSave({
        tamilText: prepareTamilForStorage(tamilText),
        tanglishText,
        timestamp: new Date(),
        stats: conversionStats,
      });
      lastSavedRef.current = tamilText;
    } catch (err) {
      console.error('Auto-save error:', err);
    } finally {
      setIsSaving(false);
    }
  }, [tamilText, tanglishText, onSave, conversionStats]);

  /**
   * Manual save
   */
  const saveTamil = useCallback(async () => {
    if (!onSave) {
      toast.error('Save handler not configured');
      return;
    }

    if (!tamilText || tamilText.trim().length === 0) {
      toast.error('No Tamil text to save');
      return;
    }

    try {
      setIsSaving(true);
      const cleanedTamil = prepareTamilForStorage(tamilText);
      await onSave({
        tamilText: cleanedTamil,
        tanglishText,
        timestamp: new Date(),
        stats: conversionStats,
      });
      lastSavedRef.current = tamilText;
      toast.success('Tamil content saved successfully!');
    } catch (err) {
      const errorMsg = `Save error: ${err.message}`;
      console.error(errorMsg, err);
      toast.error(errorMsg);
    } finally {
      setIsSaving(false);
    }
  }, [tamilText, tanglishText, onSave, conversionStats]);

  /**
   * Clear all
   */
  const clearAll = useCallback(() => {
    setTanglishText('');
    setTamilText('');
    setConversionStats(null);
    setError(null);
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }
  }, []);

  /**
   * Copy Tamil text to clipboard
   */
  const copyToClipboard = useCallback(async () => {
    if (!tamilText) {
      toast.error('No text to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(tamilText);
      toast.success('Copied to clipboard!');
    } catch (err) {
      console.error('Copy error:', err);
      toast.error('Failed to copy');
    }
  }, [tamilText]);

  /**
   * Download as file
   */
  const downloadAsFile = useCallback((format = 'txt') => {
    if (!tamilText) {
      toast.error('No text to download');
      return;
    }

    try {
      const element = document.createElement('a');
      const file = new Blob([tamilText], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = `tamil_story.${format}`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('File downloaded!');
    } catch (err) {
      console.error('Download error:', err);
      toast.error('Failed to download');
    }
  }, [tamilText]);

  /**
   * Get current state
   */
  const getCurrentState = useCallback(() => ({
    tanglishText,
    tamilText,
    isConverting,
    isSaving,
    conversionStats,
    error,
  }), [tanglishText, tamilText, isConverting, isSaving, conversionStats, error]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, []);

  return {
    // State
    tanglishText,
    tamilText,
    isConverting,
    isSaving,
    conversionStats,
    error,

    // Methods
    convertText,
    saveTamil,
    clearAll,
    copyToClipboard,
    downloadAsFile,
    getCurrentState,
  };
};

export default useTanglishTransliter;
