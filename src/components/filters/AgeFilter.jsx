
/*
import { useState } from "react";
import "./ageFilter.css";

const AGE_GROUPS = [
  { label: "Kids (0–6)", value: "Kids (0-6)" },
  { label: "Children (7–9)", value: "Children (7-9)" },
  { label: "Pre-Teens (10–12)", value: "Pre-Teens (10-12)" },
  { label: "Teens (13–17)", value: "Teens (13-17)" },
  { label: "Young Adults (18–25)", value: "Young Adults (18-25)" },
  { label: "Adults (26+)", value: "Adults (26+)" },
];


export default function AgeFilter({
  value,
  onChange,
  eroticValue,
  onEroticChange,
}) {
  const isAdult =
  value === "Young Adults (18-25)" || value === "Adults (26+)";


  return (
    <div className="age-filter">
      <p className="label">Select age group:</p>

      <div className="age-buttons">
        {AGE_GROUPS.map((group) => (
          <button
            key={group.value}
            type="button"
            className={`age-btn ${value === group.value ? "active" : ""}`}
            onClick={() => {
              onChange(group.value);
              if (
  group.value !== "Young Adults (18-25)" &&
  group.value !== "Adults (26+)"
) {
  onEroticChange("");
}

            }}
          >
            {group.label}
          </button>
        ))}
      </div>

      {isAdult && (
        <div className="content-type">
          <p>Please select content type (required):</p>

          <div className="type-buttons">
            <button
              type="button"
              className={`type-btn ${
                eroticValue === "Erotic" ? "active" : ""
              }`}
              onClick={() => onEroticChange("Erotic")}
            >
              Erotic
            </button>

            <button
              type="button"
              className={`type-btn ${
                eroticValue === "Non-Erotic" ? "active" : ""
              }`}
              onClick={() => onEroticChange("Non-Erotic")}
            >
              Non-Erotic
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
*/

import "./AgeFilter.css";

const AGE_GROUPS = [
  "Kids (0-6)",
  "Children (7-9)",
  "Pre-Teens (10-12)",
  "Teens (13-17)",
  "Young Adults (18-25)",
  "Adults (26+)",
];

const ADULT_GROUPS = ["Young Adults (18-25)", "Adults (26+)"];

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
