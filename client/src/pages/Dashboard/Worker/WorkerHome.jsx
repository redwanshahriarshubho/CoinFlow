import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../context/AuthContext";

const WorkerHome = () => {
  const { dbUser } = useAuth();

  const { data: stats = {} } = useQuery({
    queryKey: ["worker-stats"],
    queryFn: () => axiosSecure.get("/stats/worker").then(r => r.data),
  });

  const { data: subData = { submissions: [] } } = useQuery({
    queryKey: ["approved-subs"],
    queryFn: () => axiosSecure.get("/submissions/worker?limit=100").then(r => r.data),
  });

  const approvedSubs = subData.submissions?.filter(s => s.status === "approved") || [];

  return (
    <div className="animate-fadeInUp">
      <h1 className="page-title">Worker Dashboard</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, marginTop: -16 }}>
        Welcome back, <strong style={{ color: "var(--text)" }}>{dbUser?.name}</strong>! 👋
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { icon: "📋", label: "Total Submissions", value: stats.totalSubmissions || 0, color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
          { icon: "⏳", label: "Pending Submissions", value: stats.pendingSubmissions || 0, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
          { icon: "🪙", label: "Total Earned (Coins)", value: stats.totalEarning || 0, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}><span style={{ fontSize: "1.5rem" }}>{s.icon}</span></div>
            <div>
              <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
              <p className="stat-label">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20, fontSize: "1.1rem" }}>✅ Approved Submissions</h2>
        {approvedSubs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            <p style={{ fontSize: "2rem", marginBottom: 8 }}>🎯</p>
            <p>No approved submissions yet. Complete tasks to earn coins!</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Task Title</th><th>Buyer</th><th>Coins Earned</th><th>Date</th><th>Status</th></tr>
              </thead>
              <tbody>
                {approvedSubs.map(sub => (
                  <tr key={sub._id}>
                    <td style={{ fontWeight: 600 }}>{sub.task_title}</td>
                    <td style={{ color: "var(--text-muted)" }}>{sub.buyer_name}</td>
                    <td><span className="coin-badge">🪙 {sub.payable_amount}</span></td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{new Date(sub.current_date).toLocaleDateString()}</td>
                    <td><span className="badge badge-approved">Approved</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerHome;