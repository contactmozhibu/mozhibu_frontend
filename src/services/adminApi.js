import api from "./api";

const ADMIN_API = "/admin";

// Dashboard
export const getDashboardStats = () => api.get(`${ADMIN_API}/dashboard/stats`);
export const getRecentActivity = () => api.get(`${ADMIN_API}/dashboard/activity`);

// Users
export const getUsers = (params) => api.get(`${ADMIN_API}/users`, { params });
export const getUserDetail = (id) => api.get(`${ADMIN_API}/users/${id}`);
export const updateUser = (id, data) => api.put(`${ADMIN_API}/users/${id}`, data);
export const blockUser = (id) => api.patch(`${ADMIN_API}/users/${id}/block`);
export const deleteUser = (id) => api.delete(`${ADMIN_API}/users/${id}`);
export const promoteUserToAdmin = (id) => api.patch(`${ADMIN_API}/users/${id}/promote`);

// Stories
export const getStories = (params) => api.get(`${ADMIN_API}/stories`, { params });
export const getStoryDetail = (id) => api.get(`${ADMIN_API}/stories/${id}`);
export const updateStory = (id, data) => api.put(`${ADMIN_API}/stories/${id}`, data);
export const deleteStory = (id) => api.delete(`${ADMIN_API}/stories/${id}`);
export const hideStory = (id) => api.patch(`${ADMIN_API}/stories/${id}/hide`);
export const featureStory = (id) => api.patch(`${ADMIN_API}/stories/${id}/feature`);

// Chapters
export const getChapters = (params) => api.get(`${ADMIN_API}/chapters`, { params });
export const deleteChapter = (id) => api.delete(`${ADMIN_API}/chapters/${id}`);

// Reviews
export const getReviews = (params) => api.get(`${ADMIN_API}/reviews`, { params });
export const deleteReview = (id) => api.delete(`${ADMIN_API}/reviews/${id}`);

// Reports
export const getReports = (params) => api.get(`${ADMIN_API}/reports`, { params });
export const updateReportStatus = (id, data) => api.patch(`${ADMIN_API}/reports/${id}/status`, data);

// Categories
export const getCategories = () => api.get(`${ADMIN_API}/categories`);
export const createCategory = (data) => api.post(`${ADMIN_API}/categories`, data);
export const updateCategory = (id, data) => api.put(`${ADMIN_API}/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`${ADMIN_API}/categories/${id}`);

// Notifications
export const sendNotification = (data) => api.post(`${ADMIN_API}/notifications/send`, data);

// Audit Logs
export const getAuditLogs = (params) => api.get(`${ADMIN_API}/audit-logs`, { params });

// Analytics
export const getAnalytics = () => api.get(`${ADMIN_API}/analytics`);


