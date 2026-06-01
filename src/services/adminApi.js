import api from "./api";

/* ===========================
   USERS
=========================== */

export const fetchAllUsers = () => api.get("/admin/users");

export const deactivateUser = (userId) =>
  api.patch(`/admin/users/${userId}/deactivate`);

export const deleteUser = (userId) =>
  api.delete(`/admin/users/${userId}`);

/* ===========================
   STORIES
=========================== */

export const deleteStoryByAdmin = (storyId) =>
  api.delete(`/admin/stories/${storyId}`);
