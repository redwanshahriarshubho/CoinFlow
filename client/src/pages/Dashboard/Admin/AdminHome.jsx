import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const AdminHome = () => {
  const qc = useQueryClient();
  const { data: stats = {} } = useQuery({ queryKey: ["admin-stats"], queryFn: () => axiosSecure.get("/stats/admin").then(r => r.data) });
  const { data: withdrawals = [] } = useQuery({ queryKey: ["pending-withdrawals"], queryFn: () => axiosSecure.get("/withdrawals").then(r => r.data) });

  const handleApprove = async (id) => {
    try {
      await axiosSecure.patch(`/withdrawals/${id}/approve`);
      toast.success("Payment approved!");
      qc.invalidateQueries(["pending-withdrawals"]);
      qc.invalidateQueries(["admin-stats"]);
    } catch { toast.error("Failed"); }
  };

  return (
    <div className="animate-fadeInUp">
      <h1 className="page-title">Admin Dashboard</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, marginTop: -16 }}>Platform overview and management</p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[
          { icon: "👷", label: "Total Workers", value: stats.totalWorkers || 0, color: "#06b6d4", bg: "rgba(6,182,212,0.1)" },
          { icon: "🏢", label: "Total Buyers", value: stats.totalBuyers || 0, color: "#8b5cf6", bg: "rgba(139,92,246,0.1)" },
          { icon: "🪙", label: "Total Coins", value: stats.totalCoins || 0, color: "#f59e0b", bg: "rgba(245,158,11,0.1)" },
          { icon: "💰", label: "Total Revenue", value: `$${(stats.totalPayments || 0).toFixed(2)}`, color: "#10b981", bg: "rgba(16,185,129,0.1)" },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: s.bg }}><span style={{ fontSize: "1.4rem" }}>{s.icon}</span></div>
            <div><p className="stat-value" style={{ color: s.color }}>{s.value}</p><p className="stat-label">{s.label}</p></div>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20, fontSize: "1.1rem" }}>💸 Pending Withdrawals ({withdrawals.length})</h2>
        {withdrawals.length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
            <p style={{ fontSize: "2rem", marginBottom: 8 }}>✅</p><p>No pending withdrawal requests.</p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>Worker</th><th>Email</th><th>Coins</th><th>Amount</th><th>Method</th><th>Account</th><th>Date</th><th>Action</th></tr></thead>
              <tbody>
                {withdrawals.map(w => (
                  <tr key={w._id}>
                    <td style={{ fontWeight: 600 }}>{w.worker_name}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{w.worker_email}</td>
                    <td><span className="coin-badge" style={{ fontSize: "0.75rem" }}>🪙 {w.withdrawal_coin}</span></td>
                    <td style={{ color: "var(--success)", fontWeight: 700 }}>${w.withdrawal_amount}</td>
                    <td style={{ textTransform: "capitalize" }}>{w.payment_system}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{w.account_number}</td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>{new Date(w.withdraw_date).toLocaleDateString()}</td>
                    <td><button onClick={() => handleApprove(w._id)} className="btn-success" style={{ padding: "5px 14px", fontSize: "0.8rem" }}>✓ Pay</button></td>
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

export default AdminHome;