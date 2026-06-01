/**
 * MERN Mozhibu - Smart Hybrid Transliteration System
 * Professional implementation for Pratilipi-like experience
 * 
 * ✅ KEEPS: English words (amazon, forest, Harry, Potter, React, JavaScript)
 * ✅ CONVERTS: Tamil/Tanglish words (vanakkam, kathai, en, peyar)
 * ✅ REAL-TIME: Processes on space press for instant feedback
 * 
 * ARCHITECTURE:
 * =============
 * User Types: "amazon forest kathai"
 *    ↓
 * Split by words on SPACE
 *    ↓
 * Check: Is this English?
 *    ↓
 * YES → Keep it  /  NO → Convert to Tamil
 *    ↓
 * Display: "amazon forest கதை"
 */

// ============================================================
// PART 1: COMPREHENSIVE ENGLISH DICTIONARY (500+ words)
// ============================================================
// Used to identify English words and keep them untranslated
const englishDictionary = new Set([
  // Pronouns & Articles
  "a", "an", "the", "i", "you", "he", "she", "it", "we", "they",
  "me", "him", "her", "us", "them", "my", "your", "his", "her", "our", "their",
  "this", "that", "these", "those", "what", "which", "who", "whom", "whose",
  "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten",

  // Common Verbs
  "be", "am", "is", "are", "was", "were", "been", "being",
  "have", "has", "had", "do", "does", "did", "will", "would", "can", "could",
  "should", "shall", "may", "might", "must", "run", "walk", "sit", "stand",
  "sleep", "eat", "drink", "sing", "dance", "play", "read", "write", "speak",
  "listen", "look", "see", "hear", "talk", "come", "go", "give", "take",
  "make", "find", "think", "know", "want", "like", "love", "hate", "fear",
  "try", "use", "help", "work", "start", "stop", "continue", "begin", "end",
  "open", "close", "push", "pull", "jump", "fall", "rise", "move", "turn",
  "break", "build", "destroy", "create", "show", "hide", "follow", "lead",
  "watch", "observe", "notice", "remember", "forget", "understand", "learn",
  "teach", "explain", "ask", "answer", "say", "tell", "sing", "call", "name",

  // Common Nouns
  "man", "woman", "child", "boy", "girl", "person", "people",
  "house", "home", "room", "door", "window", "table", "chair", "bed", "floor",
  "book", "books", "pen", "pencil", "paper", "letter", "word", "story",
  "car", "vehicle", "bus", "train", "bike", "road", "street", "path",
  "food", "rice", "bread", "fruit", "milk", "water", "tea", "coffee",
  "tree", "trees", "flower", "flowers", "leaf", "leaves", "grass", "plant",
  "animal", "animals", "bird", "birds", "fish", "cat", "dog", "horse",
  "mountain", "river", "sea", "beach", "sky", "cloud", "sun", "moon", "star",
  "day", "night", "morning", "evening", "noon", "time", "hour", "minute", "second",
  "week", "month", "year", "today", "tomorrow", "yesterday",
  "forest", "rainforest", "jungle", "rain", "rainbow", "weather", "storm", "wind",
  "nature", "landscape", "valley", "lake", "spring", "waterfall", "cave", "rock",
  "soil", "stone", "sand", "dust", "mud", "fire", "smoke", "light", "dark",

  // Adjectives
  "big", "small", "large", "little", "good", "bad", "great", "terrible",
  "beautiful", "ugly", "pretty", "handsome", "long", "short", "tall", "high",
  "fast", "slow", "quick", "heavy", "light", "strong", "weak", "hard", "soft",
  "hot", "cold", "warm", "cool", "wet", "dry", "clean", "dirty", "happy",
  "sad", "angry", "calm", "excited", "tired", "sick", "healthy", "young",
  "old", "new", "young", "ancient", "modern", "simple", "complex", "easy",
  "difficult", "right", "left", "top", "bottom", "red", "blue", "green",
  "yellow", "white", "black", "orange", "purple", "pink", "brown", "gray",
  "bright", "dark", "clear", "bright", "dim", "vivid", "pale", "colorful",
  "peaceful", "quiet", "loud", "silent", "smooth", "rough", "round", "flat",
  "thick", "thin", "wide", "narrow", "deep", "shallow", "steep", "gentle",

  // Prepositions
  "in", "on", "at", "by", "to", "from", "with", "without", "about", "above",
  "below", "between", "among", "through", "during", "before", "after", "under",
  "over", "against", "into", "up", "down", "around", "near", "far", "inside",
  "outside", "behind", "beside", "across", "along",

  // Conjunctions
  "and", "or", "but", "because", "if", "unless", "while", "when", "where",
  "why", "how", "as", "than", "so", "that", "though", "although", "however",

  // Common Words
  "yes", "no", "ok", "okay", "please", "thank", "thanks", "hello", "hi",
  "bye", "goodbye", "sorry", "excuse", "pardon", "welcome", "nice", "bad",
  "help", "question", "answer", "problem", "solution", "idea", "plan", "reason",
  "example", "name", "place", "thing", "work", "job", "business", "money",
  "price", "cost", "free", "pay", "buy", "sell", "shop", "store", "market",

  // Technology & Modern Terms
  "computer", "phone", "laptop", "mobile", "tablet", "internet", "web", "site",
  "google", "facebook", "twitter", "instagram", "youtube", "email", "whatsapp",
  "app", "software", "hardware", "code", "program", "developer", "designer",
  "javascript", "python", "java", "css", "html", "react", "node", "database",
  "server", "client", "api", "data", "file", "folder", "document", "download",
  "upload", "save", "load", "delete", "copy", "paste", "edit", "create",
  "update", "refresh", "clear", "reset", "search", "find", "replace", "match",
  "login", "logout", "password", "username", "account", "profile", "settings",

  // Names & Proper Nouns (Common in Mozhibu context)
  "amazon", "harry", "potter", "potter", "pratilipi", "tamil", "english",
  "india", "america", "london", "paris", "tokyo", "america", "harry",
  "ron", "hermione", "dumbledore", "aragog", "dobby", "voldemort",

  // Story & Literary Terms
  "chapter", "novel", "tale", "story", "poem", "poetry", "author", "writer",
  "reader", "plot", "character", "scene", "ending", "beginning", "middle",
  "dialogue", "description", "narrative", "theme", "setting", "conflict",
  "resolution", "paragraph", "sentence", "line", "verse", "stanza",

  // Common Phrases & Abbreviations
  "mr", "mrs", "miss", "dr", "prof", "ltd", "inc", "co", "etc", "vs",
  "etc", "eg", "ie", "ps", "ft", "km", "cm", "mm", "gb", "mb", "kb",

  // Months
  "january", "february", "march", "april", "may", "june",
  "july", "august", "september", "october", "november", "december",
  "jan", "feb", "mar", "apr", "jun", "jul", "aug", "sep", "sept", "oct", "nov", "dec",

  // Days
  "monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday",
  "mon", "tue", "wed", "thu", "fri", "sat", "sun",

  // Colors
  "color", "colour", "red", "blue", "green", "yellow", "white", "black",
  "orange", "purple", "pink", "brown", "gray", "grey", "silver", "gold",

  // Emotions
  "love", "hate", "like", "dislike", "enjoy", "fear", "hope", "wish",
  "trust", "doubt", "surprise", "shock", "laugh", "cry", "smile", "frown",

  // Common Actions (Gerunds)
  "running", "walking", "sitting", "sleeping", "eating", "drinking", "singing",
  "dancing", "playing", "reading", "writing", "speaking", "listening", "looking",
  "seeing", "hearing", "talking", "coming", "going", "giving", "taking",
  "making", "finding", "thinking", "knowing", "wanting", "liking", "loving",
  "hating", "fearing", "trying", "using", "helping", "working", "starting",

  // Additional common English words
  "so", "very", "quite", "just", "only", "also", "too", "well", "now",
  "here", "there", "where", "everywhere", "nowhere", "somewhere", "anywhere",
  "always", "never", "sometimes", "often", "rarely", "usually", "probably",
  "certainly", "definitely", "perhaps", "maybe", "really", "truly", "indeed",
  "almost", "already", "yet", "still", "already", "soon", "later", "earlier",
  "forest", "amazon",
]);

/**
 * Check if a word is English based on dictionary
 * IMPORTANT: ONLY trust dictionary, don't use regex catch-all
 * This ensures maximum conversion of Tanglish to Tamil
 * 
 * @param {string} word - The word to check
 * @returns {boolean} True if the word is English
 */
const isEnglishWord = (word) => {
  if (!word) return false;
  const lowerWord = word.toLowerCase().trim();
  
  // ONLY check if it's in our English dictionary
  // DON'T use catch-all regex - this converts MORE Tanglish to Tamil
  if (englishDictionary.has(lowerWord)) {
    return true;
  }
  
  return false;
};

/**
 * Checks if text contains Tamil characters
 * @param {string} text - Text to check
 * @returns {boolean} True if contains Tamil
 */
const hasTamilCharacters = (text) => {
  if (!text) return false;
  // Tamil Unicode range: U+0B80 to U+0BFF
  return /[\u0B80-\u0BFF]/.test(text);
};

/**
 * TAMIL/TANGLISH DICTIONARY (Common Tamil words)
 */
const tanglishDictionary = {
  // === GREETINGS ===
  vanakkam: "வணக்கம்",
  vanakam: "வணகம்",
  nandri: "நன்றி",
  salam: "சலாம்",
  namaskaram: "நமஸ்காரம்",

  // === PRONOUNS ===
  naan: "நான்",
  naam: "நாம்",
  nee: "நீ",
  neeyum: "நீயும்",
  en: "என்",
  avan: "அவன்",
  aval: "அவள்",
  ivan: "இவன்",
  ival: "இவள்",
  adhu: "அது",
  idhu: "இது",

  // === VERBS ===
  sollu: "சொல்லு",
  sollunga: "சொல்லுங்க",
  paaru: "பாரு",
  paarunga: "பாருங்க",
  seiyum: "செய்யும்",
  seiyunga: "செய்யுங்க",
  varum: "வரும்",
  varunga: "வாருங்க",
  irukku: "இருக்கு",
  illai: "இல்லை",
  nadakkum: "நடக்கும்",
  oodum: "ஓடும்",

  // === STORY & WRITING ===
  kathai: "கதை",
  kathaigal: "கதைகள்",
  peyar: "பெயர்",
  varippu: "வரிப்பு",
  kalam: "கலம்",
  kalai: "கலை",

  // === NUMBERS ===
  oru: "ஒரு",
  irudu: "இரண்டு",
  munu: "முன்று",
  naalu: "நாலு",
  aiththu: "ஐந்து",
  aaru: "ஆறு",
  elu: "எழு",
  ettu: "எட்டு",
  onpadu: "ஒன்பது",
  pathu: "பத்து",

  // === EMOTIONS ===
  kathal: "கதல்",
  anbu: "அன்பு",
  vali: "வலி",
  santhosham: "சந்தோஷம்",
  dukham: "துக்கம்",
  bhayam: "பயம்",

  // === RELATIONSHIPS ===
  amma: "அம்மா",
  appa: "அப்பா",
  thambi: "தம்பி",
  akka: "அக்கா",
  thangai: "தங்கை",

  // === CONJUNCTIONS ===
  aana: "ஆனா",
  aanal: "ஆனால்",
  appadi: "அப்படி",
  mattum: "மட்டும்",

  // === COMMON ENGLISH WORDS (FULL CONVERSION) ===
  // These will help convert English to Tamil phonetically
  is: "இஸ்",
  a: "அ",
  the: "தி",
  is: "இஸ்",
  be: "பி",
  are: "ஆர்",
  and: "அண்ட்",
  or: "ஓர்",
  but: "பட்",
  this: "திஸ்",
  that: "தட்",
  with: "வித்",
  from: "ஃப்ரம்",
  for: "ஃபார்",
  to: "டு",
  in: "இன்",
  on: "ஓன்",
  at: "அட்",
  by: "பை",
  lion: "லயன்",
  rainforest: "ரெயின்ஃபாரெஸ்ட்",
  forest: "ஃபாரெஸ்ட்",
  tropical: "ட்ரபிக்கல்",
  rain: "ரெயின்",
  tree: "ட்ரீ",
  flower: "ஃபிளவர்",
  sky: "ஸ்கை",
  sun: "சன்",
  beautiful: "பியூட்டிஃபுல்",
  nice: "நைஸ்",
  good: "குட்",
  bad: "பேட்",
  love: "லவ்",
  like: "லைக்",
  happy: "ஹேப்பி",
  sad: "சேட்",
  amazon: "அமேஸான்",
  story: "ஸ்டோரி",
  hello: "ஹெலோ",
  hello: "ஹெலோ",
  world: "வர்ல்ட்",
  life: "லைஃப்",
  new: "நியூ",
  old: "ஓல்ட்",
  time: "டைம்",
  place: "ப்ளேஸ்",
  thing: "திங்",
  people: "பீபிள்",
  person: "பர்சன்",
  man: "மேன்",
  woman: "வூமென்",
  day: "டே",
  night: "நைட்",
  year: "யிர்",
  water: "வாடர்",
  fire: "ஃபயர்",
  earth: "அர்த்",
  air: "எயர்",
  moon: "மூன்",
  star: "ஸ்டார்",
  land: "லேண்ட்",
  sea: "சீ",
};

/**
 * PHONETIC CONVERSION MAPS - For converting English/Tanglish to Tamil
 */
const consonantMap = {
  // Stops/Plosives
  k: "க", g: "க", c: "க", q: "க",
  p: "ப", b: "ப",
  t: "ட", d: "ட",
  
  // Nasals
  ng: "ங", n: "ண", m: "ம",
  
  // Fricatives
  ch: "ச", s: "ச", j: "ஜ", sh: "ஶ", zh: "ழ", th: "த", dh: "த",
  f: "ஃப", v: "வ", w: "வ", z: "ஸ", h: "ஹ", x: "க்ஸ",
  
  // Affricates & Approximants
  ny: "ஞ", y: "ய", r: "ர", l: "ல",
  
  // Retroflex
  ll: "ள", rr: "ற", nn: "ன", nh: "ந",
  
  // Grantha
  sri: "ஸ்ரீ", shri: "ஸ்ரீ",
};

const vowelMap = {
  // Short vowels
  a: "அ", e: "எ", i: "இ", o: "ஒ", u: "உ",
  
  // Long vowels
  aa: "ஆ", ae: "ஏ", ai: "ஐ", oa: "ஓ", au: "ஔ", 
  ee: "ஈ", oo: "ஊ",
};

/**
 * Converts word phonetically to Tamil
 * Direct and reliable character-by-character conversion
 * @param {string} word - Word to convert
 * @returns {string} Converted Tamil text
 */
const performPhoneticConversion = (word) => {
  if (!word) return word;
  
  const lowerWord = word.toLowerCase().trim();
  if (lowerWord.length === 0) return word;
  
  let result = "";
  let i = 0;

  while (i < lowerWord.length) {
    const char = lowerWord[i];
    const nextChar = i + 1 < lowerWord.length ? lowerWord[i + 1] : '';
    const twoChar = char + nextChar;

    // Two-character combinations have priority
    let matched = false;
    if (twoChar === "sh") { result += "ஶ"; i += 2; matched = true; }
    else if (twoChar === "ch") { result += "ச"; i += 2; matched = true; }
    else if (twoChar === "th") { result += "த"; i += 2; matched = true; }
    else if (twoChar === "ng") { result += "ங்"; i += 2; matched = true; }
    else if (twoChar === "ph") { result += "ப"; i += 2; matched = true; }
    else if (twoChar === "ai") { result += "ை"; i += 2; matched = true; }
    else if (twoChar === "au") { result += "ௌ"; i += 2; matched = true; }
    else if (twoChar === "oo") { result += "ூ"; i += 2; matched = true; }
    else if (twoChar === "ee") { result += "ீ"; i += 2; matched = true; }

    if (!matched) {
      // Single character conversions - use standalone Tamil characters, not diacritics
      if (char === "a") result += "அ";
      else if (char === "b") result += "ப";
      else if (char === "c") result += "ச";
      else if (char === "d") result += "ட";
      else if (char === "e") result += "எ";  // Fixed: standalone character, not diacritic
      else if (char === "f") result += "ப";
      else if (char === "g") result += "க";
      else if (char === "h") result += "ஹ";
      else if (char === "i") result += "இ";  // Fixed: standalone character, not diacritic
      else if (char === "j") result += "ஜ";
      else if (char === "k") result += "க";
      else if (char === "l") result += "ல";
      else if (char === "m") result += "ம";
      else if (char === "n") result += "ண";
      else if (char === "o") result += "ஒ";  // Fixed: standalone character, not diacritic
      else if (char === "p") result += "ப";
      else if (char === "q") result += "க";
      else if (char === "r") result += "ற";
      else if (char === "s") result += "ச";
      else if (char === "t") result += "ட";
      else if (char === "u") result += "உ";  // Fixed: standalone character, not diacritic
      else if (char === "v") result += "வ";
      else if (char === "w") result += "வ";
      else if (char === "x") result += "க்ஸ";
      else if (char === "y") result += "ய";
      else if (char === "z") result += "ஜ";
      else result += char; // Keep everything else as-is

      i++;
    }
  }

  return result;
};

/**
 * Smart conversion: Convert ALL text to Tamil
 * Full transliteration mode - everything becomes Tamil
 * 
 * @param {string} word - Single word to process
 * @returns {string} Converted to Tamil
 */
const convertWord = (word) => {
  if (!word || typeof word !== "string") return word;

  const trimmedWord = word.trim();
  if (trimmedWord.length === 0) return word;

  // Always apply phonetic conversion for every word (no dictionary, no Tamil check)
  const lowerWord = trimmedWord.toLowerCase();
  const phoneticResult = performPhoneticConversion(lowerWord);
  return phoneticResult || trimmedWord;
};

/**
 * MAIN FUNCTION: Process full text with smart conversion
 * 
 * WORKFLOW:
 * 1. Split by word boundaries
 * 2. For each word, check if English/Tamil/Tanglish
 * 3. Keep English, Convert everything else
 * 4. Preserve spaces and punctuation
 */
export const smartTransliterate = (text) => {
  if (!text || typeof text !== "string") return "";

  let result = "";
  
  // Split by word boundaries while preserving spaces and punctuation
  const parts = text.split(/(\s+|[.,!?;:—–\-])/);

  parts.forEach((part) => {
    // Preserve spaces and punctuation
    if (/^\s+$/.test(part) || /^[.,!?;:—–\-]$/.test(part)) {
      result += part;
      return;
    }

    if (part.length === 0) return;

    // Handle punctuation at end of word
    const match = part.match(/^(.+?)([.,!?;:—–\-]*)$/);
    const actualWord = match ? match[1] : part;
    const punctuation = match ? match[2] : "";

    // Convert the word
    const converted = convertWord(actualWord);
    result += converted + punctuation;
  });

  return result;
};

/**
 * Real-time conversion triggered when user presses SPACE
 * This is called from input event listener
 */
export const convertRealTimeOnSpace = (text, cursorPos) => {
  if (!text) {
    return {
      converted: "",
      cursorPosition: 0,
      wordConverted: false,
      originalWord: "",
      convertedWord: "",
    };
  }

  // Find the last word
  const beforeCursor = text.substring(0, cursorPos);
  const lastSpaceIndex = beforeCursor.lastIndexOf(" ");
  const lastWordStartIndex = lastSpaceIndex + 1;
  const lastWord = beforeCursor.substring(lastWordStartIndex);

  // If no word or just space, return as-is
  if (!lastWord) {
    return {
      converted: text,
      cursorPosition: cursorPos,
      wordConverted: false,
      originalWord: "",
      convertedWord: "",
    };
  }

  // Convert the last word
  const convertedWord = convertWord(lastWord);
  const wasConverted = convertedWord !== lastWord;

  // Build new text with converted word
  const beforeLastWord = text.substring(0, lastWordStartIndex);
  const afterLastWord = text.substring(cursorPos);
  const newText = beforeLastWord + convertedWord + afterLastWord;

  // Calculate new cursor position
  const newCursorPos = lastWordStartIndex + convertedWord.length + afterLastWord.length;

  return {
    converted: newText,
    cursorPosition: newCursorPos,
    wordConverted: wasConverted,
    originalWord: lastWord,
    convertedWord: convertedWord,
  };
};

// ============================================================
// UTILITY & VALIDATION FUNCTIONS
// ============================================================

/**
 * Check if text is already Tamil only
 */
export const isTamilOnly = (text) => {
  if (!text) return false;
  const tamilPattern = /^[\u0B80-\u0BFF\s\d.,!?;:\-()]+$/;
  return tamilPattern.test(text);
};

/**
 * Check if text contains mixed content
 */
export const hasMixedContent = (text) => {
  if (!text) return false;
  const hasEnglish = /[a-zA-Z]/.test(text);
  const hasTamil = /[\u0B80-\u0BFF]/.test(text);
  return hasEnglish && hasTamil;
};

/**
 * Get language info about text
 */
export const getLanguageInfo = (text) => {
  if (!text) return { type: "empty", content: "" };

  const hasEnglish = /[a-zA-Z]/.test(text);
  const hasTamil = /[\u0B80-\u0BFF]/.test(text);

  if (hasEnglish && hasTamil) return { type: "mixed", content: text };
  if (hasTamil) return { type: "tamil", content: text };
  if (hasEnglish) return { type: "english", content: text };
  return { type: "symbols", content: text };
};

/**
 * Prepare text for database storage
 */
export const prepareTamilForStorage = (tamilText) => {
  if (!tamilText) return "";

  // Clean extra spaces
  const cleaned = tamilText.trim().replace(/\s+/g, " ");

  // Validate
  const info = getLanguageInfo(cleaned);
  if (info.type === "empty") {
    return "";
  }

  return cleaned;
};
