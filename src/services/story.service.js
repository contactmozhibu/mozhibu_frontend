import { API_BASE_URL } from "../config/apiConfig";

/*
export const getStoryById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/stories/${id}`);
  if (!res.ok) throw new Error("Failed to load story");
  return res.json();
};
*/
// now executable code 
export const getStoryById = async (id) => {
  const res = await fetch(`${API_BASE_URL}/stories/${id}`);
  if (!res.ok) {
    throw new Error("Failed to load story");
  }
  return res.json();
};

/*
import api from "./api";

const getStoryById = (id) => {
  return api.get(`/stories/${id}`);
};

const storyService = {
  getStoryById,
};

export default storyService;


*/

