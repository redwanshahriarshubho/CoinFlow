import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/useAxiosSecure";

const MySubmissions = () => {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data = { submissions: [], total: 0, pages: 1 }, isLoading } = useQuery({
    queryKey: ["my-submissions", page],
    queryFn: () => axiosSecure.get(`/submissions/worker?page=${page}&limit=${limit}`).then(r => r.data),
    keepPreviousData: true,
  });

  return (
    <div className="animate-fadeInUp">
      <h1 className="page-title">My Submissions</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, marginTop: -16 }}>Track all your task submissions and their review status</p>
      <div className="card">
        {isLoading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><span className="loading-spinner" /></div>
          : data.submissions.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "2rem", marginBottom: 8 }}>📭</p>
              <p>No submissions yet. Start completing tasks to earn coins!</p>
            </div>
          ) : (
            <>
              <div className="table-wrapper">
                <table>
                  <thead><tr><th>#</th><th>Task Title</th><th>Buyer</th><th>Reward</th><th>Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {data.submissions.map((sub, i) => (
                      <tr key={sub._id}>
                        <td style={{ color: "var(--text-muted)" }}>{(page - 1) * limit + i + 1}</td>
                        <td style={{ fontWeight: 600 }}>{sub.task_title}</td>
                        <td style={{ color: "var(--text-muted)" }}>{sub.buyer_name}</td>
                        <td><span className="coin-badge" style={{ fontSize: "0.75rem" }}>🪙 {sub.payable_amount}</span></td>
                        <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{new Date(sub.current_date).toLocaleDateString()}</td>
                        <td><span className={`badge badge-${sub.status}`}>{sub.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 20, flexWrap: "wrap", gap: 12 }}>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Showing {(page - 1) * limit + 1}–{Math.min(page * limit, data.total)} of {data.total}</p>
                <div style={{ display: "flex", gap: 8 }}>
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary" style={{ padding: "6px 16px", opacity: page === 1 ? 0.4 : 1 }}>← Prev</button>
                  {Array.from({ length: data.pages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)} style={{ width: 36, height: 36, borderRadius: 8, border: "1px solid", borderColor: p === page ? "var(--primary)" : "var(--border)", background: p === page ? "rgba(245,158,11,0.15)" : "transparent", color: p === page ? "var(--primary)" : "var(--text-muted)", cursor: "pointer", fontFamily: "Syne", fontWeight: 700, fontSize: "0.85rem" }}>{p}</button>
                  ))}
                  <button onClick={() => setPage(p => Math.min(data.pages, p + 1))} disabled={page === data.pages} className="btn-secondary" style={{ padding: "6px 16px", opacity: page === data.pages ? 0.4 : 1 }}>Next →</button>
                </div>
              </div>
            </>
          )}
      </div>
    </div>
  );
};

export default MySubmissions;