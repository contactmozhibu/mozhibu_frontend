import { useState, useEffect } from "react";

// Simple JWT decoder
const decodeJWT = (token) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (token) {
      const decoded = decodeJWT(token);
      if (decoded && decoded.email) {
        setUser({
          id: decoded.id || decoded._id,
          email: decoded.email,
          name: decoded.name || decoded.email.split("@")[0],
          role: decoded.role || "user",
          ...decoded
        });
      }
    }
    
    setLoading(false);
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    window.location.href = "/login";
  };

  return { user, loading, logout };
};
