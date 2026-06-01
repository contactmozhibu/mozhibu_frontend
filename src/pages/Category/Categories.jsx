
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "./category.css";

export default function Categories() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([
    {
      title: t("categories_fiction") || "Fiction",
      key: "fiction",
      topics: [
        { key: "categories_romance", en: "Romance" },
        { key: "categories_mystery", en: "Mystery & Crime" },
        { key: "categories_thriller", en: "Thriller" },
        { key: "categories_fantasy", en: "Fantasy" },
        { key: "categories_scifi", en: "Science Fiction" },
        { key: "categories_horror", en: "Horror" },
        { key: "cat_adventure", en: "Adventure" },
        { key: "cat_historical", en: "Historical Fiction" },
        { key: "cat_short_stories", en: "Short Stories" },
        { key: "cat_novels", en: "Novels" },
        { key: "cat_novellas", en: "Novellas" },
        { key: "cat_flash_fiction", en: "Flash Fiction" },
        { key: "cat_episodic", en: "Episodic / Series" },
        { key: "cat_mythology", en: "Mythology" },
        { key: "cat_folktales", en: "Folk Tales" },
        { key: "cat_magical_realism", en: "Magical Realism" },
        { key: "cat_retellings", en: "Retellings" },
        { key: "cat_graphic_novels", en: "Graphic Novels / Comics" },
        { key: "cat_feel_good", en: "Feel-Good" },
        { key: "cat_dark", en: "Dark" },
        { key: "cat_inspirational", en: "Inspirational" },
        { key: "cat_emotional", en: "Emotional" },
        { key: "cat_humorous", en: "Humorous" },
      ],
    },
    {
      title: t("Non_fiction") || "Non-Fiction",
      key: "nonfiction",
      topics: [
        { key: "categories_biography", en: "Biography" },
        { key: "cat_autobiography", en: "Autobiography" },
        { key: "cat_memoir", en: "Memoir" },
        { key: "cat_self_help", en: "Self-Help" },
        { key: "cat_personal_growth", en: "Personal Growth" },
        { key: "cat_productivity", en: "Productivity" },
        { key: "cat_mindfulness", en: "Mindfulness" },
        { key: "cat_mental_health", en: "Mental Health" },
        { key: "cat_history", en: "History" },
        { key: "cat_politics", en: "Politics" },
        { key: "cat_economics", en: "Economics" },
        { key: "cat_culture", en: "Culture" },
        { key: "cat_philosophy", en: "Philosophy" },
        { key: "cat_religion", en: "Religion" },
        { key: "cat_spiritual", en: "Spiritual Practices" },
        { key: "cat_devotional", en: "Devotional" },
        { key: "cat_ethics", en: "Ethics" },
        { key: "cat_health_fitness", en: "Health & Fitness" },
        { key: "cat_food_cooking", en: "Food & Cooking" },
        { key: "cat_parenting", en: "Parenting" },
        { key: "cat_travel", en: "Travel" },
        { key: "cat_money_finance", en: "Money & Finance" },
        { key: "cat_hobbies_diy", en: "Hobbies & DIY" },
      ],
    },
    {
      title: t("categories_academic") || "Academic",
      key: "academic",
      topics: [
        { key: "cat_mathematics", en: "Mathematics" },
        { key: "cat_science", en: "Science" },
        { key: "cat_social_studies", en: "Social Studies" },
        { key: "cat_languages", en: "Languages" },
        { key: "cat_environmental", en: "Environmental Studies" },
        { key: "cat_coding", en: "Coding & Programming" },
        { key: "cat_ai_tech", en: "AI & Technology" },
        { key: "cat_communication", en: "Communication Skills" },
        { key: "cat_writing_creativity", en: "Writing & Creativity" },
        { key: "cat_design", en: "Design" },
        { key: "cat_business_mgmt", en: "Business & Management" },
        { key: "cat_engineering", en: "Engineering" },
        { key: "cat_medical", en: "Medical" },
        { key: "cat_law", en: "Law" },
        { key: "cat_teaching", en: "Teaching" },
        { key: "cat_govt_exams", en: "Government Exams" },
        { key: "cat_dictionaries", en: "Dictionaries" },
        { key: "cat_encyclopedias", en: "Encyclopedias" },
        { key: "cat_guides", en: "Guides" },
        { key: "cat_manuals", en: "Manuals" },
        { key: "cat_question_banks", en: "Question Banks" },
      ],
    },
    {
      title: t("categories_poetry") || "Poetry",
      key: "poetry",
      topics: [
        { key: "cat_love_poetry", en: "Love & Relationships" },
        { key: "cat_nature_poetry", en: "Nature & Environment" },
        { key: "cat_identity_poetry", en: "Identity & Society" },
        { key: "cat_philosophy_poetry", en: "Philosophy & Reflection" },
        { key: "cat_artistic_poetry", en: "Artistic & Abstract" },
        { key: "cat_festival_poetry", en: "Festival & Occasion" },
        { key: "cat_children_poetry", en: "Children's poetry" },
        { key: "cat_general_poetry", en: "General" },
      ],
    },
    {
      title: t("Cookbooks") || "Cookbooks",
      key: "Cookbooks",
      topics: [
        { key: "cat_baking", en: "Baking" },
        { key: "cat_desserts", en: "Desserts & Sweets" },
        { key: "cat_snacks", en: "Snacks & Starters" },
        { key: "cat_biryani", en: "Briyani, Pulao, Rice dishes" },
        { key: "cat_curries", en: "Curries & Gravies" },
        { key: "cat_breads", en: "Breads & Rotis" },
        { key: "cat_soups_salads", en: "Soups & Salads" },
        "Street Food",
        "Pickles & Preserves",
        "Beverages & Juices",
        "Tiffin / Meal prep",
        "One-pot recipes",
        "Low calorie recipes",
        "Weightloss recipes",
        "Keto",
        "Paleo",
        "High-protein",
        "Kid's recipes",
        "Beginner cooks",
        "Lunch box recipes",
      ],
    },
    {
      title: "Children Books",
      topics: [
        "Early Childhood (0-3 years)",
        "Preschool (3-5 years)",
        "Early Readers (5-7 years)",
        "Middle Grade (7-10 years)",
        "Pre-Teens (10-13 years)",
        "Board books",
        "Rhyme books",
        "Sensory books",
        "Concept books",
        "Simple stories",
        "Folktales",
        "Adventure",
        "School stories",
        "Humour books",
        "Fantasy",
        "Mystery",
        "Science fiction",
        "Fairy tales",
        "Animal stories",
        "Moral stories",
        "General knowledge",
        "Grammar",
      ],
    },
    {
      title: "Others",
      topics: [
        "Comics",
        "Drama",
        "Screenplay",
        "Essays",
        "Anthologies",
        "Journals",
        "Diaries",
        "Confessions",
        "Religious",
        "Spiritual",
        "Travelogues",
        "Experimental",
      ],
    },
  ]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  // Get translated topic display name
  const getTopicDisplay = (topic) => {
    if (typeof topic === "string") {
      return topic; // Fallback to English name
    }
    // Try to get translation, fallback to English name
    const translated = t(topic.key);
    return translated && translated !== topic.key ? translated : topic.en;
  };

  // Handle topic click - navigate to stories page
  const handleTopicClick = (categoryTitle, topic) => {
    const topicName = getTopicDisplay(topic);
    setSelectedCategory(categoryTitle);
    setSelectedTopic(topicName);
    console.log(`📌 Navigating to: ${categoryTitle} → ${topicName}`);
    navigate(`/stories?category=${encodeURIComponent(categoryTitle)}&topic=${encodeURIComponent(topicName)}`);
  };

  // Recreate categories with fresh translations whenever language changes
  useEffect(() => {
    setCategories([
      {
        title: t("categories_fiction") || "Fiction",
        key: "fiction",
        topics: [
          { key: "categories_romance", en: "Romance" },
          { key: "categories_mystery", en: "Mystery & Crime" },
          { key: "categories_thriller", en: "Thriller" },
          { key: "categories_fantasy", en: "Fantasy" },
          { key: "categories_scifi", en: "Science Fiction" },
          { key: "categories_horror", en: "Horror" },
          { key: "cat_adventure", en: "Adventure" },
          { key: "cat_historical", en: "Historical Fiction" },
          { key: "cat_short_stories", en: "Short Stories" },
          { key: "cat_novels", en: "Novels" },
          { key: "cat_novellas", en: "Novellas" },
          { key: "cat_flash_fiction", en: "Flash Fiction" },
          { key: "cat_episodic", en: "Episodic / Series" },
          { key: "cat_mythology", en: "Mythology" },
          { key: "cat_folktales", en: "Folk Tales" },
          { key: "cat_magical_realism", en: "Magical Realism" },
          { key: "cat_retellings", en: "Retellings" },
          { key: "cat_graphic_novels", en: "Graphic Novels / Comics" },
          { key: "cat_feel_good", en: "Feel-Good" },
          { key: "cat_dark", en: "Dark" },
          { key: "cat_inspirational", en: "Inspirational" },
          { key: "cat_emotional", en: "Emotional" },
          { key: "cat_humorous", en: "Humorous" },
        ],
      },
      {
        title: t("non_fiction") || "Non-Fiction",
        key: "nonfiction",
        topics: [
          { key: "categories_biography", en: "Biography" },
          { key: "cat_autobiography", en: "Autobiography" },
          { key: "cat_memoir", en: "Memoir" },
          { key: "cat_self_help", en: "Self-Help" },
          { key: "cat_personal_growth", en: "Personal Growth" },
          { key: "cat_productivity", en: "Productivity" },
          { key: "cat_mindfulness", en: "Mindfulness" },
          { key: "cat_mental_health", en: "Mental Health" },
          { key: "cat_history", en: "History" },
          { key: "cat_politics", en: "Politics" },
          { key: "cat_economics", en: "Economics" },
          { key: "cat_culture", en: "Culture" },
          { key: "cat_philosophy", en: "Philosophy" },
          { key: "cat_religion", en: "Religion" },
          { key: "cat_spiritual", en: "Spiritual Practices" },
          { key: "cat_devotional", en: "Devotional" },
          { key: "cat_ethics", en: "Ethics" },
          { key: "cat_health_fitness", en: "Health & Fitness" },
          { key: "cat_food_cooking", en: "Food & Cooking" },
          { key: "cat_parenting", en: "Parenting" },
          { key: "cat_travel", en: "Travel" },
          { key: "cat_money_finance", en: "Money & Finance" },
          { key: "cat_hobbies_diy", en: "Hobbies & DIY" },
        ],
      },
      {
        title: t("categories_academic") || "Academic",
        key: "academic",
        topics: [
          { key: "cat_mathematics", en: "Mathematics" },
          { key: "cat_science", en: "Science" },
          { key: "cat_social_studies", en: "Social Studies" },
          { key: "cat_languages", en: "Languages" },
          { key: "cat_environmental", en: "Environmental Studies" },
          { key: "cat_coding", en: "Coding & Programming" },
          { key: "cat_ai_tech", en: "AI & Technology" },
          { key: "cat_communication", en: "Communication Skills" },
          { key: "cat_writing_creativity", en: "Writing & Creativity" },
          { key: "cat_design", en: "Design" },
          { key: "cat_business_mgmt", en: "Business & Management" },
          { key: "cat_engineering", en: "Engineering" },
          { key: "cat_medical", en: "Medical" },
          { key: "cat_law", en: "Law" },
          { key: "cat_teaching", en: "Teaching" },
          { key: "cat_govt_exams", en: "Government Exams" },
          { key: "cat_dictionaries", en: "Dictionaries" },
          { key: "cat_encyclopedias", en: "Encyclopedias" },
          { key: "cat_guides", en: "Guides" },
          { key: "cat_manuals", en: "Manuals" },
          { key: "cat_question_banks", en: "Question Banks" },
        ],
      },
      {
        title: t("cat_poetry") || "Poetry",
        key: "poetry",
        topics: [
          { key: "cat_love_poetry", en: "Love & Relationships" },
          { key: "cat_nature_poetry", en: "Nature & Environment" },
          { key: "cat_identity_poetry", en: "Identity & Society" },
          { key: "cat_philosophy_poetry", en: "Philosophy & Reflection" },
          { key: "cat_artistic_poetry", en: "Artistic & Abstract" },
          { key: "cat_festival_poetry", en: "Festival & Occasion" },
          { key: "cat_children_poetry", en: "Children's poetry" },
          { key: "cat_general_poetry", en: "General" },
        ],
      },
      {
        title: t("cookbooks") || "Cookbooks",
        key: "cookbooks",
        topics: [
          { key: "cat_baking", en: "Baking" },
          { key: "cat_desserts", en: "Desserts & Sweets" },
          { key: "cat_snacks", en: "Snacks & Starters" },
          { key: "cat_biryani", en: "Briyani, Pulao, Rice dishes" },
          { key: "cat_curries", en: "Curries & Gravies" },
          { key: "cat_breads", en: "Breads & Rotis" },
          { key: "cat_soups_salads", en: "Soups & Salads" },
          { key: "cat_street_food", en: "Street Food" },
          { key: "cat_pickles", en: "Pickles & Preserves" },
          { key: "cat_beverages", en: "Beverages & Juices" },
          { key: "cat_meal_prep", en: "Tiffin / Meal prep" },
          { key: "cat_one_pot", en: "One-pot recipes" },
          { key: "cat_low_cal", en: "Low calorie recipes" },
          { key: "cat_weight_loss", en: "Weightloss recipes" },
          { key: "cat_keto", en: "Keto" },
          { key: "cat_paleo", en: "Paleo" },
          { key: "cat_high_protein", en: "High-protein" },
          { key: "cat_kids_recipes", en: "Kid's recipes" },
          { key: "cat_beginner", en: "Beginner cooks" },
          { key: "cat_lunchbox", en: "Lunch box recipes" },
        ],
      },
      {
        title: t("cat_children_books") || "Children Books",
        key: "children",
        topics: [
          { key: "cat_early_childhood", en: "Early Childhood (0-3 years)" },
          { key: "cat_preschool", en: "Preschool (3-5 years)" },
          { key: "cat_early_readers", en: "Early Readers (5-7 years)" },
          { key: "cat_middle_grade", en: "Middle Grade (7-10 years)" },
          { key: "cat_pre_teens", en: "Pre-Teens (10-13 years)" },
          { key: "cat_board_books", en: "Board books" },
          { key: "cat_rhyme_books", en: "Rhyme books" },
          { key: "cat_sensory_books", en: "Sensory books" },
          { key: "cat_concept_books", en: "Concept books" },
          { key: "cat_simple_stories", en: "Simple stories" },
          { key: "cat_folktales_kids", en: "Folktales" },
          { key: "cat_adventure_kids", en: "Adventure" },
          { key: "cat_school_stories", en: "School stories" },
          { key: "cat_humour_books", en: "Humour books" },
          { key: "cat_fantasy_kids", en: "Fantasy" },
          { key: "cat_mystery_kids", en: "Mystery" },
          { key: "cat_scifi_kids", en: "Science fiction" },
          { key: "cat_fairy_tales", en: "Fairy tales" },
          { key: "cat_animal_stories", en: "Animal stories" },
          { key: "cat_moral_stories", en: "Moral stories" },
          { key: "cat_general_knowledge", en: "General knowledge" },
          { key: "cat_grammar", en: "Grammar" },
        ],
      },
      {
        title: t("cat_others") || "Others",
        key: "others",
        topics: [
          { key: "cat_comics", en: "Comics" },
          { key: "cat_drama", en: "Drama" },
          { key: "cat_screenplay", en: "Screenplay" },
          { key: "cat_essays", en: "Essays" },
          { key: "cat_anthologies", en: "Anthologies" },
          { key: "cat_journals", en: "Journals" },
          { key: "cat_diaries", en: "Diaries" },
          { key: "cat_confessions", en: "Confessions" },
          { key: "cat_religious", en: "Religious" },
          { key: "cat_spiritual_others", en: "Spiritual" },
          { key: "cat_travelogues", en: "Travelogues" },
          { key: "cat_experimental", en: "Experimental" },
        ],
      },
    ]);
  }, [i18n.language, t]);

  if (categories.length === 0) {
    return <div className="categories-container"><p>{t("no_stories") || "No categories found"}</p></div>;
  }

  return (
    <div className="categories-container">
      {/* Categories Section */}
      <div className="categories-list">
        <h1 className="category-title">{t("categories_title") || "Categories"}</h1>
        <p className="categories-subtitle">{t("categories_subtitle") || "Browse and filter stories by genre and type."}</p>

        {categories.map((cat) => (
          <div key={cat.key} className="category-card">
            <h2>{cat.title}</h2>

            <div className="topic-list">
              {cat.topics.map((topic, idx) => (
                <button
                  key={idx}
                  className={`topic-chip ${
                      selectedTopic === getTopicDisplay(topic) &&
                      selectedCategory === cat.title
                        ? "active"
                        : ""
                    }`}
                  onClick={() => handleTopicClick(cat.title, topic)}
                >
                  {getTopicDisplay(topic)}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
