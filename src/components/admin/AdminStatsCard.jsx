import "./AdminStatsCard.css";

const AdminStatsCard = ({ title, value, icon, color = "primary", trend }) => {
  return (
    <div className={`stats-card stats-${color}`}>
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value">{value}</p>
        {trend && <span className="stats-trend">{trend}</span>}
      </div>
    </div>
  );
};

export default AdminStatsCard;
