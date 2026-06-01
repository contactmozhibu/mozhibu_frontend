/**
 * QUICK START - Smart Hybrid Transliteration
 * Copy & paste these examples into your Mozhibu pages
 */

// ============================================================
// EXAMPLE 1: Simple Input Field (Textarea)
// ============================================================

import React from 'react';
import useSmartHybridInput from '../hooks/useSmartHybridInput';

export function SimpleStoryInput() {
  const {
    text,
    stats,
    handleInputChange,
    handleKeyDown,
    convertFullText,
    clear,
  } = useSmartHybridInput();

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>📝 Story Writer</h2>

      {/* Input Field */}
      <textarea
        value={text}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder="Start typing your story... (Press SPACE to convert Tanglish words)"
        style={{
          width: '100%',
          height: '400px',
          padding: '10px',
          fontSize: '16px',
          border: '2px solid #ddd',
          borderRadius: '8px',
          fontFamily: "'Noto Sans Tamil', sans-serif",
        }}
      />

      {/* Stats Display */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '10px',
          margin: '20px 0',
        }}
      >
        <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
          <strong>English Words:</strong> {stats.englishWords}
        </div>
        <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
          <strong>Tamil Words:</strong> {stats.tamilWords}
        </div>
        <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
          <strong>Characters:</strong> {text.length}
        </div>
        <div style={{ padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
          <strong>Mode:</strong> {stats.mixedMode ? '🔀 Mixed' : '📝 Single'}
        </div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <button
          onClick={convertFullText}
          style={{
            flex: 1,
            padding: '10px',
            background: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🔄 Convert All
        </button>
        <button
          onClick={clear}
          style={{
            flex: 1,
            padding: '10px',
            background: '#d32f2f',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          🗑️ Clear
        </button>
      </div>

      {/* Result Display */}
      <div
        style={{
          padding: '15px',
          background: '#f9f9f9',
          border: '1px solid #ddd',
          borderRadius: '8px',
        }}
      >
        <strong>📖 Your Text:</strong>
        <p
          style={{
            margin: '10px 0 0 0',
            color: '#333',
            fontFamily: "'Noto Sans Tamil', sans-serif",
            lineHeight: '1.6',
          }}
        >
          {text || 'Your converted text will appear here...'}
        </p>
      </div>
    </div>
  );
}

// ============================================================
// EXAMPLE 2: Rich Text Editor (React Quill)
// ============================================================

import SmartStoryEditor from '../components/SmartStoryEditor';

export function FullStoryEditor() {
  const handleSave = async (content) => {
    try {
      const response = await fetch('/api/stories/drafts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          title: document.querySelector('input[name="title"]').value,
          content,
          language: 'mixed', // Tamil + English
          tags: ['story', 'tamil'],
        }),
      });

      if (!response.ok) throw new Error('Save failed');
      alert('Story saved successfully! 🎉');
    } catch (error) {
      alert('Error saving story: ' + error.message);
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <input
        type="text"
        name="title"
        placeholder="Story Title"
        style={{
          width: '100%',
          padding: '12px',
          marginBottom: '20px',
          fontSize: '18px',
          border: '2px solid #ddd',
          borderRadius: '8px',
        }}
      />

      <SmartStoryEditor
        onSave={handleSave}
        placeholder="உங்கள் கதை எழுதுங்கள்..."
      />
    </div>
  );
}

// ============================================================
// EXAMPLE 3: Direct Transliterator Usage
// ============================================================

import {
  smartTransliterate,
  convertWord,
  getLanguageInfo,
  isTamilOnly,
  hasMixedContent,
} from '../utils/smartHybridTransliterator';

export function TransliteratorDemo() {
  const examples = [
    'amazon forest',
    'vanakkam kathai',
    'en peyar yazhini',
    'Harry Potter kula',
    'naan programmer',
  ];

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>🔄 Transliteration Examples</h2>

      {examples.map((example, idx) => {
        const converted = smartTransliterate(example);
        const info = getLanguageInfo(converted);

        return (
          <div
            key={idx}
            style={{
              marginBottom: '15px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
            }}
          >
            <div>
              <strong>Input:</strong> {example}
            </div>
            <div>
              <strong>Output:</strong> {converted}
            </div>
            <div>
              <strong>Type:</strong> {info.type.toUpperCase()}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// EXAMPLE 4: Integration with Existing Pages
// ============================================================

// In NewDraft.jsx or EditDraft.jsx, replace old editor with:

import SmartStoryEditor from '../components/SmartStoryEditor';

export function NewDraftPage() {
  const [storyData, setStoryData] = React.useState({
    title: '',
    description: '',
    content: '',
    tags: [],
  });

  const handleSaveStory = async (content) => {
    try {
      // Your existing save logic
      const response = await fetch('/api/stories/drafts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...storyData,
          content,
        }),
      });

      if (response.ok) {
        console.log('Story draft saved!');
      }
    } catch (error) {
      console.error('Save error:', error);
    }
  };

  return (
    <div className="new-draft-page">
      <input
        type="text"
        placeholder="Story Title"
        onChange={(e) => setStoryData({ ...storyData, title: e.target.value })}
      />

      <textarea
        placeholder="Story Description"
        onChange={(e) =>
          setStoryData({ ...storyData, description: e.target.value })
        }
      />

      {/* ✅ Use SmartStoryEditor instead of regular textarea */}
      <SmartStoryEditor onSave={handleSaveStory} />
    </div>
  );
}

// ============================================================
// EXAMPLE 5: Backend API Integration
// ============================================================

/**
 * Backend endpoint to save story with mixed Tamil/English content
 * 
 * POST /api/stories/drafts
 * 
 * Request body:
 * {
 *   title: "Harry Potter Tamil",
 *   content: "Harry Potter கதை வணக்கம் நான்...",
 *   language: "mixed",
 *   tags: ["story", "tamil", "fiction"]
 * }
 * 
 * MongoDB stores it as-is (Unicode support)
 * 
 * Response:
 * {
 *   _id: "507f1f77bcf86cd799439011",
 *   title: "Harry Potter Tamil",
 *   content: "Harry Potter கதை வணக்கம் நான்...",
 *   language: "mixed",
 *   createdAt: "2026-05-29T...",
 *   updatedAt: "2026-05-29T..."
 * }
 */

// ============================================================
// EXAMPLE 6: Custom Processing
// ============================================================

import { convertRealTimeOnSpace } from '../utils/smartHybridTransliterator';

export function CustomProcessing() {
  const [text, setText] = React.useState('');

  const handleCustomKeyDown = (e) => {
    if (e.key === ' ') {
      const result = convertRealTimeOnSpace(text, e.target.selectionStart);

      if (result.wordConverted) {
        e.preventDefault();
        setText(result.converted);
        // Move cursor to right position
        e.target.value = result.converted;
        e.target.setSelectionRange(result.cursorPosition, result.cursorPosition);
      }
    }
  };

  return (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      onKeyDown={handleCustomKeyDown}
      placeholder="Custom implementation"
    />
  );
}

// ============================================================
// QUICK REFERENCE - CHEAT SHEET
// ============================================================

/**
 * CHEAT SHEET - Copy these snippets
 */

// 1. Convert single word
// smartTransliterate('vanakkam') → 'வணக்கம்'

// 2. Convert full text
// smartTransliterate('en peyar yazhini') → 'என் பெயர் யாழினி'

// 3. Get language info
// getLanguageInfo('amazon கதை') → { type: 'mixed', ... }

// 4. Check if English word
// isEnglishWord('amazon') → true
// isEnglishWord('vanakkam') → false

// 5. Check if Tamil only
// isTamilOnly('வணக்கம்') → true
// isTamilOnly('வணக்கம் hello') → false

// 6. Check if mixed
// hasMixedContent('amazon கதை') → true

// 7. Real-time on space
// convertRealTimeOnSpace('vanakkam ', 9) → {
//   converted: 'வணக்கம் ',
//   wordConverted: true,
//   originalWord: 'vanakkam',
//   convertedWord: 'வணக்கம்'
// }

export default SimpleStoryInput;
