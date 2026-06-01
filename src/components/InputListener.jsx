/**
 * INPUT LISTENER - Captures Tanglish input in real-time
 * 
 * This component serves as a bridge between user input and the transliteration engine.
 * It captures keyboard events and triggers real-time Tamil conversion.
 */

import React, { useRef, useCallback } from 'react';
import { convertRealTime, isTanglish } from '../utils/tanglishTransliterator';
import './InputListener.css';

const InputListener = ({ 
  onTextChange, 
  onTamilGenerated, 
  placeholder = "Type your story in Tanglish...",
  className = ""
}) => {
  const inputRef = useRef(null);
  const [tanglishText, setTanglishText] = React.useState('');
  const [tamilText, setTamilText] = React.useState('');

  /**
   * Handle real-time input changes
   * Converts Tanglish to Tamil as user types
   */
  const handleInputChange = useCallback((e) => {
    const text = e.target.value;
    setTanglishText(text);

    // Perform real-time conversion
    if (text.length > 0) {
      const result = convertRealTime(text);
      setTamilText(result.converted);

      // Notify parent component
      if (onTextChange) {
        onTextChange({
          tanglish: text,
          tamil: result.converted,
          isTanglish: isTanglish(text),
          length: text.length,
        });
      }

      // Notify when Tamil is generated
      if (onTamilGenerated && result.converted !== text) {
        onTamilGenerated(result.converted);
      }
    } else {
      setTamilText('');
      if (onTextChange) {
        onTextChange({
          tanglish: '',
          tamil: '',
          isTanglish: false,
          length: 0,
        });
      }
    }
  }, [onTextChange, onTamilGenerated]);

  /**
   * Handle keyboard events
   * Prevents default behavior if needed
   */
  const handleKeyDown = useCallback((e) => {
    // Tab support for accessibility
    if (e.key === 'Tab') {
      e.preventDefault();
      const start = inputRef.current.selectionStart;
      const end = inputRef.current.selectionEnd;

      // Insert tab character at cursor position
      const newText = tanglishText.substring(0, start) + '\t' + tanglishText.substring(end);
      setTanglishText(newText);

      // Update ref value
      if (inputRef.current) {
        inputRef.current.value = newText;
      }

      // Trigger change event
      handleInputChange({ target: { value: newText } });
    }

    // Ctrl+A to select all
    if ((e.ctrlKey || e.metaKey) && e.key === 'a') {
      // Let browser handle it normally
      return true;
    }
  }, [tanglishText, handleInputChange]);

  /**
   * Handle paste events
   * Convert pasted Tanglish text
   */
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    const pastedText = (e.clipboard || window.clipboardData).getData('text/plain');
    
    if (pastedText) {
      const start = inputRef.current.selectionStart;
      const end = inputRef.current.selectionEnd;
      const newText = tanglishText.substring(0, start) + pastedText + tanglishText.substring(end);
      
      setTanglishText(newText);
      if (inputRef.current) {
        inputRef.current.value = newText;
      }
      
      handleInputChange({ target: { value: newText } });
    }
  }, [tanglishText, handleInputChange]);

  /**
   * Clear input
   */
  const handleClear = useCallback(() => {
    setTanglishText('');
    setTamilText('');
    if (inputRef.current) {
      inputRef.current.value = '';
      inputRef.current.focus();
    }
    if (onTextChange) {
      onTextChange({
        tanglish: '',
        tamil: '',
        isTanglish: false,
        length: 0,
      });
    }
  }, [onTextChange]);

  return (
    <div className={`input-listener-container ${className}`}>
      <div className="input-wrapper">
        {/* Input Field */}
        <textarea
          ref={inputRef}
          value={tanglishText}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          placeholder={placeholder}
          className="input-listener-textarea"
          rows={8}
          cols={50}
          spellCheck="false"
        />

        {/* Clear Button */}
        {tanglishText.length > 0 && (
          <button
            onClick={handleClear}
            className="clear-button"
            title="Clear input"
            aria-label="Clear input"
          >
            ✕
          </button>
        )}
      </div>

      {/* Info Bar */}
      <div className="input-info">
        <span className="char-count">
          Characters: {tanglishText.length}
        </span>
        {isTanglish(tanglishText) && (
          <span className="conversion-badge">
            ✓ Tanglish Detected
          </span>
        )}
      </div>
    </div>
  );
};

export default InputListener;
