/* new code 8.1.26

import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import RatingModal from "../../components/common/RatingModal";
import { getReviews, saveReview } from "../../services/review.service";
import "./storyReader.css";

export default function StoryReader({ preview = false }) {
  const { state } = useLocation();
  const { id } = useParams();
  const story = state?.story;

  const [reviews, setReviews] = useState([]);
  const [showRatingModal, setShowRatingModal] = useState(false);

  const refreshReviews = async () => {
    if (preview || !id) return;
    const data = await getReviews(id);
    setReviews(data);
  };

  useEffect(() => {
    refreshReviews();
  }, [id, preview]);

  if (!story) return <p className="loading">Loading...</p>;

  return (
    <div className="reader-container">
      <article className="story-content">{story.content}</article>

      {/* ⭐ RATE 
      <div className="rating-section">
        <h4>Rate this story</h4>
        <div className={`stars ${preview ? "disabled" : ""}`}>
  {[1, 2, 3, 4, 5].map((s) => (
    <span
      key={s}
      className="star"
      style={{ cursor: preview ? "not-allowed" : "pointer" }}
      onClick={() => {
        if (!preview) setShowRatingModal(true);
      }}
    >
      ⭐
    </span>
  ))}
</div>


        {preview && <p className="preview-note">Preview mode — disabled</p>}
      </div>

      {/* 💬 REVIEWS 
      <div className="comment-section">
        <h4>Reviews</h4>

        {preview ? (
          <p className="preview-note">Preview mode — disabled</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map(r => (
            <div key={r._id} className="review">
              {"⭐".repeat(r.rating)}
              <p>{r.comment}</p>
            </div>
          ))
        )}
      </div>

      {!preview && (
        <RatingModal
          open={showRatingModal}
          onClose={() => setShowRatingModal(false)}
          onSubmit={async ({ rating, comment }) => {
            await saveReview(id, rating, comment);
            setShowRatingModal(false);
            refreshReviews();
          }}
        />
      )}
    </div>
  );
}
*/

/* saving with user name comment code new 
import { useLocation, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { getReviews, saveReview } from "../../services/review.service";
import "./storyReader.css";

export default function StoryReader({ preview = false }) {
  const { state } = useLocation();
  const { id } = useParams();
  const story = state?.story;

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);

  const refreshReviews = async () => {
    if (preview || !id) return;
    const data = await getReviews(id);
    setReviews(data);
  };

  useEffect(() => {
    refreshReviews();
  }, [id, preview]);

  const handleSaveReview = async () => {
    if (rating === 0) {
      alert("Please select rating");
      return;
    }

    try {
      setSaving(true);
      await saveReview(id, rating, comment);
      setRating(0);
      setComment("");
      refreshReviews();
    } catch {
      alert("Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  if (!story) return <p>Loading...</p>;

  return (
    <div className="reader-container">
      {/* 📖 STORY 
      <article className="story-content">{story.content}</article>

      {/* ⭐ RATE 
      <div className="rating-section">
        <h4>Rate this story</h4>

        <div className={`stars ${preview ? "disabled" : ""}`}>
          {[1, 2, 3, 4, 5].map((s) => (
            <span
              key={s}
              className={s <= rating ? "star active" : "star"}
              onClick={() => !preview && setRating(s)}
            >
              ★
            </span>
          ))}
        </div>

        {preview && (
          <p className="preview-note">Preview mode — rating disabled</p>
        )}
      </div>

      {/* ✍️ WRITE REVIEW 
      {!preview && (
        <div className="review-box">
          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button onClick={handleSaveReview} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}

      {/* 💬 REVIEWS 
      <div className="comment-section">
        <h4>Reviews</h4>

        {preview ? (
          <p className="preview-note">Preview mode — comments disabled</p>
        ) : reviews.length === 0 ? (
          <p>No reviews yet</p>
        ) : (
          reviews.map((r) => (
            <div key={r._id} className="review-card">
              <div className="avatar">A</div>

              <div className="review-body">
                <strong>Anonymous</strong>
                <div className="review-stars">
                  {"★".repeat(r.rating)}
                </div>
                <p>{r.comment}</p>
                <small>
                  {new Date(r.createdAt).toLocaleDateString()}
                </small>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
  */

import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getReviews, saveReview } from "../../services/review.service";
import "./storyReader.css";

export default function StoryReader({ preview = false }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const isPreview = preview || state?.preview;
  const story = state?.story;
  
    // 🔐 STEP 3: Extra safety guard
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Not logged in → go to login
    if (!token) {
      navigate("/login");
      return;
    }

    // Logged in but no story (URL refresh / direct access)
    if (!state?.story) {
      navigate(-1);
    }
  }, [navigate, state]);


  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  const refreshReviews = async () => {
    if (preview || !id) return;
    const data = await getReviews(id);
    setReviews(data);
  };

  useEffect(() => {
    refreshReviews();
  }, [id, preview]);

  if (!story) return <p>Loading...</p>;

  const handleSave = async () => {
    if (!rating) return alert("Select rating");

    try {
      setSaving(true);
      await saveReview(id, rating, comment);
      setRating(0);
      setComment("");
      setShowEditor(false);
      refreshReviews();
    } catch {
      alert("Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  
  
  return (
    
    <div className="reader-container">

    {isPreview && (
      /*
      <button
        className="preview-back-btn"
        onClick={() =>
          navigate("/draft", {
            state: {
              step: 2,
              story: story,
            },
          })
        }
      >
        ← Back to Write Story
      </button>
      */
     <button
  className="preview-back-btn"
  onClick={() =>
    navigate("/draft/new", {
      state: {
        fromPreview: true,
        story: story,
      },
    })
  }
>
  ← Back to Write Story
</button>

    )}

      <article className="story-content">{story.content}</article>

      {/* ⭐ RATE */}
      <h4>Rate this story</h4>

      <div className={`stars ${preview ? "disabled" : ""}`}>
  {[1, 2, 3, 4, 5].map((s) => (
    <span
      key={s}
      className={`star ${rating >= s ? "active" : ""}`}
      onClick={() => {
        if (!preview) {
          setRating(s);
          setShowEditor(true);
        }
      }}
    >
      ⭐
    </span>
  ))}
</div>


      {/* ✍️ INLINE REVIEW EDITOR */}
      {!preview && showEditor && (
        <div className="review-editor">
          <textarea
            placeholder="Write your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}

      {/* 💬 REVIEWS */}
      <h4>Reviews</h4>

      {preview ? (
        <p className="preview-note">Preview mode — reviews disabled</p>
      ) : reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map((r) => (
          
  <div key={r._id} className="review">
    <div className="avatar">
      {r.user?.username?.charAt(0).toUpperCase()}
    </div>
    <div>
      <strong>{r.user?.username || "User"}</strong>
      <div>{"⭐".repeat(r.rating)}</div>
      <p>{r.comment}</p>
      <small>{new Date(r.createdAt).toLocaleDateString()}</small>
    </div>
  </div>


        ))
      )}
    </div>
  );
}


