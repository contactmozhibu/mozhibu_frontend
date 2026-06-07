

import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { translateText } from "../../services/translate.service";
import { convertTanglishToTamil, transliterateToTamil } from "../../utils/tanglishTransliterator";
import { API_BASE_URL } from "../../config/apiConfig";
import useTanglishInput from "../../hooks/useTanglishInput";
import "../../pages/Drafts/drafts.css";
import AgeFilter from "../../components/filters/AgeFilter";

export default function NewDraft() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const { t, i18n } = useTranslation();
  const { isTanglishMode, handleTanglishChange, convertFullText, toggleTanglishMode } = useTanglishInput();

  const [searchParams] = useSearchParams();
  const draftId = searchParams.get("id");

  const [step, setStep] = useState(1);
  const [autoTranslating, setAutoTranslating] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [lastEnglishTitle, setLastEnglishTitle] = useState("");
  const [lastEnglishDescription, setLastEnglishDescription] = useState("");
  const [lastEnglishContent, setLastEnglishContent] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    ageCategory: "",
    contentType: "",
    language: "English",
    coverImage: "",
  });
  const [content, setContent] = useState("");
  const [subcategories, setSubcategories] = useState([]);

  const categoryMap = {
    Fiction: [
      "Romance","Mystery & Crime","Thriller","Fantasy",
      "Science Fiction","Horror","Adventure","Historical Fiction",
      "Short Stories","Novels","Novellas","Flash Fiction",
      "Episodic / Series","Mythology","Folk Tales",
      "Magical Realism","Retellings","Graphic Novels / Comics",
      "Feel-Good","Dark","Inspirational","Emotional","Humorous"
    ],

    "Non Fiction":[
      "Biography","Autobiography","Memoir",
      "Self-Help","Personal Growth","Productivity",
      "Mindfulness","Mental Health",
      "History","Politics","Economics","Culture","Philosophy",
      "Religion","Spiritual Practices","Devotional","Ethics",
      "Health & Fitness","Food & Cooking","Parenting",
      "Travel","Money & Finance","Hobbies & DIY"
    ],

    Academic:[
      "Mathematics","Science","Social Studies","Languages",
      "Environmental Studies","Coding & Programming",
      "AI & Technology","Communication Skills",
      "Writing & Creativity","Design",
      "Business & Management","Engineering",
      "Medical","Law","Teaching","Government Exams",
      "Dictionaries","Encyclopedias","Guides","Manuals","Question Banks"
    ],

    Poetry:[
      "Love & Relationships","Nature & Environment",
      "Identity & Society","Philosophy & Reflection",
      "Artistic & Abstract","Festival & Occasion",
      "Children's poetry","General"
    ],

    Cookbooks:[
      "Baking","Desserts","Snacks","Biryani",
      "Curries","Breads","Soups","Street Food",
      "Pickles","Beverages","Meal Prep",
      "Low calorie","Weight loss","Keto","High protein"
    ],

    "Children Books":[
      "Early Childhood","Preschool","Early Readers",
      "Middle Grade","Pre Teens",
      "Board books","Rhyme books",
      "Simple stories","Adventure","Humour",
      "Fantasy","Mystery","Fairy tales","Animal stories"
    ],

    Others:[
      "Comics","Drama","Screenplay",
      "Essays","Anthologies","Journals",
      "Diaries","Confessions","Travelogues"
    ]
  };

  /* LOAD DRAFT */
  useEffect(() => {
    const loadDraft = async () => {
      if (!draftId) return;

      const res = await fetch(`${API_BASE_URL}/drafts/${draftId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      const draft = await res.json();

      setFormData({
        title: draft.title || "",
        description: draft.description || "",
        category: draft.category || "",
        ageCategory: draft.ageCategory || "",
        contentType: draft.contentType || "",
        language: draft.language || "English",
        coverImage: draft.coverImage || "",
      });

      setContent(draft.content || "");
      setSubcategories(draft.subcategories || []);
      
      // ✅ AUTO-ENABLE TANGLISH IF DRAFT WAS IN TAMIL
      if (draft.language === "Tamil" && !isTanglishMode) {
        toggleTanglishMode();
      }
    };

    loadDraft();
  }, [draftId, token]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => {
      const updated = { ...prev, [name]: value };
      
      // Apply Tanglish conversion if mode is enabled and language is Tamil
      if (isTanglishMode && updated.language === "Tamil") {
        const processedValue = handleTanglishChange(value);
        updated[name] = processedValue;
      }

      return updated;
    });
  };

  /* ======================
     HANDLE COVER IMAGE UPLOAD
  ====================== */
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Store the file object
      setFormData(prev => ({ ...prev, coverImage: file }));
    }
  };

  // Auto-translate content when Tamil is selected
  const handleContentChange = (e) => {
    let value = e.target.value;
    
    // Apply Tanglish conversion if mode is enabled and language is Tamil
    if (isTanglishMode && formData.language === "Tamil") {
      value = handleTanglishChange(value);
    }
    
    setContent(value);
  };

  // Helper function to translate fields
  const translateFieldAsync = async (text, fieldType) => {
    if (!text || isTranslating) return;
    
    setIsTranslating(true);
    try {
      const translated = await translateText(text, "Tamil");
      
      if (fieldType === "title") {
        setFormData(prev => ({ ...prev, title: translated }));
      } else if (fieldType === "description") {
        setFormData(prev => ({ ...prev, description: translated }));
      } else if (fieldType === "content") {
        setContent(translated);
      }
    } catch (error) {
      console.error("Translation error:", error);
    } finally {
      setIsTranslating(false);
    }
  };

  // Handle paste operations for Tanglish
  const handlePasteForTanglish = (e, field) => {
    if (!isTanglishMode || formData.language !== "Tamil") return;

    e.preventDefault();
    const pastedText = e.clipboardData.getData("text/plain");
    
    if (pastedText) {
      const convertedText = convertFullText(pastedText);
      
      if (field === "title") {
        setFormData(prev => ({ ...prev, title: convertedText }));
      } else if (field === "description") {
        setFormData(prev => ({ ...prev, description: convertedText }));
      } else if (field === "content") {
        setContent(convertedText);
      }
    }
  };

  // Auto-translate title, description, and content when language changes in the draft
  const handleLanguageChangeWithAutoTranslate = async (language) => {
    setFormData(prev => ({ ...prev, language }));
    
    // ✅ AUTO-ENABLE TANGLISH WHEN TAMIL IS SELECTED
    if (language === "Tamil" && !isTanglishMode) {
      toggleTanglishMode(); // Automatically enable tanglish for Tamil
    }
    // ✅ AUTO-DISABLE TANGLISH WHEN SWITCHING AWAY FROM TAMIL
    else if (language !== "Tamil" && isTanglishMode) {
      toggleTanglishMode(); // Disable tanglish when not using Tamil
    }
    
    if (language === "Tamil" && (formData.title || formData.description || content)) {
      setIsTranslating(true);
      try {
        if (formData.title && formData.title.trim()) {
          const translatedTitle = await translateText(formData.title, "Tamil");
          setFormData(prev => ({ ...prev, title: translatedTitle }));
        }
        
        if (formData.description && formData.description.trim()) {
          const translatedDesc = await translateText(formData.description, "Tamil");
          setFormData(prev => ({ ...prev, description: translatedDesc }));
        }
        
        if (content && content.trim()) {
          const translatedContent = await translateText(content, "Tamil");
          setContent(translatedContent);
        }
      } catch (error) {
        console.error("Auto-translation error:", error);
      } finally {
        setIsTranslating(false);
      }
    }
  };

  const toggleSubcategory = (sub) => {
    if (subcategories.includes(sub)) {
      setSubcategories(subcategories.filter(s => s !== sub));
    } else {
      if (subcategories.length >= 3) {
        alert(t("draft_alert_max_categories") || "Maximum 3 subcategories allowed");
        return;
      }
      setSubcategories([...subcategories, sub]);
    }
  };

  const validateBeforeSubmit = () => {
    if (!formData.ageCategory) {
      alert(t("draft_alert_select_age"));
      return false;
    }

    if (
      (formData.ageCategory.includes("18") ||
      formData.ageCategory.includes("Adults")) &&
      !formData.contentType
    ) {
      alert(t("draft_alert_select_type"));
      return false;
    }

    return true;
  };

  const saveDraft = async () => {
    if (!validateBeforeSubmit()) return;

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      ageCategory: formData.ageCategory.trim(),
      contentType: formData.contentType || "Non-Erotic",
      language: formData.language,
      content: content.trim(),
      subcategories
    };

    console.log("💾 Saving draft with payload:", payload);

    const res = await fetch(`${API_BASE_URL}/drafts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      try {
        const errorData = await res.json();
        const errorMsg = errorData.message || "Failed to save draft";
        console.error("❌ Server error:", errorData);
        alert(`Error: ${errorMsg}`);
      } catch (e) {
        alert(t("draft_alert_save_fail") || "Failed to save draft");
      }
      return;
    }

    alert(t("draft_alert_saved") || "Draft saved successfully!");
    navigate("/drafts");
  };

  const publishStory = async () => {
    if (!formData.title) {
      alert(t("draft_alert_title_content") || "Title required");
      return;
    }

    if (!formData.category) {
      alert("Please select a category before publishing");
      return;
    }

    if (!formData.ageCategory) {
      alert("Please select an age category before publishing");
      return;
    }

    // ✅ Validate contentType for adult ages
    if (
      (formData.ageCategory.includes("18") || 
       formData.ageCategory.includes("Adults") ||
       formData.ageCategory === "Young Adults (18-25)" ||
       formData.ageCategory === "Adults (26+)") &&
      !formData.contentType
    ) {
      alert("Please select content type (Erotic/Non-Erotic) for adult content");
      return;
    }

    const payload = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category.trim(),
      ageCategory: formData.ageCategory.trim(),
      contentType: formData.contentType || "Non-Erotic",
      language: formData.language,
      content: content.trim(),
      storyType: "multi",
      subcategories
    };

    console.log("📝 Publishing story with payload:", payload);

    const res = await fetch(`${API_BASE_URL}/stories`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      try {
        const errorData = await res.json();
        const errorMsg = errorData.message || "Failed to publish story";
        console.error("❌ Server error:", errorData);
        alert(`Error: ${errorMsg}`);
      } catch (e) {
        alert(t("draft_alert_publish_fail") || "Failed to publish story");
      }
      return;
    }

    const story = await res.json();
    alert(t("draft_alert_published") || "Story published!");
    navigate(`/add-chapter/${story._id}`);
  };

  /* STEP 1 */

  if (step === 1) {
    return (
      <div className="draft-container">

        <h2>{t("draft_create_title")}</h2>

        <input
          name="title"
          placeholder={t("draft_story_title")}
          value={formData.title}
          onChange={handleChange}
          onPaste={(e) => handlePasteForTanglish(e, "title")}
          lang={formData.language === "Tamil" ? "ta" : "en"}
        />

        <textarea
          name="description"
          placeholder={t("draft_description")}
          value={formData.description}
          onChange={handleChange}
          onPaste={(e) => handlePasteForTanglish(e, "description")}
          lang={formData.language === "Tamil" ? "ta" : "en"}
        />

        <h3>{t("draft_select_category") || "Select Category"}</h3>

        <div className="category-buttons">
          {Object.keys(categoryMap).map(cat => (
            <button
              key={cat}
              type="button"
              className={`cat-btn ${formData.category === cat ? "active" : ""}`}
              onClick={() => {
                setFormData({ ...formData, category: cat });
                setSubcategories([]);
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {formData.category && (
          <>
            <h3>{t("draft_select_sub_category") || "Select Subcategories (max 3)"}</h3>

            <div className="subcategory-buttons">
              {categoryMap[formData.category].map(sub => (
                <button
                  key={sub}
                  type="button"
                  className={`sub-btn ${subcategories.includes(sub) ? "active" : ""}`}
                  onClick={() => toggleSubcategory(sub)}
                >
                  {sub}
                </button>
              ))}
            </div>
          </>
        )}

        <AgeFilter
          value={formData.ageCategory}
          onChange={(val) => setFormData(prev => ({ ...prev, ageCategory: val }))}
          eroticValue={formData.contentType}
          onEroticChange={(val) => setFormData(prev => ({ ...prev, contentType: val }))}
        />

        <div>
          <label>{t("story_language") || "Language"}: </label>
          <select 
            name="language" 
            value={formData.language} 
            onChange={(e) => handleLanguageChangeWithAutoTranslate(e.target.value)}
            disabled={isTranslating}
          >
            <option value="English">{t("language_english") || "English"}</option>
            <option value="Tamil">{t("language_tamil") || "Tamil"}</option>
          </select>
          {isTranslating && <span style={{ marginLeft: "10px", color: "#ff3b5c" }}>{t("loading") || "Translating..."}</span>}
        </div>

        {/* ✅ Tanglish Mode - Automatically Enabled for Tamil (Silent Mode - No Message Shown) */}

        {/* COVER IMAGE UPLOAD */}
        <div className="cover-image-section">
          <div className="cover-image-label">
            <span>📸 {t("draft_cover") || "Cover Image"}</span>
            <span className="copyright-note">⚠️ Upload copyright free images only</span>
          </div>

          {/* FILE INPUT */}
          <label className="file-upload-label">
            <input
              type="file"
              accept="image/*"
              onChange={handleCoverImageChange}
              style={{ display: "none" }}
            />
            <span className="upload-btn">📁 Choose Image</span>
          </label>

          {/* PREVIEW */}
          {formData.coverImage && (
            <div className="image-preview">
              <img
                src={typeof formData.coverImage === "string" 
                  ? formData.coverImage 
                  : URL.createObjectURL(formData.coverImage)}
                alt="Cover preview"
              />
              <button 
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, coverImage: "" }))}
                className="remove-image-btn"
              >
                ✕ Remove
              </button>
            </div>
          )}
        </div>

        <div className="next-btn-wrapper">
          <button className="next-btn" onClick={() => setStep(2)} disabled={isTranslating}>
            {t("draft_next")}
          </button>
        </div>

      </div>
    );
  }

  /* STEP 2 */

  return (
    <>
      <div className="top-bar">
        <button className="back-btn" onClick={() => setStep(1)} disabled={isTranslating}>
          ← {t("back")}
        </button>
      </div>

      <div className="draft-container">

        <div style={{ 
  display: "flex", 
  justifyContent: "space-between", 
  alignItems: "center" 
}}>
  <h2>{t("draft_write_story")}</h2>
</div>

        {/* ✅ Tanglish Mode - Automatically Enabled for Tamil (Silent Mode - No Message Shown) */}

        <textarea
          className="story-editor"
          placeholder={t("draft_write_placeholder")}
          value={content}
          onChange={handleContentChange}
          onPaste={(e) => handlePasteForTanglish(e, "content")}
          lang={formData.language === "Tamil" ? "ta" : "en"}
        />

        <div className="bottom-actions">

          <button className="save-btn" onClick={saveDraft} disabled={isTranslating}>
            {t("save")}
          </button>

          <button
            className="preview-btn"
            onClick={() =>
              navigate("/story/preview", {
                state: { preview: true, story: { ...formData, content, subcategories } }
              })
            }
            disabled={isTranslating}
          >
            {t("preview")}
          </button>

          <button className="publish-btn" onClick={publishStory} disabled={isTranslating}>
            {t("publish")}
          </button>

        </div>

      </div>
    </>
  );
}