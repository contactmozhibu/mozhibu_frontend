import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  AreaChart, Area,
  XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from "recharts";
import api from "../../services/api";

// ── Shared colours matching sidebar purple theme ────────────
const PURPLE = "#6C63FF";
const PINK   = "#FF6584";
const TEAL   = "#43C6AC";
const AMBER  = "#FFB347";

// ── Reusable card ───────────────────────────────────────────
function Card({ title, children, span = 1 }) {
  return (
    <div style={{
      background: "#fff",
      borderRadius: 16,
      padding: "24px 28px",
      boxShadow: "0 2px 12px rgba(108,99,255,0.08)",
      gridColumn: `span ${span}`,
    }}>
      {title && (
        <h3 style={{
          margin: "0 0 20px",
          fontSize: 15,
          fontWeight: 700,
          color: "#1e1b4b",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}>{title}</h3>
      )}
      {children}
    </div>
  );
}

// ── Stat pill ───────────────────────────────────────────────
function StatPill({ label, value, color }) {
  return (
    <div style={{
      background: color + "15",
      borderRadius: 10,
      padding: "10px 16px",
      display: "flex",
      flexDirection: "column",
      gap: 2,
    }}>
      <span style={{ fontSize: 22, fontWeight: 800, color }}>{value}</span>
      <span style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>{label}</span>
    </div>
  );
}

// ── Custom tooltip ──────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#1e1b4b",
      borderRadius: 10,
      padding: "10px 16px",
      color: "#fff",
      fontSize: 13,
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
    }}>
      <p style={{ margin: "0 0 6px", fontWeight: 700, color: "#a5b4fc" }}>{label}</p>
      {payload.map((p, i) => (
        <p key={i} style={{ margin: "2px 0", color: p.color }}>
          {p.name}: <b>{p.value}</b>
        </p>
      ))}
    </div>
  );
};

// ── Loading Spinner ─────────────────────────────────────────
function LoadingSpinner() {
  return (
    <div style={{ textAlign: "center", padding: "40px", color: "#94a3b8" }}>
      <p>📊 Loading analytics data from database...</p>
    </div>
  );
}

// ── Main Component ──────────────────────────────────────────
export default function AdminAnalytics() {
  const [period, setPeriod] = useState("monthly");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Data states
  const [userGrowthData, setUserGrowthData] = useState([]);
  const [storyGrowthData, setStoryGrowthData] = useState([]);
  const [languageData, setLanguageData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [readingData, setReadingData] = useState([]);
  const [topAuthors, setTopAuthors] = useState([]);
  const [ageGroupData, setAgeGroupData] = useState([]);
  const [dailyActivityData, setDailyActivityData] = useState([]);
  const [topStoriesData, setTopStoriesData] = useState([]);
  const [ratingsData, setRatingsData] = useState([]);
  const [summary, setSummary] = useState({
    totalUsers: 0,
    totalStories: 0,
    totalChapters: 0,
    totalReads: 0,
    activeToday: 0,
    avgRating: 0
  });

  const tabs = ["daily", "weekly", "monthly", "yearly"];

  // ── Fetch all analytics data on component mount ────────────
  useEffect(() => {
    fetchAllAnalytics();
  }, [period]);

  const fetchAllAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch all data in parallel
      const [
        summaryRes,
        userGrowthRes,
        storyGrowthRes,
        languageRes,
        categoryRes,
        readingRes,
        authorsRes,
        ageRes,
        dailyRes,
        topStoriesRes,
        ratingsRes
      ] = await Promise.all([
        api.get("/admin/analytics/summary").catch(() => ({ data: {} })),
        api.get("/admin/analytics/user-growth").catch(() => ({ data: [] })),
        api.get("/admin/analytics/story-growth").catch(() => ({ data: [] })),
        api.get("/admin/analytics/language-distribution").catch(() => ({ data: [] })),
        api.get("/admin/analytics/category-performance").catch(() => ({ data: [] })),
        api.get("/admin/analytics/reading-activity").catch(() => ({ data: [] })),
        api.get("/admin/analytics/top-authors").catch(() => ({ data: [] })),
        api.get("/admin/analytics/age-distribution").catch(() => ({ data: [] })),
        api.get("/admin/analytics/daily-activity").catch(() => ({ data: [] })),
        api.get("/admin/analytics/top-stories").catch(() => ({ data: [] })),
        api.get("/admin/analytics/ratings-distribution").catch(() => ({ data: [] }))
      ]);

      // Set all states
      setSummary(summaryRes.data || {});
      setUserGrowthData(userGrowthRes.data || []);
      setStoryGrowthData(storyGrowthRes.data || []);
      setLanguageData(languageRes.data || []);
      setCategoryData(categoryRes.data || []);
      setReadingData(readingRes.data || []);
      setTopAuthors(authorsRes.data || []);
      setAgeGroupData(ageRes.data || []);
      setDailyActivityData(dailyRes.data || []);
      setTopStoriesData(topStoriesRes.data || []);
      setRatingsData(ratingsRes.data || []);
    } catch (err) {
      console.error("Error fetching analytics:", err);
      setError(err.message || "Failed to load analytics data");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div style={{
      padding: "32px 36px",
      background: "#f5f4ff",
      minHeight: "100vh",
      fontFamily: "'Segoe UI', sans-serif",
    }}>

      {/* Error Message */}
      {error && (
        <div style={{
          background: "#fee2e2",
          border: "1px solid #fecaca",
          borderRadius: 8,
          padding: 12,
          marginBottom: 20,
          color: "#991b1b",
          fontSize: 13
        }}>
          ⚠️ {error}
        </div>
      )}

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <h1 style={{ margin: 0, fontSize: 28, fontWeight: 800, color: "#1e1b4b" }}>
            📊 Analytics Dashboard
          </h1>
          <p style={{ margin: "6px 0 0", color: "#64748b", fontSize: 14 }}>
            Real-time Platform Analytics from Database
          </p>
        </div>

        {/* Period toggle */}
        <div style={{
          display: "flex",
          background: "#fff",
          borderRadius: 12,
          padding: 4,
          gap: 4,
          boxShadow: "0 2px 8px rgba(108,99,255,0.1)",
        }}>
          {tabs.map(t => (
            <button key={t} onClick={() => setPeriod(t)} style={{
              padding: "8px 18px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontWeight: 600,
              background: period === t ? PURPLE : "transparent",
              color: period === t ? "#fff" : "#64748b",
              transition: "all 0.2s",
              textTransform: "capitalize",
            }}>{t}</button>
          ))}
        </div>
      </div>

      {/* Summary pills */}
      <div style={{ display: "flex", gap: 16, marginBottom: 28, flexWrap: "wrap" }}>
        <StatPill label="Total Users"    value={summary.totalUsers}     color={PURPLE} />
        <StatPill label="Total Stories"  value={summary.totalStories}   color={PINK}   />
        <StatPill label="Total Chapters" value={summary.totalChapters}  color={TEAL}   />
        <StatPill label="Total Reads"    value={(summary.totalReads / 1000).toFixed(1) + "k"} color={AMBER}  />
        <StatPill label="Avg Rating"     value={summary.avgRating + "★"}  color="#22c55e"/>
        <StatPill label="Active Today"   value={summary.activeToday}    color="#ec4899"/>
      </div>

      {/* Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: 20,
      }}>

        {/* 1. User Growth */}
        <Card title="👥 User Growth" span={2}>
          {userGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <AreaChart data={userGrowthData}>
                <defs>
                  <linearGradient id="ugGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={PURPLE} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={PURPLE} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }}/>
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }}/>
                <Tooltip content={<CustomTooltip />}/>
                <Area type="monotone" dataKey="users" stroke={PURPLE} strokeWidth={2.5}
                  fill="url(#ugGrad)" name="Users" dot={{ fill: PURPLE, r: 3 }}/>
              </AreaChart>
            </ResponsiveContainer>
          ) : <p style={{ color: "#94a3b8" }}>No data available</p>}
        </Card>

        {/* 2. Language Usage */}
        <Card title="🌐 Language Distribution">
          {languageData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={languageData} cx="50%" cy="50%" innerRadius={55}
                  outerRadius={85} paddingAngle={3} dataKey="value">
                  {languageData.map((entry, i) => (
                    <Cell key={i} fill={entry.color}/>
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`}/>
                <Legend iconType="circle" iconSize={10}
                  formatter={(v) => <span style={{ fontSize: 12, color: "#475569" }}>{v}</span>}/>
              </PieChart>
            </ResponsiveContainer>
          ) : <p style={{ color: "#94a3b8" }}>No data available</p>}
        </Card>

        {/* 3. Story Growth */}
        <Card title="📚 Story Growth">
          {storyGrowthData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={storyGrowthData} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#94a3b8" }}/>
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }}/>
                <Tooltip content={<CustomTooltip />}/>
                <Bar dataKey="stories" fill={PINK} name="Stories" radius={[6,6,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: "#94a3b8" }}>No data available</p>}
        </Card>

        {/* 4. Category Performance */}
        <Card title="🏷️ Category Performance" span={2}>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={categoryData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                <XAxis dataKey="category" tick={{ fontSize: 12, fill: "#94a3b8" }}/>
                <YAxis yAxisId="left" tick={{ fontSize: 12, fill: "#94a3b8" }}/>
                <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12, fill: "#94a3b8" }}/>
                <Tooltip content={<CustomTooltip />}/>
                <Legend/>
                <Bar yAxisId="left"  dataKey="stories" fill={PURPLE} name="Stories" radius={[4,4,0,0]}/>
                <Bar yAxisId="right" dataKey="reads"   fill={TEAL}   name="Reads"   radius={[4,4,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: "#94a3b8" }}>No data available</p>}
        </Card>

        {/* 5. Weekly Reading Activity */}
        <Card title="📖 Weekly Reading Activity" span={2}>
          {readingData.length > 0 ? (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={readingData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }}/>
                <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }}/>
                <Tooltip content={<CustomTooltip />}/>
                <Legend/>
                <Line type="monotone" dataKey="reads"    stroke={PURPLE} strokeWidth={2.5}
                  dot={{ r: 4 }} name="Total Reads"/>
                <Line type="monotone" dataKey="chapters" stroke={TEAL}   strokeWidth={2.5}
                  dot={{ r: 4 }} name="Chapter Views" strokeDasharray="5 3"/>
              </LineChart>
            </ResponsiveContainer>
          ) : <p style={{ color: "#94a3b8" }}>No data available</p>}
        </Card>

        {/* 6. Age Group Distribution */}
        <Card title="🎂 Age Group Distribution" span={2}>
          {ageGroupData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={ageGroupData} layout="vertical" barSize={16}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                <XAxis type="number" tick={{ fontSize: 12, fill: "#94a3b8" }}/>
                <YAxis dataKey="group" type="category" width={100} tick={{ fontSize: 12, fill: "#94a3b8" }}/>
                <Tooltip content={<CustomTooltip />}/>
                <Legend/>
                <Bar dataKey="stories" fill={AMBER}  name="Stories" radius={[0,6,6,0]}/>
                <Bar dataKey="readers" fill={PINK}   name="Readers" radius={[0,6,6,0]}/>
              </BarChart>
            </ResponsiveContainer>
          ) : <p style={{ color: "#94a3b8" }}>No data available</p>}
        </Card>

        {/* 8. Ratings Distribution */}
        <Card title="⭐ Ratings Breakdown">
          {ratingsData.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 10, paddingTop: 8 }}>
              {ratingsData.map((r) => {
                const totalCount = ratingsData.reduce((sum, item) => sum + item.count, 0);
                const pct = Math.round((r.count / totalCount) * 100) || 0;
                return (
                  <div key={r.stars} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#475569", width: 28 }}>{r.stars}</span>
                    <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 8, height: 10, overflow: "hidden" }}>
                      <div style={{
                        width: `${pct}%`, height: "100%",
                        background: r.color, borderRadius: 8,
                        transition: "width 0.8s ease",
                      }}/>
                    </div>
                    <span style={{ fontSize: 12, color: "#94a3b8", width: 24, textAlign: "right" }}>{r.count}</span>
                  </div>
                );
              })}
            </div>
          ) : <p style={{ color: "#94a3b8" }}>No data available</p>}
        </Card>

        {/* 9. Daily Activity Timeline */}
        <Card title="⏱️ Daily Activity Timeline" span={2}>
          {dailyActivityData.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dailyActivityData}>
                <defs>
                  <linearGradient id="daGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor={TEAL} stopOpacity={0.3}/>
                    <stop offset="95%" stopColor={TEAL} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0"/>
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "#94a3b8" }}/>
                <YAxis tick={{ fontSize: 11, fill: "#94a3b8" }}/>
                <Tooltip content={<CustomTooltip />}/>
                <Legend/>
                <Area type="monotone" dataKey="users"    stroke={TEAL}   fill="url(#daGrad)"
                  name="Active Users" strokeWidth={2}/>
                <Line type="monotone" dataKey="chapters" stroke={PURPLE} strokeWidth={2}
                  dot={false} name="Chapters"/>
              </AreaChart>
            </ResponsiveContainer>
          ) : <p style={{ color: "#94a3b8" }}>No data available</p>}
        </Card>

        {/* 10. Top Authors */}
        <Card title="🏆 Top Authors">
          {topAuthors.length > 0 ? (
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {topAuthors.slice(0, 5).map((a, i) => (
                <div key={a.name || i} style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "8px 12px", borderRadius: 10,
                  background: i === 0 ? "#f5f4ff" : "transparent",
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: "50%",
                    background: [PURPLE,PINK,TEAL,AMBER,"#22c55e"][i],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#fff", fontSize: 12, fontWeight: 800, flexShrink: 0,
                  }}>{i + 1}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: "#1e1b4b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{a.name}</div>
                    <div style={{ fontSize: 11, color: "#94a3b8" }}>{a.stories} stories · {(a.views || 0).toLocaleString()} views</div>
                  </div>
                  <div style={{
                    fontSize: 13, fontWeight: 800,
                    color: "#22c55e", background: "#f0fdf4",
                    borderRadius: 8, padding: "3px 8px",
                  }}>{(a.rating || 4.5).toFixed(1)}★</div>
                </div>
              ))}
            </div>
          ) : <p style={{ color: "#94a3b8" }}>No data available</p>}
        </Card>

        {/* 11. Most Viewed Stories */}
        <Card title="🔥 Most Viewed Stories" span={3}>
          {topStoriesData.length > 0 ? (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e2e8f0" }}>
                    {["#", "Story Title", "Views", "Reads", "Rating", "Trend"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "8px 12px", color: "#64748b", fontWeight: 600 }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {topStoriesData.slice(0, 5).map((s, i) => {
                    const maxViews = topStoriesData[0]?.views || 1;
                    return (
                      <tr key={s.title || i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "12px", color: "#94a3b8", fontWeight: 700 }}>{i + 1}</td>
                        <td style={{ padding: "12px", fontWeight: 600, color: "#1e1b4b" }}>{s.title}</td>
                        <td style={{ padding: "12px", color: PURPLE, fontWeight: 700 }}>{(s.views || 0).toLocaleString()}</td>
                        <td style={{ padding: "12px", color: TEAL, fontWeight: 700 }}>{(s.reads || 0).toLocaleString()}</td>
                        <td style={{ padding: "12px" }}>
                          <span style={{
                            background: "#f0fdf4", color: "#22c55e",
                            borderRadius: 8, padding: "3px 10px",
                            fontSize: 12, fontWeight: 700,
                          }}>{(s.rating || 4.5).toFixed(1)}★</span>
                        </td>
                        <td style={{ padding: "12px" }}>
                          <div style={{ width: 80, background: "#f1f5f9", borderRadius: 4, height: 6 }}>
                            <div style={{
                              width: `${Math.round(((s.views || 0) / maxViews) * 100)}%`,
                              height: "100%", borderRadius: 4,
                              background: `linear-gradient(90deg, ${PURPLE}, ${PINK})`,
                            }}/>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : <p style={{ color: "#94a3b8" }}>No data available</p>}
        </Card>

      </div>

      {/* Footer note */}
      <p style={{ textAlign: "center", marginTop: 32, color: "#94a3b8", fontSize: 12 }}>
        📊 Real-time Database Analytics · Data updates automatically · Mozhibu Admin Dashboard
      </p>
    </div>
  );
}
