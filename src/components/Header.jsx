/*
import { Link, useNavigate } from "react-router-dom";
import { Home, Grid, Edit, User, Search, Bell } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { connectSocket, onNewNotification } from "../services/socket.service.js";


import "../styles.css";
import "./Header.css";
import { getNotifications } from "../services/notification.service.js";

export default function Header() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));
const isAdmin = user?.role === "admin";


  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const changeLanguage = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };
  const loadUnreadCount = async () => {
  try {
    const data = await getNotifications();
    const unread = data.filter((n) => !n.isRead).length;
    setUnreadCount(unread);
  } catch (err) {
    console.error(err);
  }
};

useEffect(() => {
  if (!token || isAdmin) return;
  loadUnreadCount();
}, [token, isAdmin]);

useEffect(() => {
  if (!token || isAdmin || !user?._id) return;

  connectSocket(user._id);

  onNewNotification(() => {
    loadUnreadCount(); // 🔔 update bell instantly
  });

}, [token, isAdmin, user?._id]);




  return (
    <header className="header">
      
      <div className="left-group">
        <Link to="/" className="logo-link">
          <img 
            src="/logo alone.png" 
            alt="Mozhibu Logo" 
            className="logo-img"
            style={{ maxWidth: '40px', maxHeight: '40px' }}
          />
        </Link>
        <select
          className="language-select"
          value={i18n.language}
          onChange={changeLanguage}
        >
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>

      <div className="search-box">
        <Search size={18} />
        <input type="text" placeholder={t("search_placeholder")} />
      </div>

      <nav className="nav">
        <Link to="/" className="nav-item">
          <Home size={18} /> {t("nav_home")}
        </Link>

        <Link to="/categories" className="nav-item">
          <Grid size={18} /> {t("nav_categories")}
        </Link>

        <Link to="/draft" className="nav-item">
          <Edit size={18} /> {t("nav_draft")}
        </Link>

        {token && !isAdmin && (
          <button
  className="notif-btn"
  onClick={() => {
    navigate("/notifications");
    setUnreadCount(0); // instant UI feedback
  }}
>

            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notif-count">{unreadCount}</span>
            )}
          </button>
        )}

        {!token ? (
          <Link to="/login" className="nav-item">
            <User size={18} /> {t("nav_login")}
          </Link>
        ) : (
          <div className="profile-container">
            <div
              className="nav-item profile-trigger"
              onClick={() => setOpen((prev) => !prev)}
            >
              <User size={18} /> Profile ▾
            </div>

            {open && (
              <div className="profile-dropdown">
                <div
                  className="dropdown-item"
                  onClick={() => navigate("/author/me")}

                >
                  Account Details
                </div>

                <div
                  className="dropdown-item"
                  onClick={() => navigate("/change-password")}
                >
                  Change Password
                </div>
                <div className="dropdown-item logout" onClick={handleLogout}>
                  Logout
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
*/

import { Link, useNavigate, useLocation } from "react-router-dom";
import { Home, Grid, Edit, User, Search, Bell, Menu, X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";

import "../styles.css";
import "./Header.css";
import { getNotifications } from "../services/notification.service.js";

export default function Header() {
  const navigate = useNavigate();
  const location = useLocation(); // ⭐ detect route change
  const token = localStorage.getItem("token");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  const { t, i18n } = useTranslation();

  const [open, setOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileRef = useRef(null); // ⭐ for outside click
  const menuRef = useRef(null); // ⭐ for mobile menu

  /* 🌐 Change language */
  const changeLanguage = (e) => {
    const lang = e.target.value;
    i18n.changeLanguage(lang);
    localStorage.setItem("lang", lang);
    document.documentElement.lang = lang;
  };

  /* 🚪 Logout */
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  /* 🔔 Load unread notification count */
  useEffect(() => {
    if (!token || isAdmin) return;

    const loadNotifications = async () => {
      try {
        const data = await getNotifications();
        const unread = data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } catch (err) {
        console.error("Failed to load notifications", err);
      }
    };

    loadNotifications();
  }, [token, isAdmin]);

  /* ⭐ CLOSE DROPDOWN WHEN ROUTE CHANGES */
  useEffect(() => {
    setOpen(false);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  /* ⭐ CLOSE WHEN CLICK OUTSIDE */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setOpen(false);
      }
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="header">
      {/* LEFT: LOGO + LANGUAGE */}
      <div className="left-group">
        <Link to="/" className="logo-link">
          <img 
            src="/logo alone .png" 
            alt="Mozhibu Logo" 
            className="logo-img"
            style={{ maxWidth: '40px', maxHeight: '40px' }}
          />
          <img 
            src="/naming logo.png" 
            alt="Mozhibu" 
            className="logo-text"
            style={{ maxHeight: '30px', marginLeft: '8px' }}
          />
        </Link>
        <select
          className="language-select"
          value={i18n.language}
          onChange={changeLanguage}
          title="Change language / மொழி மாற்று"
        >
          <option value="en">English</option>
          <option value="ta">தமிழ்</option>
        </select>
      </div>

      {/* CENTER: SEARCH */}
      <div className="search-box">
        <Search size={18} />
        <input type="text" placeholder={t("search_placeholder")} />
      </div>

      {/* HAMBURGER MENU BUTTON (Mobile Only) */}
      <button
        className="hamburger-btn"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        title="Menu"
      >
        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* RIGHT: NAV */}
      <nav className={`nav ${mobileMenuOpen ? "mobile-open" : ""}`} ref={menuRef}>
        <Link to="/" className="nav-item">
          <Home size={18} /> {t("nav_home")}
        </Link>

        <Link to="/categories" className="nav-item">
          <Grid size={18} /> {t("nav_categories")}
        </Link>

        <Link to="/draft" className="nav-item">
          <Edit size={18} /> {t("nav_draft")}
        </Link>

        {/* 🔔 NOTIFICATION */}
        {token && !isAdmin && (
          <button className="notif-btn" onClick={() => navigate("/notifications")}>
            <Bell size={18} />
            {unreadCount > 0 && (
              <span className="notif-count">{unreadCount}</span>
            )}
          </button>
        )}

        {/* 👤 PROFILE */}
        {!token ? (
          <Link to="/login" className="nav-item">
            <User size={18} /> {t("nav_login")}
          </Link>
        ) : (
          <div className="profile-container" ref={profileRef}>
            <div
              className="nav-item profile-trigger"
              onClick={() => setOpen((prev) => !prev)}
            >
              <User size={18} /> {t("nav_profile")} ▾
            </div>

            {open && (
              <div className="profile-dropdown">
                <div
                  className="dropdown-item"
                  onClick={() => navigate("/author/me")}
                >
                  {t("nav_account_details")}
                </div>

                <div
                  className="dropdown-item"
                  onClick={() => navigate("/change-password")}
                >
                  {t("nav_change_password")}
                </div>

                <div className="dropdown-item logout" onClick={handleLogout}>
                  {t("nav_logout")}
                </div>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}
