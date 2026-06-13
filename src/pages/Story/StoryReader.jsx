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
import { getReviews, saveReview, likeReview, replyReview } from "../../services/review.service";
import { getStoryById } from "../../services/story.service";
import ReplyThread from "../../components/reviews/ReplyThread";
import "./storyReader.css";

/*export default function StoryReader({ preview = false }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { id } = useParams();
  const isPreview = preview || state?.preview;
  const story = state?.story;
  */
 export default function StoryReader({ preview = false }) {
  const navigate = useNavigate();
  const { state } = useLocation();
  const isPreview = preview || state?.preview;
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
const [openReplies, setOpenReplies] = useState({});
const params = useParams();
const storyId = state?.story?._id || params.id;
const [story, setStory] = useState(state?.story || null);
const reviewId = params.reviewId;
console.log("STATE:", state);
console.log("STORY ID:", storyId);
console.log("REVIEW ID:", reviewId);

//const storyId = params.id || state?.story?._id || state?.storyId;
//const highlightId = params.reviewId || state?.reviewId;
//const story = state?.story|| {};
//const { id } = useParams();
  //const story = state?.story;
//const { storyId, reviewId } = useParams();
//const storyId = params.id;
//const loggedInUserId = JSON.parse(localStorage.getItem("user"))?.id;
//const isAuthor = story?.author?._id === loggedInUserId;
    // 🔐 STEP 3: Extra safety guard
  useEffect(() => {
    const token = localStorage.getItem("token");

    // Not logged in → go to login
    if (!token) {
      navigate("/login");
      return;
    }

    // Logged in but no story (URL refresh / direct access)
    //if (!state?.story) {
     // navigate(-1);
    //}
  }, [navigate, state]);


  /*const [reviews, setReviews] = useState([]);
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
*/
const toggleReplies = (id) => {
  setOpenReplies((prev) => ({
    ...prev,
    [id]: !prev[id],
  }));
};

  /* ================= LOAD REVIEWS ================= */
  const refreshReviews = async () => {
    if (!storyId) {
    console.error("❌ storyId missing in refreshReviews");
    return;
  }
    const data = await getReviews(storyId);
    setReviews(data);
  };

  useEffect(() => {
     if (!storyId) return;
    refreshReviews();
  }, [storyId, preview]);

  /* ================= LIKE ================= */
  const handleLike = async (reviewId) => {
    await likeReview(reviewId);
    refreshReviews();
  };

  /*if (!story) return <p>Loading...</p>;

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

  
  */

  const handleReply = async (reviewId, text) => {
  if (!text.trim()) return;

  await replyReview(reviewId, text);

  setReplyText("");
  setReplyingTo(null);

  refreshReviews();
};

  /* ================= SAVE REVIEW ================= */
  const handleSave = async () => {
      if (!storyId) {
    console.error("❌ Missing storyId");
    return;
  }
    if (!rating) return alert("Select rating");

    try {
      setSaving(true);
console.log("story:", storyId);
console.log("rating:", rating);
console.log("comment:", comment);
      await saveReview(storyId, rating, comment);

      setRating(0);
      setComment("");
      setShowEditor(false);

      refreshReviews();
    } catch (err) {
      alert("Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  //if (!story) return <p>Loading...</p>;

  //if (!story && !state?.story) return <p>Loading...</p>;

  if (!story) {
  return <p>Loading story...</p>;
}

  const loggedInUserId = JSON.parse(localStorage.getItem("user"))?.id;

const isAuthor =
  story?.author?._id?.toString() === loggedInUserId?.toString();
/*
useEffect(() => {
  if (!reviewId) return;

  setTimeout(() => {
    const el = document.getElementById(
      `review-${reviewId}`
    );

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, 500);
}, [reviews, reviewId]);
*/

useEffect(() => {
  if (!reviewId) return;

  const timer = setTimeout(() => {
    const el = document.getElementById(`review-${reviewId}`);

    if (el) {
      el.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, 500);

  return () => clearTimeout(timer);
}, [reviews, reviewId]);


useEffect(() => {
  const loadStory = async () => {
    try {
      if (!story && storyId) {
        const data = await getStoryById(storyId);

        console.log("LOADED STORY:", data);

        setStory(data);
      }
    } catch (err) {
      console.error("Failed to load story", err);
    }
  };

  loadStory();
}, [storyId]);

  return (
    
    <div className="reader-container">

    {isPreview && (
     <button
  className="preview-back-btn"
  onClick={() => {
    // ✅ Pass complete story data back to draft for restoration
    navigate("/draft/new", {
      state: {
        fromPreview: true,
        story: {
          title: story.title || "",
          description: story.description || "",
          category: story.category || "",
          ageCategory: story.ageCategory || "",
          contentType: story.contentType || "",
          language: story.language || "English",
          coverImage: story.coverImage || "",
          content: story.content || "",
          subcategories: story.subcategories || []
        }
      },
    })
  }}
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

      {/* 💬 REVIEWS 
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
*/}
{/* 💬 REVIEWS */}
      <h4>Reviews</h4>

      {reviews.length === 0 ? (
        <p>No reviews yet</p>
      ) : (
        reviews.map((r) => (
          <div
  key={r._id}
  id={`review-${r._id}`}
  className={`review-card ${
    reviewId === r._id ? "highlight-review" : ""
  }`}
>

            {/* USER */}
            <div style={{ display: "flex", gap: "10px" }}>
              <div className="avatar">
                {r.user?.username?.charAt(0).toUpperCase()}
              </div>

              <div>

                <strong>{r.user?.username}</strong>
                <div>{"⭐".repeat(r.rating)}</div>
                <p>{r.comment}</p>

                {/* ACTIONS */}
                <div className="review-actions">
                  <button onClick={() => handleLike(r._id)}>
                    👍 {r.likes?.length || 0}
                  </button>

                  <button onClick={() => setReplyingTo(r._id)}>
                    Reply
                  </button>
                </div>

                {/* REPLY BOX */}
                {replyingTo === r._id && (
                  <div className="reply-box">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                    />

                    <button onClick={() => handleReply(r._id, replyText)}>
                      Send Reply
                    </button>
                  </div>
                )}

                {/* REPLIES THREAD */}
             {/* THREADED REPLIES */}
<ReplyThread replies={r.replies || []} 
onReply={handleReply}/>

              </div>
            </div>

          </div>

        ))
      )}
    </div>
  );
}


