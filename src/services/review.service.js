import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const API = `${API_BASE_URL}/reviews`;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getReviews = async (storyId) => {
  const res = await axios.get(`${API}/${storyId}`);
  return res.data;
};

export const saveReview = async (storyId, rating, comment) => {
  const res = await axios.post(
    API,
    { storyId, rating, comment },
    authHeader()
  );
  return res.data;
};
/* =========================
   👍 LIKE REVIEW
========================= */
export const likeReview = async (reviewId) => {
  const res = await axios.put(
    `${API}/${reviewId}/like`,
    {},
    authHeader()
  );
  return res.data;
};

/* =========================
   💬 REPLY TO REVIEW
========================= */

export const replyReview = async (reviewId, comment) => {
  const res = await axios.post(
    `${API}/${reviewId}/reply`,
    { comment },
    authHeader()
  );
  return res.data;
};