import axios from "axios";
import { API_BASE_URL } from "../config/apiConfig";

const API = `${API_BASE_URL}/notifications`;

const authHeader = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* 🔔 Get all notifications *
export const getNotifications = async () => {
  const token = localStorage.getItem("token");

  if (!token) return [];

  const res = await api.get("/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};


/* 🔢 Get unread count (for bell badge) *
export const getUnreadCount = async () => {
  const res = await axios.get(`${API}/unread-count`, authHeader());
  return res.data;
};

/* ✅ Mark ONE notification as read (ON CLICK) *
export const markAsRead = async (id) => {
  const res = await axios.patch(`${API}/${id}/read`, {}, authHeader());
  return res.data;
};

/* ✅ Mark ALL notifications as read *
export const markAllRead = async () => {
  const res = await axios.put(`${API}/mark-read`, {}, authHeader());
  return res.data;
};
*/

import api from "./api";

/* 🔔 Get all notifications */
export const getNotifications = async () => {
  const token = localStorage.getItem("token");
  if (!token) return [];

  const res = await api.get("/notifications", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

/* 🔢 Get unread count */
export const getUnreadCount = async () => {
  const res = await api.get("/notifications/unread-count");
  return res.data;
};

/* ✅ Mark ONE notification as read */
export const markAsRead = async (id) => {
  const res = await api.patch(`/notifications/${id}/read`);
  return res.data;
};

/* ✅ Mark ALL notifications as read */
export const markAllRead = async () => {
  const res = await api.put("/notifications/mark-read");
  return res.data;
};
