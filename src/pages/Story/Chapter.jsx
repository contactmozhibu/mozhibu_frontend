import { useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getReviews, saveReview } from '../../services/review.service';

function Chapter() {
  const location = useLocation();
  const navigate = useNavigate();
  const { chapter, story } = location.state || {};

  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [showEditor, setShowEditor] = useState(false);

  // ✅ Get story ID for reviews
  const storyId = story?._id || chapter?.story;

  // 📥 Load reviews
  const refreshReviews = async () => {
    if (!storyId) return;
    try {
      const data = await getReviews(storyId);
      setReviews(data);
    } catch (err) {
      console.error("Failed to load reviews:", err);
    }
  };

  useEffect(() => {
    refreshReviews();
  }, [storyId]);

  // 💬 Save review
  const handleSaveReview = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      setSaving(true);
      await saveReview(storyId, rating, comment);
      setRating(0);
      setComment("");
      setShowEditor(false);
      refreshReviews();
      alert("Review saved successfully!");
    } catch (err) {
      console.error("Failed to save review:", err);
      alert("Failed to save review");
    } finally {
      setSaving(false);
    }
  };

  if (!chapter || !story) {
    return (
      <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <h2>Chapter not found</h2>
        <button onClick={() => navigate(-1)}>Go Back</button>
      </div>
    );
  }

  return (
    <div style={{ padding: '40px 20px', maxWidth: '900px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={() => navigate(`/story/${story._id}`)}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6c63ff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
            transition: 'background-color 0.3s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5a52d5')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6c63ff')}
        >
          ← Back to Story
        </button>
      </div>

      <article style={{ lineHeight: '1.8', fontSize: '16px', color: '#333' }}>
        <h1 style={{ fontSize: '32px', marginBottom: '10px', color: '#222' }}>{chapter.title}</h1>
        
        <div style={{ marginBottom: '30px', fontSize: '14px', color: '#666' }}>
          <span>Story: <strong>{story.title}</strong></span>
          <span style={{ marginLeft: '20px' }}>Published: {new Date(chapter.createdAt).toLocaleDateString()}</span>
        </div>

        <div style={{
          backgroundColor: '#f9f9f9',
          padding: '30px',
          borderRadius: '10px',
          lineHeight: '2',
          color: '#444',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {chapter.content}
        </div>

        {/* ⭐ RATE THIS STORY */}
        <div style={{ marginTop: '50px', marginBottom: '30px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: '#222' }}>
            Rate this story
          </h4>
          
          <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
            {[1, 2, 3, 4, 5].map((s) => (
              <span
                key={s}
                style={{
                  fontSize: '28px',
                  cursor: 'pointer',
                  color: '#FFD700',
                  opacity: s <= rating ? 1 : 0.3,
                  transition: 'opacity 0.2s',
                }}
                onClick={() => setRating(s)}
              >
                ★
              </span>
            ))}
          </div>
        </div>

        {/* ✍️ WRITE COMMENT */}
        {!showEditor ? (
          <button
            onClick={() => setShowEditor(true)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#1abc9c',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '600',
              marginBottom: '30px',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#16a085')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#1abc9c')}
          >
            Write a Comment
          </button>
        ) : (
          <div style={{
            backgroundColor: '#f5f5f5',
            padding: '20px',
            borderRadius: '8px',
            marginBottom: '30px',
          }}>
            <textarea
              placeholder="Write your comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '5px',
                border: '1px solid #ddd',
                fontSize: '14px',
                fontFamily: 'inherit',
                marginBottom: '12px',
                minHeight: '100px',
                resize: 'vertical',
              }}
            />

            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                onClick={handleSaveReview}
                disabled={saving || rating === 0}
                style={{
                  padding: '10px 20px',
                  backgroundColor: rating === 0 ? '#ccc' : '#1abc9c',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: rating === 0 ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                  transition: 'background-color 0.3s',
                }}
              >
                {saving ? 'Saving...' : 'Submit Review'}
              </button>

              <button
                onClick={() => {
                  setShowEditor(false);
                  setRating(0);
                  setComment('');
                }}
                style={{
                  padding: '10px 20px',
                  backgroundColor: '#f0f0f0',
                  color: '#333',
                  border: '1px solid #ddd',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* 💬 REVIEWS */}
        <div style={{ marginTop: '40px' }}>
          <h4 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px', color: '#222' }}>
            Reviews
          </h4>

          {reviews.length === 0 ? (
            <p style={{ color: '#666', fontStyle: 'italic' }}>No reviews yet</p>
          ) : (
            reviews.map((review) => (
              <div
                key={review._id}
                style={{
                  backgroundColor: '#f9f9f9',
                  padding: '15px',
                  borderRadius: '8px',
                  marginBottom: '15px',
                  borderLeft: '4px solid #1abc9c',
                }}
              >
                <div style={{ marginBottom: '8px' }}>
                  <span style={{ fontSize: '16px', color: '#FFD700' }}>
                    {'★'.repeat(review.rating)}
                  </span>
                </div>
                <p style={{ margin: '8px 0', color: '#333', lineHeight: '1.6' }}>
                  {review.comment}
                </p>
                <small style={{ color: '#999' }}>
                  {new Date(review.createdAt).toLocaleDateString()}
                </small>
              </div>
            ))
          )}
        </div>

        <div style={{ marginTop: '40px', textAlign: 'center' }}>
          <button
            onClick={() => navigate(`/story/${story._id}`)}
            style={{
              padding: '12px 24px',
              backgroundColor: '#6c63ff',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              fontSize: '16px',
              transition: 'background-color 0.3s',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#5a52d5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#6c63ff')}
          >
            Back to Story
          </button>
        </div>
      </article>
    </div>
  );
}

export default Chapter;