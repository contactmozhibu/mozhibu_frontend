export default function LanguageFilter({ value, onChange }) {
  return (
    <select value={value} onChange={(e) => onChange(e.target.value)}>
      <option value="">All Languages</option>
      <option value="English">English</option>
      <option value="Tamil">Tamil</option>
    </select>
  );
}
