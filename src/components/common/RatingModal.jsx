/* correct before
import "./modal.css";
import { useState } from "react";

export default function RatingModal({ open, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>×</button>

        <h3>Rate this story</h3>

        <div className="stars">
          {[1,2,3,4,5].map(num => (
            <span
              key={num}
              className={num <= rating ? "star active" : "star"}
              onClick={() => setRating(num)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write a review (optional)"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            className="primary"
            onClick={() => onSubmit({ rating, comment })}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
*/
/* new code 8.1.26*
import "./modal.css";
import { useState } from "react";
import axios from "axios";

export default function RatingModal({ open, onClose, storyId, onSuccess }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    try {
      setLoading(true);

import { API_BASE_URL } from "../../config/apiConfig";

      await axios.post(`${API_BASE_URL}/reviews`, {
        storyId,
        rating,
        comment,
      });

      onSuccess(); // refresh reviews
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to submit review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>×</button>

        <h3>Rate this story</h3>

        <div className="stars">
          {[1, 2, 3, 4, 5].map(num => (
            <span
              key={num}
              className={num <= rating ? "star active" : "star"}
              onClick={() => setRating(num)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write a review"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            className="primary"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
*/

/*updated version 8.1.26 say to delete

import "./modal.css";
import { useState } from "react";

export default function RatingModal({ open, onClose, onSubmit }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  if (!open) return null;

  const handleSave = () => {
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    onSubmit({ rating, comment });
    setRating(0);
    setComment("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>×</button>

        <h3>Rate this story</h3>

        <div className="stars">
          {[1, 2, 3, 4, 5].map(num => (
            <span
              key={num}
              className={num <= rating ? "star active" : "star"}
              onClick={() => setRating(num)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Write a review"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button className="primary" onClick={handleSave}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
*/
