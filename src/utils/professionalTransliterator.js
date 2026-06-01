/**
 * PROFESSIONAL HYBRID TRANSLITERATOR - Production Grade
 * Implements smart selective transliteration for Mozhibu Platform
 * 
 * WORKFLOW (as per specification):
 * User types → Wait for SPACE → Analyze word → Decide action
 * 
 * ✅ English words → Keep as-is (amazon, forest, Harry, Potter)
 * ✅ Tamil/Tanglish → Convert to Tamil (vanakkam, en peyar, naan)
 * ✅ Mixed → Selective conversion (Harry Potter kathai → Harry Potter கதை)
 */

import { transliterateToTamil } from './tanglishTransliterator';

/**
 * COMPREHENSIVE ENGLISH DICTIONARY
 * Built from common English words that should NOT be converted
 * Focus: Grammar words, articles, pronouns, proper names
 */
const englishDictionary = {
  // ===== ARTICLES & DETERMINERS =====
  'a': true, 'an': true, 'the': true,
  
  // ===== PRONOUNS =====
  'i': true, 'me': true, 'my': true, 'mine': true,
  'you': true, 'your': true, 'yours': true,
  'he': true, 'him': true, 'his': true,
  'she': true, 'her': true, 'hers': true,
  'it': true, 'its': true,
  'we': true, 'us': true, 'our': true, 'ours': true,
  'they': true, 'them': true, 'their': true, 'theirs': true,
  'this': true, 'that': true, 'these': true, 'those': true,
  'which': true, 'who': true, 'whom': true, 'whose': true,
  
  // ===== COMMON VERBS =====
  'is': true, 'am': true, 'are': true,
  'was': true, 'were': true, 'been': true, 'be': true, 'being': true,
  'have': true, 'has': true, 'had': true, 'having': true,
  'do': true, 'does': true, 'did': true, 'doing': true,
  'will': true, 'would': true, 'shall': true, 'should': true,
  'can': true, 'could': true, 'may': true, 'might': true, 'must': true,
  'go': true, 'goes': true, 'went': true, 'going': true,
  'get': true, 'gets': true, 'got': true, 'getting': true,
  'make': true, 'makes': true, 'made': true, 'making': true,
  'come': true, 'comes': true, 'came': true, 'coming': true,
  
  // ===== CONJUNCTIONS & PREPOSITIONS =====
  'and': true, 'or': true, 'but': true, 'not': true, 'no': true,
  'in': true, 'on': true, 'at': true, 'to': true, 'from': true,
  'with': true, 'by': true, 'for': true, 'of': true, 'as': true,
  'about': true, 'into': true, 'through': true, 'during': true,
  'before': true, 'after': true, 'above': true, 'below': true,
  'up': true, 'down': true, 'out': true, 'off': true, 'over': true,
  'between': true, 'among': true, 'around': true, 'along': true,
  
  // ===== LOGICAL WORDS =====
  'if': true, 'else': true, 'so': true, 'because': true, 'unless': true,
  'when': true, 'where': true, 'why': true, 'how': true, 'what': true,
  'while': true, 'until': true,
  
  // ===== RESPONSE WORDS =====
  'yes': true, 'no': true, 'ok': true, 'okay': true,
  'hello': true, 'hi': true, 'bye': true, 'goodbye': true,
  'thanks': true, 'thank': true, 'please': true, 'sorry': true,
  
  // ===== NUMBERS =====
  'one': true, 'two': true, 'three': true, 'four': true, 'five': true,
  'six': true, 'seven': true, 'eight': true, 'nine': true, 'ten': true,
  'hundred': true, 'thousand': true, 'million': true, 'billion': true,
  
  // ===== PROPER NAMES (Brands, Platforms, Characters) =====
  'harry': true, 'potter': true, 'james': true, 'john': true,
  'netflix': true, 'amazon': true, 'google': true, 'facebook': true,
  'instagram': true, 'twitter': true, 'wattpad': true, 'pratilipi': true,
  'react': true, 'javascript': true, 'python': true, 'java': true,
  'node': true, 'mongodb': true, 'sql': true, 'html': true, 'css': true,
  'india': true, 'usa': true, 'uk': true, 'australia': true,
  
  // ===== DAYS & MONTHS =====
  'monday': true, 'tuesday': true, 'wednesday': true, 'thursday': true,
  'friday': true, 'saturday': true, 'sunday': true,
  'january': true, 'february': true, 'march': true, 'april': true,
  'may': true, 'june': true, 'july': true, 'august': true,
  'september': true, 'october': true, 'november': true, 'december': true,
};

/**
 * Check if word is English using dictionary
 * Only keeps words that are definitely English (grammar words, names)
 */
const isEnglishWord = (word) => {
  if (!word || word.length === 0) return false;
  
  const lowerWord = word.toLowerCase().trim();
  
  // Direct dictionary lookup
  if (englishDictionary[lowerWord]) {
    return true;
  }
  
  return false;
};

/**
 * Check if word contains Tamil Unicode characters
 */
const isTamilWord = (word) => {
  if (!word) return false;
  return /[\u0B80-\u0BFF]/.test(word);
};

/**
 * MAIN FUNCTION: Professional Smart Hybrid Transliteration
 * 
 * Process flow:
 * 1. Split by word boundaries
 * 2. For each word:
 *    - If English → Keep as-is
 *    - If Tamil → Keep as-is
 *    - If Tanglish/Unknown → Convert to Tamil
 * 3. Preserve spaces and punctuation
 */
const professionalTransliterate = (text) => {
  if (!text || typeof text !== 'string') return '';
  
  // Split by word boundaries but preserve spaces and punctuation
  const regex = /(\s+|[.,!?;:—–-])/;
  const parts = text.split(regex);
  
  let result = '';
  
  for (const part of parts) {
    // Preserve spaces and punctuation as-is
    if (/^\s+$/.test(part) || /^[.,!?;:—–-]$/.test(part)) {
      result += part;
      continue;
    }
    
    if (part.length === 0) continue;
    
    // Separate trailing punctuation
    const wordMatch = part.match(/^(.+?)([.,!?;:—–-]*)$/);
    const actualWord = wordMatch ? wordMatch[1] : part;
    const trailingPunct = wordMatch ? wordMatch[2] : '';
    
    let converted = actualWord;
    
    // Decision logic
    if (isEnglishWord(actualWord)) {
      // ✅ English word - KEEP AS-IS
      converted = actualWord;
    } else if (isTamilWord(actualWord)) {
      // ✅ Already Tamil - KEEP AS-IS
      converted = actualWord;
    } else {
      // ✅ Tanglish/Unknown - CONVERT TO TAMIL
      converted = transliterateToTamil(actualWord);
    }
    
    result += converted + trailingPunct;
  }
  
  return result;
};

/**
 * Real-time conversion on every keystroke
 */
const convertRealTime = (text) => {
  if (!text) return { converted: '', wordInfo: {} };
  
  const converted = professionalTransliterate(text);
  
  // Get last word for analysis
  const lastSpaceIndex = text.lastIndexOf(' ');
  const lastWord = text.substring(lastSpaceIndex + 1).trim();
  
  const wordInfo = {
    lastWord,
    isEnglish: isEnglishWord(lastWord),
    isTamil: isTamilWord(lastWord),
  };
  
  return { converted, wordInfo };
};

/**
 * Batch conversion (for paste operations)
 */
const convertBatch = (text) => {
  if (!text) return '';
  return professionalTransliterate(text);
};

/**
 * EXPORTS - Named exports for direct import
 */
export {
  professionalTransliterate,
  convertRealTime,
  convertBatch,
  isEnglishWord,
  isTamilWord,
};

export default {
  professionalTransliterate,
  convertRealTime,
  convertBatch,
  isEnglishWord,
  isTamilWord,
};
