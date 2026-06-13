/*
import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "./navbar.css";

export default function Navbar() {
  const [profileOpen, setProfileOpen] = useState(false);
const profileRef = useRef(null);
const navigate = useNavigate();


  // Close dropdown on outside click
  useEffect(() => {
  const handleClickOutside = (e) => {
    if (profileRef.current && !profileRef.current.contains(e.target)) {
      setProfileOpen(false);
    }
  };

  document.addEventListener("mousedown", handleClickOutside);

  return () => {
    document.removeEventListener("mousedown", handleClickOutside);
  };
}, []);



  return (
    <nav className="navbar">
      {/* LEFT 
      <div className="nav-left">
        <Link to="/">
          <img src="./logo.png" alt="Mozhibu Logo" className="logo-img" />
        </Link>

        <select className="language-select">
          <option>English</option>
          <option>தமிழ்</option>
        </select>
      </div>

      {/* CENTER 
      <div className="nav-center">
        <input
          type="text"
          placeholder="Search stories..."
          className="search-input"
        />
      </div>

      {/* RIGHT 
      <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/draft">Draft</Link>

        <div className="profile-wrapper" ref={profileRef}>
  <button
    className="profile-btn"
    onClick={() => setProfileOpen((p) => !p)}
  >
    👤 Profile
  </button>

  {profileOpen && (
    <div className="profile-menu">
      <div
        onClick={() => {
          navigate("/author/me");
          setProfileOpen(false);
        }}
      >
        My Profile
      </div>

      <div
        onClick={() => {
          navigate("/account");
          setProfileOpen(false);
        }}
      >
        Account
      </div>

      <div
        onClick={() => {
          localStorage.clear();
          navigate("/login");
          setProfileOpen(false);
        }}
      >
        Logout
      </div>
    </div>
  )}
</div>


      </div>
    </nav>
  );
}
*/

/*
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const profileRef = useRef(null);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    const handler = (e) => {
      if (!profileRef.current) return;

      if (!profileRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handler, true); // 🔴 CAPTURE PHASE

    return () => {
      document.removeEventListener("click", handler, true);
    };
  }, []);

  return (
    <div className="navbar">
      
      <div className="nav-left">
        <h2 className="logo">Mozhibu</h2>

        <select className="language-select">
          <option>English</option>
          <option>தமிழ்</option>
        </select>
      </div>

      <div className="nav-center">
        <input
          type="text"
          placeholder="Search stories..."
          className="search-input"
        />
      </div>

      <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/draft">Draft</Link>

      <div
        ref={profileRef}
        className="profile-wrapper"
      >
        <button
          className="profile-btn"
          onClick={(e) => {
            e.stopPropagation(); // 🔴 REQUIRED
            setProfileOpen((p) => !p);
          }}
        >
          👤 Profile
        </button>

        {profileOpen && (
          <div
            className="profile-menu"
            onClick={(e) => e.stopPropagation()} // 🔴 REQUIRED
          >
            <div
              onClick={() => {
                setProfileOpen(false);
                navigate("/author/me");
              }}
            >
              My Profile
            </div>

            <div
              onClick={() => {
                setProfileOpen(false);
                navigate("/account");
              }}
            >
              Account
            </div>

            <div
              onClick={() => {
                localStorage.clear();
                setProfileOpen(false);
                navigate("/login");
              }}
            >
              Logout
            </div>
          </div>
  )}
</div>


      </div>
    </div>
  );
}
  */

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  getNotifications,
  markNotificationRead,
  getUnreadCount,
} from "../services/notification.service";

export default function Navbar() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const profileRef = useRef(null);
  const notifRef = useRef(null);

  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  // ✅ Handle search submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/?q=${encodeURIComponent(searchInput)}`);
    }
  };


  /* 🔔 Load notifications */
  useEffect(() => {
    const load = async () => {
      try {
        const data = await getNotifications();
        const count = await getUnreadCount();
        setNotifications(data);
        setUnreadCount(count);
      } catch (err) {
        console.error("Notification load failed");
      }
    };
    load();
  }, []);

  /* 🔴 Close dropdowns when clicking outside */
  useEffect(() => {
    const handler = (e) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target)
      ) {
        setProfileOpen(false);
      }

      if (
        notifRef.current &&
        !notifRef.current.contains(e.target)
      ) {
        setNotifOpen(false);
      }
    };

    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, []);

  return (
    <div className="navbar">
      {/* LEFT */}
      <div className="nav-left">
        <div className="logo-container">
          <Link to="/">
            <img 
              src="/logo alone .png" 
              alt="Mozhibu Logo" 
              className="logo-img"
              style={{ maxWidth: '40px', maxHeight: '40px' }}
            />
          </Link>
        </div>

        <select className="language-select">
          <option>English</option>
          <option>தமிழ்</option>
        </select>
      </div>

      {/* CENTER */}
      <div className="nav-center">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search stories..."
            className="search-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </form>
      </div>

      {/* RIGHT */}
      <div className="nav-right">
        <Link to="/">Home</Link>
        <Link to="/categories">Categories</Link>
        <Link to="/draft">Draft</Link>

        {isAdmin && (
  <button
    onClick={() => navigate("/admin/dashboard")}
    style={{
      padding: "6px 12px",
      borderRadius: "8px",
      background: "#4f46e5",
      color: "#fff",
      border: "none",
      cursor: "pointer",
      fontWeight: "600",
      marginLeft: "8px",
    }}
  >
    Dashboard
  </button>
)}


        {/* 🔔 NOTIFICATION */}
        <div ref={notifRef} className="notification-wrapper">
          <button
            className="notif-btn"
            onClick={(e) => {
              e.stopPropagation();
              setNotifOpen((p) => !p);
            }}
          >
            🔔
            {unreadCount > 0 && (
              <span className="notif-badge">{unreadCount}</span>
            )}
          </button>

          {notifOpen && (
            <div className="notif-dropdown">
              {notifications.length === 0 ? (
                <p className="empty">{t("notif_empty") || "No notifications"}</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n._id}
                    className={`notif-item ${
                      n.isRead ? "" : "unread"
                    }`}
                    onClick={async () => {
                      if (!n.isRead) {
                        await markNotificationRead(n._id);
                        setUnreadCount((c) => Math.max(0, c - 1));
                      }
                      setNotifOpen(false);
                    }}
                  >
                    <p>{n.message}</p>
                    <small>
                      {new Date(n.createdAt).toLocaleDateString()}
                    </small>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* 👤 PROFILE */}
        <div ref={profileRef} className="profile-wrapper">
          <button
            className="profile-btn"
            onClick={(e) => {
              e.stopPropagation();
              setProfileOpen((p) => !p);
            }}
          >
            👤 {t("nav_profile")}
          </button>

          {profileOpen && (
            <div
              className="profile-menu"
              onClick={(e) => e.stopPropagation()}
            >
              <div
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/author/me");
                }}
              >
                {t("nav_account_details")}
              </div>

              <div
                onClick={() => {
                  setProfileOpen(false);
                  navigate("/account");
                }}
              >
                {t("nav_change_password")}
              </div>

              <div
                onClick={() => {
                  localStorage.clear();
                  setProfileOpen(false);
                  navigate("/login");
                }}
              >
                {t("nav_logout")}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
