import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./drafts.css";

export default function DraftList() {
  const [drafts, setDrafts] = useState([]);
  const [published, setPublished] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // ✅ Load drafts
      const dRes = await fetch("http://localhost:5000/api/drafts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const draftsData = await dRes.json();
      setDrafts(draftsData);

      // ✅ Load published stories
      const sRes = await fetch("http://localhost:5000/api/stories/mine", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const storiesData = await sRes.json();
      setPublished(storiesData);
    } catch (err) {
      toast.error("Failed to load drafts");
    }
  };

  /* ======================
     PUBLISH DRAFT
  ====================== */
  const publishDraft = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/drafts/${id}/publish`, {
  method: "PUT",
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});


      if (!res.ok) throw new Error();

      toast.success("Story published");
      loadData();
    } catch {
      toast.error("Publish failed");
    }
  };

  /* ======================
     DELETE DRAFT
  ====================== */
  const deleteDraft = async (id) => {
    if (!window.confirm("Delete this draft?")) return;

    try {
      await fetch(`http://localhost:5000/api/drafts/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("Draft deleted");
      loadData();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="draft-container">
      <h2>My Stories</h2>

      {/* ======================
          READY TO PUBLISH
      ====================== */}
      <section className="draft-section">
        <h3>Ready to Publish</h3>

        {drafts.length === 0 ? (
          <p>No drafts</p>
        ) : (
          drafts.map((draft) => (
            <div className="draft-card" key={draft._id}>
              <h4>{draft.title || "Untitled Story"}</h4>
              <p>{draft.description}</p>

              <div className="draft-actions">
                <button
  onClick={() => {
    if (
      (draft.ageCategory?.includes("18") ||
        draft.ageCategory?.includes("Adults")) &&
      !draft.contentType
    ) {
      toast.error("Select Erotic / Non-Erotic before publishing");
      return;
    }
    publishDraft(draft._id);
  }}
>
  Publish
</button>


                <button
                  onClick={() =>
                    navigate(`/draft/new?id=${draft._id}`)
                  }
                >
                  Edit
                </button>

                <button onClick={() => deleteDraft(draft._id)}>
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </section>

      {/* ======================
          PUBLISHED STORIES
      ====================== */}
      <section className="draft-section">
        <h3>Published</h3>

        {published.length === 0 ? (
          <p>No published stories</p>
        ) : (
          published.map((story) => (
            <div className="draft-card published" key={story._id}>
              <h4>{story.title}</h4>
              <p>{story.description}</p>
            </div>
          ))
        )}
      </section>
    </div>
  );
}

