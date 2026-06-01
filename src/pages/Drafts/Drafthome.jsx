/*import { Link } from "react-router-dom";
import "./drafts.css";

export default function Drafthome() {
  return (
    <div className="draft-container">
      <h1>Drafts</h1>

      <div className="draft-actions">
        <Link to="/draft/new" className="draft-btn primary">
          ➕ Add New Draft
        </Link>

        <Link to="/draft/list" className="draft-btn secondary">
          📄 View Drafts
        </Link>

      </div>
    </div>
  );
}*/

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Drafthome.css";

export default function Drafthome() {
  const { t } = useTranslation();

  return (
    <div className="draft-page">
      <h1 className="draft-title">{t("draft_home_title") || "Your Draft Space"}</h1>
      <p className="draft-subtitle">
        {t("draft_home_subtitle") || "Create, manage, and preview your stories before publishing"}
      </p>

      <div className="draft-card-wrapper">
        <Link to="/draft/new" className="draft-card create">
          <span className="draft-icon">✍️</span>
          <h2>{t("draft_home_new") || "Start Writing"}</h2>
          <p>{t("draft_home_new_desc") || "Create a brand new story draft"}</p>
        </Link>

        <Link to="/draft/list" className="draft-card manage">
          <span className="draft-icon">📚</span>
          <h2>{t("draft_my_drafts") || "Your Drafts"}</h2>
          <p>{t("draft_manage_desc") || "Edit, Publish or delete saved drafts"}</p>
        </Link>
      </div>
    </div>
  );
}


