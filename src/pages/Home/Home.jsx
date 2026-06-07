
/*
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
*/

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./home.css";

import { API_BASE_URL } from "../../config/apiConfig";

export default function Home() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // ✅ Get i18n also
  const { t, i18n } = useTranslation();

  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    // ✅ Convert i18next language to DB language
    const selectedLanguage =
      i18n.language === "ta" ? "Tamil" : "English";

    // ✅ Get search query from URL
    const searchQuery = searchParams.get("q") || "";

    setLoading(true);

    // ✅ Build URL with language and search
    let url = `${API_BASE_URL}/stories?language=${selectedLanguage}`;
    if (searchQuery) {
      url += `&search=${encodeURIComponent(searchQuery)}`;
    }

    fetch(url, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {},
    })
      .then(async (res) => {
        const data = await res.json();

        console.log("📦 API RESPONSE:", data);

        if (!res.ok) {
          throw new Error(
            data.message || "Failed to fetch stories"
          );
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

  }, [i18n.language, searchParams]); // ✅ Reload when language or search changes

  return (
    <>
      <section className="hero">
        <h1>{t("hero_title")}</h1>
        <p>{t("hero_subtitle")}</p>
      </section>

      <section className="stories-section">
        <h2>
          {searchParams.get("q")
            ? `Search Results for "${searchParams.get("q")}"`
            : t("all_stories")}
        </h2>

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
                onClick={() =>
                  navigate(`/story/${story._id}`)
                }
              >
                <img
                  src={
                    story.coverImage ||
                    "/placeholder.jpg"
                  }
                  alt={story.title}
                />

                <div className="story-info">
                  <h3>{story.title}</h3>

                  <p>{story.category}</p>

                  <p
                    className="author-name"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(
                        `/author/${story.author?._id}`
                      );
                    }}
                  >
                    {t("by")}{" "}
                    {story.author?.username ||
                      "Unknown"}
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