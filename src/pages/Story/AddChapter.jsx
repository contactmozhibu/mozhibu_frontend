/* correct code
import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function AddChapter() {
  const { storyId } = useParams();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");

  const handleAdd = async () => {
    try {
      await axios.post(
        `/api/chapters/${storyId}`,   // ✅ correct URL
        {
          title,
          content
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      alert("Chapter added successfully!");

      // clear inputs
      setTitle("");
      setContent("");

    } catch (err) {
      console.error(err);
      alert("Failed to add chapter");
    }
  };

  return (
    <div>
      <div style={{
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center"
}}>
  <h2>Add Chapter</h2>

  <button
    style={{
      padding: "8px 14px",
      background: "#ff3b5c",
      color: "white",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer"
    }}
    onClick={() => navigate(`/add-chapter/${storyId}`)}
  >
    + Add Next Chapter
  </button>
</div>

      <input
        placeholder="Chapter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Chapter Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button onClick={handleAdd}>Add Chapter</button>
    </div>
  );
}
  */

/*
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddChapter() {
  const { storyId } = useParams();     // ✅ now correct
  const navigate = useNavigate();      // ✅ FIXED

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const token = localStorage.getItem("token");

  const handleAdd = async () => {
    try {
      await axios.post(
        `http://localhost:5000/api/chapters/${storyId}`,   // ✅ FULL URL
        { title, content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      alert("Chapter added successfully!");
      setTitle("");
      setContent("");
    } catch (err) {
      console.error(err);
      alert("Failed to add chapter");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h2>Add Chapter</h2>

        <button
          style={{
            padding: "8px 14px",
            background: "#ff3b5c",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer"
          }}
          onClick={() => navigate(`/add-chapter/${storyId}`)}
        >
          + Add Next Chapter
        </button>
      </div>

      <input
        placeholder="Chapter Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        style={{
          width: "100%",
          padding: "10px",
          marginTop: "15px",
          marginBottom: "10px"
        }}
      />

      <textarea
        placeholder="Chapter Content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        style={{
          width: "100%",
          height: "200px",
          padding: "10px"
        }}
      />

      <button
        onClick={handleAdd}
        style={{
          marginTop: "15px",
          padding: "10px 20px",
          background: "#222",
          color: "white",
          border: "none",
          borderRadius: "6px"
        }}
      >
        Add Chapter
      </button>
    </div>
  );
}
  */

import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import api from "../../services/api";

export default function AddChapter() {
  const { storyId } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [story, setStory] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lastChapterId, setLastChapterId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStory = async () => {
      try {
        const res = await api.get(`/stories/${storyId}`);
        setStory(res.data);
      } catch (err) {
        console.error("Error fetching story:", err);
      }
    };

    // ✅ Fetch existing chapters count
    const fetchChapters = async () => {
      try {
        const res = await api.get(`/chapters/${storyId}`);
        setLastChapterId(res.data.length); // reuse lastChapterId to store count
      } catch (err) {
        console.error("Error fetching chapters:", err);
      }
    };

    fetchStory();
    fetchChapters();
  }, [storyId]);

  const handleAddAndPublish = async () => {
    if (!title || !content) {
      alert(t("draft_alert_title_content") || "Title and Content are required");
      return;
    }

    try {
      setLoading(true);
      
      console.log("📝 Creating chapter for story:", storyId);
      console.log("Title:", title.substring(0, 30), "...");
      
      // ✅ Create chapter (Bearer token auto-included by api interceptor)
      const res = await api.post(
        `/chapters/${storyId}`,
        { title, content }
      );

      console.log("✅ Chapter created:", res.data._id);
      const newChapterId = res.data._id;

      console.log("📢 Publishing chapter:", newChapterId);
      // ✅ Auto-publish after adding (Bearer token auto-included)
      await api.put(
        `/chapters/publish/${newChapterId}`
      );

      console.log("✅ Chapter published successfully");
      alert(t("story_chapter_published") || "Chapter added and published successfully!");
      navigate(`/story/${storyId}`);
    } catch (err) {
      console.error("❌ ERROR creating/publishing chapter:", err);
      console.error("Error response:", err.response?.data);
      console.error("Error status:", err.response?.status);
      console.error("Error message:", err.response?.data?.message);
      
      const errorMessage = 
        err.response?.data?.message || 
        err.message || 
        t("error_something_wrong") || 
        "Failed to add chapter";
      
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      maxWidth: "800px", 
      margin: "40px auto", 
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
    }}>
      <button 
        onClick={() => navigate(-1)}
        style={{ 
          background: "none", 
          border: "none", 
          color: "#16a085", 
          cursor: "pointer",
          fontSize: "14px",
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          gap: "5px"
        }}
      >
        ← {t("reader_back_to_story") || "Back to story"}
      </button>

      <div style={{ marginBottom: "20px" }}>
        <h4 style={{ color: "#16a085", margin: "0", fontSize: "14px", textTransform: "uppercase" }}>
          {story?.title || t("loading") || "Story"}
        </h4>
        <h2 style={{ margin: "5px 0", fontSize: "28px", color: "#1f2937" }}>
  {t("story_add_chapter") || "Add Chapter"} {(lastChapterId || 0) + 1}
</h2>
      </div>

      <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "24px" }}>
        <div style={{ marginBottom: "20px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#374151" }}>
            {t("story_chapter_title") || "Chapter Title"} <span style={{ color: "red" }}>*</span>
          </label>
          <input
            placeholder={t("story_chapter_title") || "Chapter title..."}
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none"
            }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ display: "block", marginBottom: "8px", fontWeight: "600", fontSize: "14px", color: "#374151" }}>
            {t("draft_write_story") || "Chapter Content"} <span style={{ color: "red" }}>*</span>
          </label>
          <textarea
            placeholder={t("draft_write_placeholder") || "Write your chapter here..."}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: "100%",
              height: "400px",
              padding: "12px",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
              fontSize: "16px",
              outline: "none",
              resize: "vertical"
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={handleAddAndPublish}
            disabled={loading}
            style={{
              padding: "12px 24px",
              background: "#16a085",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "background 0.2s",
              opacity: loading ? 0.6 : 1
            }}
          >
            {loading ? t("loading") || "Publishing..." : t("story_chapter_published") || "Publish Chapter"}
          </button>
          
          <button
            onClick={() => navigate(`/story/${storyId}`)}
            style={{
              padding: "12px 24px",
              background: "#f3f4f6",
              color: "#4b5563",
              border: "none",
              borderRadius: "8px",
              fontWeight: "600",
              cursor: "pointer"
            }}
          >
            {t("cancel") || "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}