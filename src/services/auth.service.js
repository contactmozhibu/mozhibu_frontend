
import axios from "axios";

const API = `${import.meta.env.VITE_API_URL}/auth`;

export const login = (data) => axios.post(`${API}/login`, data);
export const register = (data) => axios.post(`${API}/register`, data);

export const verifyOtp = (data) =>
  axios.post(`${API}/verify-otp`, data);

export const resendOtp = (data) =>
  axios.post(`${API}/resend-otp`, data);
