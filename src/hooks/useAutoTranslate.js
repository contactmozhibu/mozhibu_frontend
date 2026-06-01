
import { useEffect, useState } from "react";
import axios from "axios";
export default function useAutoTranslate(text, from, to) {
  const [translated, setTranslated] = useState("");

  useEffect(() => {
    if (!text) {
      setTranslated("");
      return;
    }

    const delayDebounce = setTimeout(async () => {
      try {
        const res = await fetch(
          `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
            text
          )}&langpair=${from}|${to}`
        );

        const data = await res.json();
        setTranslated(data.responseData.translatedText);
      } catch (err) {
        console.log("Translation error", err);
      }
    }, 700); // prevent API spam

    return () => clearTimeout(delayDebounce);
  }, [text, from, to]);

  return translated;
}
