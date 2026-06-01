
/*
export const getStoryById = async (id) => {
  const res = await fetch(`http://localhost:5000/api/stories/${id}`);
  if (!res.ok) throw new Error("Failed to load story");
  return res.json();
};
*/
// now executable code 
export const getStoryById = async (id) => {
  const res = await fetch(`http://localhost:5000/api/stories/${id}`);
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

