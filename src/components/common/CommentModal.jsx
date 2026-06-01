import "./modal.css";
import { useState } from "react";

export default function CommentModal({ open, onClose, onSubmit }) {
  const [comment, setComment] = useState("");

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <button className="close-btn" onClick={onClose}>×</button>

        <h3>Add a comment</h3>

        <textarea
          placeholder="Write your comment..."
          value={comment}
          onChange={e => setComment(e.target.value)}
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button
            className="primary"
            onClick={() => onSubmit(comment)}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
