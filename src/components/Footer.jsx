import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./Footer.css";

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="footer">
      {/* TOP FOOTER */}
      <div className="footer-top">
        {/* HELP CENTRE */}
        <div>
          <h4>{t("help_centre") || "Help Centre"}</h4>
          <ul>
            <li>{t("writing") || "Writing"}</li>
            <li>{t("reading") || "Reading"}</li>
            <li>{t("copyright") || "Copyright"}</li>
            <li>{t("general") || "General"}</li>
          </ul>
        </div>

        {/* CONTACT US */}
        <div className="footer-contact">
  <h4 className="footer-title">{t("contact_us") || "Contact Us"}</h4>
  

  <a
    href="mailto:admin@mozhibu.com"
    className="footer-mail"
  >
    <span className="mail-icon">✉️</span>
    admin@mozhibu.com
  </a>
</div>


        {/* SOCIAL MEDIA */}
        <div>
          <h4>{t("follow_social") || "Follow us on Social Media"}</h4>
          <div className="social-icons">
            <span>🌐</span>
            <span>📘</span>
            <span>📸</span>
            <span>▶️</span>
          </div>
        </div>
      </div>

      {/* BOTTOM FOOTER */}
      <div className="footer-bottom">
        © 2026 Wise King Enterprises |
        <Link to="/about-us"> {t("about_us") || "About Us"}</Link> |
        <Link to="/join-with-us"> Join With Us</Link> |
        <Link to="/terms"> Terms & Conditions</Link> |
        <Link to="/privacy"> Privacy Policy</Link>
      </div>
    </footer>
  );
}
