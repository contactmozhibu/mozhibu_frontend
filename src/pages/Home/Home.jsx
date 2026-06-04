/*
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./home.css";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [stories, setStories] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/stories", {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStories(data);
        } else {
          setStories([]);
        }
      })
      .catch(console.error);
  }, []);

  return (
    <>
      <section className="hero">
        <h1>{t("hero_title")}</h1>
        <p>{t("hero_subtitle")}</p>
      </section>

      <section className="stories-section">
        <h2>{t("all_stories")}</h2>

        {stories.length === 0 ? (
          <p>No stories found</p>
        ) : (
          <div className="stories-grid">
            {stories.map((story) => (
              <div
                className="story-card"
                key={story._id}
                onClick={() => navigate(`/story/${story._id}`)}
              >
                <img
                  src={story.coverImage || "/placeholder.jpg"}
                  alt={story.title}
                />

                <div className="story-info">
                  <h3>{story.title}</h3>
                  <p>{story.category}</p>

                  <p
                    className="author-name"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/author/${story.author?._id}`);
                    }}
                  >
                    {t("by")} {story.author?.username || "Unknown"}
                  </p>

                  <span>{story.ageCategory}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
*/

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./home.css";

import { API_BASE_URL } from "../../config/apiConfig";

export default function Home() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`${API_BASE_URL}/stories`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    })
      .then(async (res) => {
        const data = await res.json();

        console.log("📦 API RESPONSE:", data); // ✅ DEBUG

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch stories");
        }

        return data;
      })
      .then((data) => {
        if (Array.isArray(data)) {
          setStories(data);
        } else {
          setStories([]);
        }
      })
      .catch((err) => {
        console.error("❌ FETCH ERROR:", err);
        setStories([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <section className="hero">
        <h1>{t("hero_title")}</h1>
        <p>{t("hero_subtitle")}</p>
      </section>

      <section className="stories-section">
        <h2>{t("all_stories")}</h2>

        {loading ? (
          <p>Loading stories...</p>
        ) : stories.length === 0 ? (
          <p>No stories found</p>
        ) : (
          <div className="stories-grid">
            {stories.map((story) => (
              <div
                className="story-card"
                key={story._id}
                onClick={() => navigate(`/story/${story._id}`)}
              >
                <img
                  src={story.coverImage || "/placeholder.jpg"}
                  alt={story.title}
                />

                <div className="story-info">
                  <h3>{story.title}</h3>
                  <p>{story.category}</p>

                  <p
                    className="author-name"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/author/${story.author?._id}`);
                    }}
                  >
                    {t("by")} {story.author?.username || "Unknown"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
