import "./AgeFilter.css";

const AGE_GROUPS = [
 "Kids (0-12)",
  "Teens (13-17)",
  "Adults (18+)",
];

const ADULT_GROUPS = ["Adults (18+)"];

export default function AgeFilter({ value, onChange, eroticValue, onEroticChange }) {
  const isAdult = ADULT_GROUPS.includes(value);

  return (
    <div className="age-filter">
      <p className="label">Select age group:</p>

      <div className="button-group">
        {AGE_GROUPS.map((age) => (
          <button
            key={age}
            type="button"
            className={`pill-btn ${value === age ? "active" : ""}`}
            onClick={() => {
              onChange(age);
              if (!ADULT_GROUPS.includes(age)) {
                onEroticChange(""); // reset content type for non-adults
              }
            }}
          >
            {age}
          </button>
        ))}
      </div>

      {isAdult && (
        <div className="content-type">
          <p>Please select content type (required):</p>
          <div className="button-group">
            {["Non-Erotic", "Erotic"].map((type) => (
              <button
                key={type}
                type="button"
                className={`pill-btn ${eroticValue === type ? "active" : ""}`}
                onClick={() => onEroticChange(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}