// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://mozhibu-backend.onrender.com";
export const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "https://mozhibu-backend.onrender.com";

// Helper function to get full URL for avatars and uploads
export const getImageUrl = (path) => {
  if (!path) return "https://via.placeholder.com/300x400?text=No+Image";
  if (path.startsWith("http")) return path; // Already full URL
  return `${SOCKET_URL}${path}`;
};
