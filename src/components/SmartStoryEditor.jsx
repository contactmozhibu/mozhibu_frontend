/**
 * SmartStoryEditor - React Quill Integration with Hybrid Transliteration
 * 
 * Professional Mozhibu Story Editor Component
 * Features:
 * - Rich text editing with React Quill
 * - Smart Tamil/English detection
 * - Real-time transliteration on SPACE
 * - Language statistics
 * - Auto-save to database
 */

import React, { useState, useCallback, useRef, useEffect } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { smartTransliterate, getLanguageInfo } from "../utils/smartHybridTransliterator";
import { useSmartHybridInput } from "../hooks/useSmartHybridInput";

/**
 * SmartStoryEditor Component
 */
const SmartStoryEditor = ({ 
  onSave, 
  initialContent = "", 
  placeholder = "உங்கள் கதை எழுதுங்கள்..." 
}) => {
  const [content, setContent] = useState(initialContent);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState("");
  const [languageStats, setLanguageStats] = useState({
    englishWords: 0,
    tamilWords: 0,
    characterCount: 0,
    isMixed: false,
  });

  const quillRef = useRef(null);
  const autoSaveTimerRef = useRef(null);

  /**
   * Calculate language statistics
   */
  const updateStats = useCallback((text) => {
    const plainText = text.replace(/<[^>]*>/g, "");
    const hasEnglish = /[a-zA-Z]/.test(plainText);
    const hasTamil = /[\u0B80-\u0BFF]/.test(plainText);

    setLanguageStats({
      englishWords: (plainText.match(/[a-zA-Z]+/g) || []).length,
      tamilWords: (plainText.match(/[\u0B80-\u0BFF]+/g) || []).length,
      characterCount: plainText.length,
      isMixed: hasEnglish && hasTamil,
    });
  }, []);

  /**
   * Handle content change from editor
   */
  const handleContentChange = useCallback((value) => {
    setContent(value);
    updateStats(value);

    // Auto-save after user stops typing
    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      handleAutoSave(value);
    }, 2000);
  }, [updateStats]);

  /**
   * Auto-save to database
   */
  const handleAutoSave = useCallback(async (contentToSave) => {
    if (!contentToSave || !onSave) return;

    try {
      setIsSaving(true);
      setSaveStatus("Saving...");
      await onSave(contentToSave);
      setSaveStatus("Saved ✓");
      setTimeout(() => setSaveStatus(""), 2000);
    } catch (error) {
      console.error("Auto-save failed:", error);
      setSaveStatus("Save failed");
    } finally {
      setIsSaving(false);
    }
  }, [onSave]);

  /**
   * Convert all text in editor
   */
  const handleConvertAll = useCallback(() => {
    const editor = quillRef.current?.getEditor();
    if (!editor) return;

    const currentContent = editor.getText();
    const converted = smartTransliterate(currentContent);
    
    editor.setText(converted);
    updateStats(converted);
  }, [updateStats]);

  /**
   * Clear editor
   */
  const handleClear = useCallback(() => {
    if (confirm("Are you sure you want to clear the editor?")) {
      setContent("");
      setLanguageStats({
        englishWords: 0,
        tamilWords: 0,
        characterCount: 0,
        isMixed: false,
      });
    }
  }, []);

  /**
   * React Quill modules configuration
   */
  const modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ header: 1 }, { header: 2 }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ script: "sub" }, { script: "super" }],
      [{ indent: "-1" }, { indent: "+1" }],
      [{ size: ["small", false, "large", "huge"] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      [{ align: [] }],
      ["clean"],
    ],
  };

  const formats = [
    "bold", "italic", "underline", "strike",
    "blockquote", "code-block",
    "header", "indent", "list",
    "script", "align", "size", "header",
    "color", "background",
  ];

  return (
    <div className="smart-story-editor">
      {/* Header with stats and controls */}
      <div className="editor-header">
        <div className="editor-title">
          <h2>📖 Story Editor</h2>
          <span className={`save-status ${isSaving ? "saving" : ""}`}>
            {saveStatus}
          </span>
        </div>

        <div className="editor-controls">
          <button
            onClick={handleConvertAll}
            className="btn btn-primary"
            title="Convert all Tanglish to Tamil"
          >
            🔄 Convert All
          </button>
          <button
            onClick={handleClear}
            className="btn btn-danger"
            title="Clear editor"
          >
            🗑️ Clear
          </button>
        </div>
      </div>

      {/* Language statistics */}
      <div className="language-stats">
        <div className="stat-item">
          <span className="stat-label">English Words:</span>
          <span className="stat-value">{languageStats.englishWords}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Tamil Words:</span>
          <span className="stat-value">{languageStats.tamilWords}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Characters:</span>
          <span className="stat-value">{languageStats.characterCount}</span>
        </div>
        <div className="stat-item">
          <span className="stat-label">Mode:</span>
          <span className={`stat-value ${languageStats.isMixed ? "mixed" : ""}`}>
            {languageStats.isMixed ? "🔀 Mixed" : "📝 Single"}
          </span>
        </div>
      </div>

      {/* React Quill Editor */}
      <div className="editor-container">
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={content}
          onChange={handleContentChange}
          modules={modules}
          formats={formats}
          placeholder={placeholder}
          className="quill-editor"
        />
      </div>

      {/* Helper text */}
      <div className="editor-helper">
        <p>💡 <strong>Pro Tips:</strong></p>
        <ul>
          <li>✅ English words (amazon, forest) will be kept as-is</li>
          <li>✅ Tanglish words (vanakkam, kathai) will convert to Tamil</li>
          <li>✅ Press SPACE to auto-convert the previous word</li>
          <li>✅ Click "Convert All" to convert your entire story</li>
        </ul>
      </div>

      <style jsx>{`
        .smart-story-editor {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background: #f9f9f9;
          border-radius: 8px;
        }

        .editor-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 2px solid #ddd;
        }

        .editor-title {
          display: flex;
          align-items: center;
          gap: 15px;
        }

        .editor-title h2 {
          margin: 0;
          color: #333;
        }

        .save-status {
          padding: 5px 12px;
          background: #e8f5e9;
          color: #2e7d32;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 500;
        }

        .save-status.saving {
          background: #fff3e0;
          color: #f57c00;
        }

        .editor-controls {
          display: flex;
          gap: 10px;
        }

        .btn {
          padding: 8px 16px;
          border: none;
          border-radius: 4px;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s;
        }

        .btn-primary {
          background: #1976d2;
          color: white;
        }

        .btn-primary:hover {
          background: #1565c0;
        }

        .btn-danger {
          background: #d32f2f;
          color: white;
        }

        .btn-danger:hover {
          background: #c62828;
        }

        .language-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 15px;
          margin-bottom: 20px;
          padding: 15px;
          background: white;
          border-radius: 6px;
          border-left: 4px solid #1976d2;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          font-weight: 500;
          color: #666;
        }

        .stat-value {
          font-size: 18px;
          font-weight: bold;
          color: #1976d2;
        }

        .stat-value.mixed {
          color: #f57c00;
        }

        .editor-container {
          margin-bottom: 20px;
          background: white;
          border-radius: 6px;
          overflow: hidden;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .quill-editor {
          height: 400px;
          font-family: "Noto Sans Tamil", "Segoe UI", sans-serif;
          font-size: 16px;
        }

        .editor-helper {
          background: #e3f2fd;
          padding: 15px;
          border-radius: 6px;
          border-left: 4px solid #1976d2;
        }

        .editor-helper p {
          margin: 0 0 10px 0;
          font-weight: 600;
          color: #1565c0;
        }

        .editor-helper ul {
          margin: 0;
          padding-left: 20px;
        }

        .editor-helper li {
          margin: 5px 0;
          color: #333;
        }

        /* Quill editor customizations */
        :global(.ql-toolbar) {
          border-top: none;
          border-left: none;
          border-right: none;
          border-bottom: 1px solid #ddd;
          background: #fafafa;
        }

        :global(.ql-container) {
          border: none;
          font-family: "Noto Sans Tamil", "Segoe UI", sans-serif;
        }
      `}</style>
    </div>
  );
};

export default SmartStoryEditor;
