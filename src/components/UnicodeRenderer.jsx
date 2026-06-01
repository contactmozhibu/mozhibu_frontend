/**
 * UNICODE RENDERER - Displays Tamil text instantly
 * 
 * Renders the converted Tamil Unicode characters with proper styling
 * and provides options for copying, downloading, or sending to database.
 */

import React, { useCallback } from 'react';
import toast from 'react-hot-toast';
import './UnicodeRenderer.css';

const UnicodeRenderer = ({ 
  tamilText = "", 
  tanglishText = "",
  onSave = null,
  showMetadata = true,
}) => {
  const [isCopied, setIsCopied] = React.useState(false);

  /**
   * Calculate text statistics
   */
  const getTextStats = () => {
    return {
      characters: tamilText.length,
      words: tamilText.trim().split(/\s+/).filter(w => w.length > 0).length,
      lines: tamilText.split('\n').length,
    };
  };

  /**
   * Copy Tamil text to clipboard
   */
  const handleCopyToClipboard = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(tamilText);
      setIsCopied(true);
      toast.success('Tamil text copied to clipboard!');
      
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy text');
    }
  }, [tamilText]);

  /**
   * Download Tamil text as file
   */
  const handleDownloadAsTxt = useCallback(() => {
    try {
      const element = document.createElement('a');
      const file = new Blob([tamilText], { type: 'text/plain;charset=utf-8' });
      element.href = URL.createObjectURL(file);
      element.download = 'tamil_story.txt';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('File downloaded successfully!');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Failed to download file');
    }
  }, [tamilText]);

  /**
   * Save Tamil text to database
   */
  const handleSaveToDatabase = useCallback(async () => {
    if (!onSave) {
      toast.error('Save handler not configured');
      return;
    }

    try {
      await onSave({
        tamilText,
        tanglishText,
        timestamp: new Date(),
        stats: getTextStats(),
      });
      toast.success('Story saved successfully!');
    } catch (error) {
      console.error('Save error:', error);
      toast.error('Failed to save story');
    }
  }, [tamilText, tanglishText, onSave]);

  const stats = getTextStats();
  const isEmptyTamil = !tamilText || tamilText.trim().length === 0;

  return (
    <div className="unicode-renderer-container">
      {/* Header */}
      <div className="renderer-header">
        <h2>Tamil Output</h2>
        {!isEmptyTamil && (
          <div className="header-actions">
            <button
              onClick={handleCopyToClipboard}
              className="action-btn copy-btn"
              title="Copy to clipboard"
            >
              {isCopied ? '✓ Copied' : '📋 Copy'}
            </button>
            <button
              onClick={handleDownloadAsTxt}
              className="action-btn download-btn"
              title="Download as text file"
            >
              ⬇️ Download
            </button>
            {onSave && (
              <button
                onClick={handleSaveToDatabase}
                className="action-btn save-btn"
                title="Save to database"
              >
                💾 Save
              </button>
            )}
          </div>
        )}
      </div>

      {/* Main Display Area */}
      <div className="renderer-display">
        {isEmptyTamil ? (
          <div className="empty-state">
            <p>🔤 Tamil text will appear here...</p>
            <p className="hint">Start typing in Tanglish to see live conversion</p>
          </div>
        ) : (
          <div className="tamil-content">
            {/* Tamil Text Display */}
            <p className="tamil-text">{tamilText}</p>

            {/* Metadata */}
            {showMetadata && (
              <div className="metadata">
                <div className="meta-item">
                  <span className="meta-label">Conversion:</span>
                  <span className="meta-value">
                    {tanglishText.length} chars → {tamilText.length} chars
                  </span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Statistics Footer */}
      {!isEmptyTamil && (
        <div className="renderer-footer">
          <div className="stats">
            <div className="stat-item">
              <span className="stat-label">Characters:</span>
              <span className="stat-value">{stats.characters}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Words:</span>
              <span className="stat-value">{stats.words}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Lines:</span>
              <span className="stat-value">{stats.lines}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UnicodeRenderer;
