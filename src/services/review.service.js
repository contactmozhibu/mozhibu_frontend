import axios from "axios";

const API = "http://localhost:5000/api/reviews";

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
