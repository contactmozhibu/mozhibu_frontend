import axios from "axios";
import { API_BASE_URL } from "../../config/apiConfig";

// calls our backend translate API
export const translateLive = async (text, targetLang) => {
  try {
    if (!text || text.trim().length < 5) return text;

    const token = localStorage.getItem("token");

    const res = await axios.post(
      `${API_BASE_URL}/translate`,
      { text, targetLang },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return res.data.translated;
  } catch (err) {
    console.error("Live translation error:", err.message);
    return text; // fallback: keep original
  }
};
