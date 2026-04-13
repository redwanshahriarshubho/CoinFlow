import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const BuyerHome = () => {
  const { dbUser, refetchDbUser } = useAuth();
  const qc = useQueryClient();
  const [viewSub, setViewSub] = useState(null);

  const { data: stats = {} } = useQuery({
    queryKey: ["buyer-stats"],
    queryFn: () => axiosSecure.get("/stats/buyer").then(r => r.data),
  });

  const { data: pendingSubs = [] } = useQuery({
    queryKey: ["buyer-pending-subs"],
    queryFn: () => axiosSecure.get("/submissions/buyer").then(r => r.data),
  });

  const handleApprove = async (subId) => {
    try {
      await axiosSecure.patch(`/submissions/${subId}/approve`);
      toast.success("Submission approved!");
      qc.invalidateQueries(["buyer-pending-subs"]);
      qc.invalidateQueries(["buyer-stats"]);
      await refetchDbUser();
    } catch { toast.error("Action failed"); }
  };

  const handleReject = async (subId) => {
    try {
      await axiosSecure.patch(`/submissions/${subId}/reject`);
      toast.success("Submission rejected");
      qc.invalidateQueries(["buyer-pending-subs"]);
    } catch { toast.error("Action failed"); }
  };

  return (
    <div className="animate-fadeInUp">
      <h1 className="page-title">Buyer Dashboard</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, marginTop: -16 }}>
        Welcome, <strong style={{ color: "var(--text)" }}>{dbUser?.name}</strong>! Manage your tasks and reviews.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { icon: "📋", label: "Total Tasks", value: stats.totalTasks || 0, color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
          { icon: "⏳", label: "Pending Workers", value: stats.pendingWorkers || 0, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
          { icon: "💸", label: "Total Paid ($)", value: `$${(stats.totalPaid || 0).toFixed(2)}`, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
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
        <h2 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20, fontSize: "1.1rem" }}>
          📝 Pending Reviews ({pendingSubs.length})
        </h2>
        {pendingSubs.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            <p style={{ fontSize: "2rem", marginBottom: 8 }}>✅</p>
            <p>All caught up! No pending submissions to review.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead>
                <tr><th>Worker</th><th>Task</th><th>Reward</th><th>View</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {pendingSubs.map(sub => (
                  <tr key={sub._id}>
                    <td style={{ fontWeight: 600 }}>{sub.worker_name}</td>
                    <td style={{ color: "var(--text-muted)", maxWidth: 180 }}>
                      <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{sub.task_title}</div>
                    </td>
                    <td><span className="coin-badge" style={{ fontSize: "0.75rem" }}>🪙 {sub.payable_amount}</span></td>
                    <td>
                      <button onClick={() => setViewSub(sub)} className="btn-secondary" style={{ padding: "5px 12px", fontSize: "0.8rem" }}>View</button>
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: 8 }}>
                        <button onClick={() => handleApprove(sub._id)} className="btn-success" style={{ padding: "5px 12px", fontSize: "0.8rem" }}>✓ Approve</button>
                        <button onClick={() => handleReject(sub._id)} className="btn-danger" style={{ padding: "5px 12px", fontSize: "0.8rem" }}>✗ Reject</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {viewSub && (
        <div className="modal-overlay" onClick={() => setViewSub(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 16, fontSize: "1.1rem" }}>Submission Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
              <div><span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Task</span><p style={{ fontWeight: 600, marginTop: 2 }}>{viewSub.task_title}</p></div>
              <div><span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Worker</span><p style={{ fontWeight: 600, marginTop: 2 }}>{viewSub.worker_name} ({viewSub.worker_email})</p></div>
              <div>
                <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>Submission</span>
                <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginTop: 4, lineHeight: 1.6, background: "var(--bg-card2)", padding: 12, borderRadius: 8 }}>{viewSub.submission_details}</p>
              </div>
            </div>
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => { handleApprove(viewSub._id); setViewSub(null); }} className="btn-success" style={{ flex: 1 }}>✓ Approve</button>
              <button onClick={() => { handleReject(viewSub._id); setViewSub(null); }} className="btn-danger" style={{ flex: 1 }}>✗ Reject</button>
              <button onClick={() => setViewSub(null)} className="btn-secondary">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuyerHome;