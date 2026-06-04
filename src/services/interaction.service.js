import { API_BASE_URL } from "../config/apiConfig";

const BASE = `${API_BASE_URL}/stories`;

export const submitRating = async (storyId, rating, token) => {
  const res = await fetch(`${BASE}/${storyId}/rate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ rating })
  });

  if (!res.ok) throw new Error("Rating failed");
  return res.json();
};

export const fetchRatings = async (storyId) => {
  const res = await fetch(`${BASE}/${storyId}/ratings`);
  if (!res.ok) throw new Error("Failed to load ratings");
  return res.json();
};

export const submitComment = async (storyId, text, token) => {
  const res = await fetch(`${BASE}/${storyId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify({ text })
  });

  if (!res.ok) throw new Error("Comment failed");
  return res.json();
};

export const fetchComments = async (storyId) => {
  const res = await fetch(`${BASE}/${storyId}/comments`);
  if (!res.ok) throw new Error("Failed to load comments");
  return res.json();
};
