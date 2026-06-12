// Centralized API configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || "https://mozhibu-backend.onrender.com";
export const SOCKET_URL = import.meta.env.VITE_API_URL?.replace("/api", "") || "https://mozhibu-backend.onrender.com";

// Helper function to get full URL for avatars and uploads
export const getImageUrl = (path, cacheBustParam = null) => {
  if (!path) return "https://via.placeholder.com/300x400?text=No+Image";
  if (path.startsWith("http")) return path; // Already full URL
  
  const baseUrl = `${SOCKET_URL}${path}`;
  
  // Add cache-buster parameter to force browser reload
  if (cacheBustParam) {
    // Convert to timestamp if it's a Date or string
    let timestamp = cacheBustParam;
    if (cacheBustParam instanceof Date) {
      timestamp = cacheBustParam.getTime();
    } else if (typeof cacheBustParam === 'string') {
      timestamp = new Date(cacheBustParam).getTime();
    }
    
    const separator = baseUrl.includes("?") ? "&" : "?";
    return `${baseUrl}${separator}t=${timestamp}`;
  }
  
  return baseUrl;
};
