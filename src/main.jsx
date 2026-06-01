import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./styles.css";
import "./i18n"; // Initialize i18n before rendering
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Toaster } from "react-hot-toast";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Toaster position="top-right" />
    <App />
    <ToastContainer
      position="top-right"
      autoClose={3000}
      pauseOnHover
      closeOnClick
    />
  </BrowserRouter>
);
