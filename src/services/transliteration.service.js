import axios from 'axios';

const GOOGLE_TRANSLITERATE_API_URL = 'https://inputtools.google.com/request?text=%s&itc=ta-t-i0-und&num=1&cp=0&cs=1&ie=utf-8&oe=utf-8&app=jsapi&cb=google.elements.TransliterationStatus.callback&vc=1';

export const transliterateText = async (text) => {
  if (!text || text.trim() === '') {
    return '';
  }

  try {
    const url = GOOGLE_TRANSLITERATE_API_URL.replace('%s', encodeURIComponent(text));
    const response = await axios.get(url);
    
    // Google Input Tools API returns a specific JSONP format
    // We need to parse this to extract the transliterated text
    const data = response.data;
    if (data && data[0] === 'REQUEST' && data[1] && data[1][0] && data[1][0][1] && data[1][0][1][0]) {
      return data[1][0][1][0]; // This is the first transliterated suggestion
    }
    return text; // Fallback to original text if parsing fails
  } catch (error) {
    console.error('Transliteration API error:', error);
    return text; // Fallback to original text on error
  }
};
