import { useState } from "react";

export default function ReplyThread({ replies = [], onReply }) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [replyTo, setReplyTo] = useState(null);

  return (
    <div style={{ marginLeft: "20px" }}>

      <button onClick={() => setOpen(!open)}>
        {open ? "Hide Replies" : `View Replies (${replies.length})`}
      </button>

      {open && (
        <div>
          {replies.map((r) => (
            <div key={r._id} style={{ marginTop: "10px" }}>
              <strong>{r.user?.username}</strong>
              <p>{r.comment}</p>

              {/* reply button */}
              <button onClick={() => setReplyTo(r._id)}>
                Reply
              </button>

              {/* reply input */}
              {replyTo === r._id && (
                <div>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />

                  <button
                    onClick={() => {
                      onReply(r._id, text);
                      setText("");
                      setReplyTo(null);
                    }}
                  >
                    Send
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}