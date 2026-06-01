/**
 * MERN Mozhibu - Tanglish to Tamil Transliterator
 * Real-time language conversion using phonetic rules and dictionary
 * 
 * ARCHITECTURE:
 * ============
 * User Types Tanglish (Input)
 *    ↓
 * Input Event Listener (Captures typing in real-time)
 *    ↓
 * Transliteration Engine (Converts using dictionary + phonetic rules)
 *    ↓
 * Tamil Unicode Generated (Tamil characters created)
 *    ↓
 * Unicode Renderer (Displays Tamil text instantly)
 *    ↓
 * Database Storage (Saves to MongoDB)
 */

// Comprehensive Tanglish to Tamil dictionary
// Used as primary mapping and for common phrases
const tanglishDictionary = {
  // === GREETINGS & COURTESY ===
  vanakkam: "வணக்கம்",
  vanakam: "வணகம்",
  nandri: "நன்றி",
  salam: "சலாம்",
  namaskaram: "நமஸ்காரம்",
  
  // === BASIC PRONOUNS ===
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
  
  // === COMMON VERBS ===
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
  thidum: "திடும்",
  thedum: "தேடும்",
  
  // === STORY & WRITING ===
  kathai: "கதை",
  kathaigal: "கதைகள்",
  varippu: "வரிப்பு",
  kalam: "கலம்",
  kalai: "கலை",
  peyar: "பெயர்",
  
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
  
  // === EMOTIONS & FEELINGS ===
  kathal: "கதல்",
  anbu: "அன்பு",
  vali: "வலி",
  santhosham: "சந்தோஷம்",
  dukham: "துக்கம்",
  bhayam: "பயம்",
  
  // === BODY PARTS ===
  kai: "கை",
  kan: "கண்",
  mookku: "முக்கு",
  
  // === NATURE & ENVIRONMENT ===
  poo: "பூ",
  maram: "மரம்",
  ilai: "இலை",
  
  // === TIME RELATED ===
  naal: "நாள்",
  iravu: "இரவு",
  neram: "நேரம்",
  
  // === FOOD & COOKING ===
  saapadu: "சாப்பாடு",
  unavu: "உணவு",
  paal: "பால்",
  
  // === COMMON ADJECTIVES ===
  nalla: "நல்ல",
  chinna: "சின்ன",
  periya: "பெரிய",
  karuppu: "கருப்பு",
  
  // === COMMON NAMES ===
  yazhini: "யாழினி",
  malini: "மாலினி",
  kumaran: "குமாரன்",
  kumari: "குமாரி",
  meena: "மீனா",
  amazon: "அமேசான்",
  pratilipi: "பிரதிலிபி",
  
  // === CONJUNCTIONS ===
  aana: "ஆனா",
  aanal: "ஆனால்",
  appadi: "அப்படி",
  mattum: "மட்டும்",
  
  // === RELATIONSHIPS ===
  amma: "அம்மா",
  appa: "அப்பா",
  thambi: "தம்பி",
  akka: "அக்கா",

  // === ENGLISH TO TAMIL TRANSLATIONS ===
  // NATURE & ENVIRONMENT
  forest: "காடு",
  rain: "மழை",
  tree: "மரம்",
  trees: "மரங்கள்",
  water: "நீர்",
  sky: "வானம்",
  cloud: "மேகம்",
  sun: "சூரியன்",
  moon: "சந்திரன்",
  star: "நட்சத்திரம்",
  earth: "பூமி",
  wind: "காற்று",
  fire: "தீ",
  flower: "பூ",
  flowers: "பூக்கள்",
  leaf: "இலை",
  leaves: "இலைகள்",
  grass: "புல்",
  mountain: "மலை",
  river: "ஆறு",
  sea: "கடல்",
  beach: "கடற்கரை",
  animal: "விலங்கு",
  animals: "விலங்குகள்",
  bird: "பறவை",
  birds: "பறவைகள்",
  fish: "மீன்",
  
  // FOOD & DRINK
  food: "உணவு",
  rice: "அரிசி",
  bread: "ரொட்டி",
  fruit: "பழம்",
  fruits: "பழங்கள்",
  milk: "பால்",
  tea: "தேநீர்",
  coffee: "காபி",
  salt: "உப்பு",
  sugar: "சர்க்கரை",
  oil: "எண்ணெய்",
  
  // PEOPLE & RELATIONSHIPS
  man: "ஆணு",
  woman: "பெண்",
  child: "குழந்தை",
  children: "குழந்தைகள்",
  boy: "பையன்",
  girl: "பெண்ணு",
  mother: "அம்மா",
  father: "அப்பா",
  brother: "தம்பி",
  sister: "தங்கை",
  grandmother: "பாட்டி",
  grandfather: "தாத்தா",
  family: "குடும்பம்",
  friend: "நண்பன்",
  friends: "நண்பர்கள்",
  
  // BODY PARTS
  head: "தலை",
  hand: "கை",
  hands: "கைகள்",
  leg: "கால்",
  legs: "கால்கள்",
  eye: "கண்",
  eyes: "கண்கள்",
  nose: "மூக்கு",
  mouth: "வாய்",
  ear: "காது",
  ears: "காதுகள்",
  heart: "இதயம்",
  
  // ACTIONS & VERBS (Present form)
  run: "ஓட",
  walk: "நட",
  sit: "உட்கார",
  stand: "நின்ற",
  sleep: "தூங்க",
  eat: "சாப்பிட",
  drink: "குடி",
  sing: "பாட",
  dance: "ஆட",
  play: "விளை",
  read: "படி",
  write: "எழுது",
  speak: "பேசு",
  listen: "கேள்",
  look: "பார்",
  see: "பார்",
  hear: "கேள்",
  talk: "பேசு",
  come: "வா",
  go: "போ",
  give: "தัர",
  take: "வாங்கு",
  
  // DESCRIPTIVE WORDS
  beautiful: "아름답다",
  ugly: "அசிரதம்",
  big: "பெரிய",
  small: "சிறிய",
  long: "நீளமான",
  short: "குறைந்த",
  tall: "உயரமான",
  fast: "வேகமான",
  slow: "மெதுவான",
  good: "நல்ல",
  bad: "கெட்ட",
  happy: "மகிழ்ச்சியான",
  sad: "சோகமான",
  hot: "சூடான",
  cold: "குளிரான",
  wet: "நனைந்த",
  dry: "உலர்ந்த",
  clean: "சுத்தமான",
  dirty: "அசுத்தமான",
  
  // OBJECTS & THINGS
  house: "வீடு",
  home: "வீடு",
  room: "அறை",
  door: "கதவு",
  window: "ஜன்னல்",
  table: "மேசை",
  chair: "நாற்காலி",
  bed: "படுக்கை",
  book: "புத்தகம்",
  books: "புத்தகங்கள்",
  pen: "பேனா",
  pencil: "பென்சில்",
  paper: "காகிதம்",
  picture: "படம்",
  car: "கார்",
  vehicle: "வாகனம்",
  bus: "பேருந்து",
  train: "ரயில்",
  road: "சாலை",
  street: "தெரு",
  
  // TIME
  day: "நாள்",
  night: "இரவு",
  morning: "காலை",
  evening: "மாலை",
  noon: "நண்பகல்",
  hour: "மணிநேரம்",
  minute: "நிமிடம்",
  second: "விநாடி",
  week: "வாரம்",
  month: "மாதம்",
  year: "வருடம்",
  today: "இன்று",
  tomorrow: "நாளை",
  yesterday: "நேற்று",
  
  // COLORS
  red: "சிவப்பு",
  blue: "நீலம்",
  green: "பச்சை",
  yellow: "மஞ்சள்",
  white: "வெளுப்பு",
  black: "கருப்பு",
  orange: "ஆரஞ்சு",
  purple: "ஊதா",
  pink: "இளஞ்சிவப்பு",
  
  // NUMBERS (English words)
  one: "ஒன்று",
  two: "இரண்டு",
  three: "மூன்று",
  four: "நான்கு",
  five: "ஐந்து",
  six: "ஆறு",
  seven: "ஏழு",
  eight: "எட்டு",
  nine: "ஒன்பது",
  ten: "பத்து",
  hundred: "நூறு",
  thousand: "ஆயிரம்",
  
  // COMMON WORDS
  yes: "ஆம்",
  no: "இல்லை",
  please: "தயவுசெய்து",
  thank: "நன்றி",
  hello: "வணக்கம்",
  bye: "பிரிவேலை",
  goodbye: "பிரிவேலை",
  name: "பெயர்",
  place: "இடம்",
  thing: "பொருள்",
  time: "நேரம்",
  work: "வேலை",
  story: "கதை",
  music: "இசை",
  song: "பாடல்",
  dance: "நடனம்",
  art: "கலை",
  love: "கதல்",
  hate: "வெறுப்பு",
  fear: "பயம்",
  joy: "மகிழ்ச்சி",
  sorrow: "துக்கம்",
  peace: "அமைதி",
  war: "போர்",
  
  // COMMON ENGLISH WORDS (FOR FULL CONVERSION)
  amazon: "அமேஸான்",
  forest: "ஃபாரெஸ்ட்",
  rainforest: "ரெயின்ஃபாரெஸ்ட்",
  tropical: "ட்ரபிக்கல்",
  is: "இஸ்",
  a: "அ",
  the: "தி",
  and: "அண்ட்",
  or: "ஓர்",
  but: "பட்",
  in: "இன்",
  on: "ஓன்",
  at: "அட்",
  to: "டு",
  from: "ஃப்ரம்",
  for: "ஃபார்",
  with: "வித்",
  by: "பை",
  lion: "லயன்",
  rain: "ரெயின்",
  tree: "ட்ரீ",
  flower: "ஃபிளவர்",
  sky: "ஸ்கை",
  sun: "சன்",
  beautiful: "பியூட்டிஃபுல்",
  nice: "நைஸ்",
  like: "லைக்",
  world: "வர்ல்ட்",
  life: "லைஃப்",
  new: "நியூ",
  old: "ஓல்ட்",
  time: "டைம்",
  day: "டே",
  night: "நைட்",
  year: "யிர்",
  water: "வாடர்",
  fire: "ஃபயர்",
  earth: "அர்த்",
  air: "எயர்",
  moon: "மூன்",
  star: "ஸ்டார்",
  happy: "ஹேப்பி",
  sad: "சேட்",
};

/**
 * Step 1: Hybrid Transliteration
 * Attempts conversion using three methods:
 * 1. Dictionary lookup (fastest, most accurate for common words)
 * 2. Phonetic rules (handles variations)
 * 3. Fallback to original text
 */
const transliterateWord = (word) => {
  if (!word || typeof word !== "string") return word;
  
  const lowerWord = word.toLowerCase();
  
  // Step 1: Check dictionary first for exact matches
  if (tanglishDictionary[lowerWord]) {
    return tanglishDictionary[lowerWord];
  }

  // Step 2: Try phonetic conversion for all English words and unknown words
  // This ensures all English text gets converted to Tamil phonetically
  return performPhoneticConversion(lowerWord);
};

/**
 * Step 2: Simple and Reliable Phonetic Conversion
 * Converts English/Tanglish phonetics to Tamil directly
 * Character-by-character mapping with no complex rules
 */
const performPhoneticConversion = (word) => {
  if (!word) return word;
  
  let result = "";
  let i = 0;

  while (i < word.length) {
    const char = word[i];
    const nextChar = i + 1 < word.length ? word[i + 1] : '';
    const twoChar = char + nextChar;
    let matched = false;

    // Check two-character combinations first
    if (twoChar === "sh") { result += "ஶ"; i += 2; matched = true; }
    else if (twoChar === "ch") { result += "ச"; i += 2; matched = true; }
    else if (twoChar === "th") { result += "த"; i += 2; matched = true; }
    else if (twoChar === "ng") { result += "ங்"; i += 2; matched = true; }
    else if (twoChar === "ph") { result += "ப"; i += 2; matched = true; }
    else if (twoChar === "ai") { result += "ை"; i += 2; matched = true; }
    else if (twoChar === "au") { result += "ு"; i += 2; matched = true; }
    else if (twoChar === "oo") { result += "ூ"; i += 2; matched = true; }
    else if (twoChar === "ee") { result += "ீ"; i += 2; matched = true; }

    if (!matched) {
      // Single character conversions
      if (char === "a") result += "அ";
      else if (char === "b") result += "ப";
      else if (char === "c") result += "ச";
      else if (char === "d") result += "ட";
      else if (char === "e") result += "ெ";
      else if (char === "f") result += "ப";
      else if (char === "g") result += "க";
      else if (char === "h") result += "ஹ";
      else if (char === "i") result += "ி";
      else if (char === "j") result += "ஜ";
      else if (char === "k") result += "க";
      else if (char === "l") result += "ல";
      else if (char === "m") result += "ம";
      else if (char === "n") result += "ண";
      else if (char === "o") result += "ொ";
      else if (char === "p") result += "ப";
      else if (char === "q") result += "க";
      else if (char === "r") result += "ற";
      else if (char === "s") result += "ச";
      else if (char === "t") result += "ட";
      else if (char === "u") result += "ு";
      else if (char === "v") result += "வ";
      else if (char === "w") result += "வ";
      else if (char === "x") result += "க்ஸ";
      else if (char === "y") result += "ய";
      else if (char === "z") result += "ஜ";
      else result += char; // Keep everything else as-is (spaces, numbers, punctuation)

      i++;
    }
  }

  return result;
};

/**
 * Step 3: Main Transliteration Function
 * Input Listener trigger point - processes text as user types
 * Handles spaces and punctuation preservation
 */
export const transliterateToTamil = (englishText) => {
  if (!englishText || typeof englishText !== "string") return "";
  
  let result = "";
  // Split by word boundaries while preserving spaces and punctuation
  const words = englishText.split(/(\s+|[.,!?;:—–-])/);
  
  words.forEach((word) => {
    // Preserve spaces and punctuation
    if (/^\s+$/.test(word) || /^[.,!?;:—–-]$/.test(word)) {
      result += word;
      return;
    }
    
    if (word.length === 0) return;
    
    // Separate any trailing punctuation
    const match = word.match(/^(.+?)([.,!?;:—–-]*)$/);
    const actualWord = match ? match[1] : word;
    const punctuation = match ? match[2] : "";
    
    // Convert the word
    const converted = transliterateWord(actualWord);
    result += converted + punctuation;
  });
  
  return result;
};

/**
 * Step 4: Advanced Transliteration with Real-time Support
 * Better for continuous text input (as user types)
 * Processes the entire text intelligently
 */
export const advancedTransliterate = (text) => {
  if (!text || typeof text !== "string") return "";
  
  // Split by spaces but keep track of them
  const parts = text.split(/(\s+)/);
  let result = "";
  
  parts.forEach((part) => {
    // If it's whitespace, keep it
    if (/^\s+$/.test(part)) {
      result += part;
      return;
    }
    
    if (part.length === 0) return;
    
    // Convert each word
    const converted = transliterateToTamil(part);
    result += converted;
  });
  
  return result;
};

/**
 * Step 5: Real-time Conversion (For Input Listener)
 * Called on every keystroke
 * Optimized for performance and instant feedback
 */
export const convertRealTime = (text, cursorPosition = null) => {
  if (!text) return { converted: "", cursorPosition: 0 };
  
  const converted = advancedTransliterate(text);
  
  // Try to maintain cursor position
  // (This is simplified; a full implementation would need more logic)
  const estimatedCursorPos = cursorPosition ? 
    Math.min(cursorPosition, converted.length) : 
    converted.length;
  
  return {
    converted,
    cursorPosition: estimatedCursorPos,
    originalLength: text.length,
    convertedLength: converted.length,
  };
};

/**
 * Step 6: Detect Language Type
 * Determines if text is Tanglish or already Tamil
 */
export const isTanglish = (text) => {
  if (!text) return false;
  
  // Check if contains English letters
  const englishLetters = text.match(/[a-zA-Z]/g);
  const tamilLetters = text.match(/[\u0B80-\u0BFF]/g);
  
  // It's Tanglish if it has English letters (and maybe Tamil mixed)
  return englishLetters && englishLetters.length > 0;
};

/**
 * Step 7: Detect Language Type - Tamil Only
 */
export const isTamilOnly = (text) => {
  if (!text) return false;
  
  // Tamil Unicode range: U+0B80 to U+0BFF
  const tamilPattern = /^[\u0B80-\u0BFF\s]+$/;
  return tamilPattern.test(text);
};

/**
 * Step 8: Hybrid Conversion
 * Main conversion function called from UI
 * Smart detection and conversion
 */
export const convertTanglishToTamil = (text) => {
  if (!text) return "";
  
  // If already Tamil, return as-is
  if (isTamilOnly(text)) {
    return text;
  }
  
  // If Tanglish or mixed, convert
  if (isTanglish(text)) {
    return advancedTransliterate(text);
  }
  
  return text;
};

/**
 * Step 9: Validation - Check if conversion was successful
 */
export const isConversionSuccessful = (original, converted) => {
  if (!original || !converted) return false;
  
  // Conversion is successful if:
  // 1. Output is different from input
  // 2. Output contains Tamil characters
  const hasTamil = /[\u0B80-\u0BFF]/.test(converted);
  const isDifferent = original !== converted;
  
  return hasTamil && isDifferent;
};

/**
 * Step 10: Preparation for Database Storage
 * Validates Tamil text before saving to MongoDB
 */
export const prepareTamilForStorage = (tamilText) => {
  if (!tamilText) return "";
  
  // Clean up the text (remove extra spaces, etc.)
  const cleaned = tamilText.trim().replace(/\s+/g, ' ');
  
  // Validate it's actually Tamil
  if (!isTamilOnly(cleaned)) {
    console.warn("Warning: Text may contain non-Tamil characters");
  }
  
  return cleaned;
};

/**
 * Export all functions as default object
 * Can be imported as: import transliterator from '...transliterator.js'
 */
export default {
  transliterateToTamil,
  advancedTransliterate,
  convertRealTime,
  isTanglish,
  isTamilOnly,
  convertTanglishToTamil,
  isConversionSuccessful,
  prepareTamilForStorage,
  tanglishDictionary,
};
