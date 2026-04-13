import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/useAxiosSecure";

const PaymentHistory = () => {
  const { data: payments = [], isLoading } = useQuery({
    queryKey: ["payments"],
    queryFn: () => axiosSecure.get("/payments").then(r => r.data),
  });

  return (
    <div className="animate-fadeInUp">
      <h1 className="page-title">Payment History</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, marginTop: -16 }}>All your coin purchase transactions</p>
      <div className="card">
        {isLoading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><span className="loading-spinner" /></div>
          : payments.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "2rem", marginBottom: 8 }}>💳</p>
              <p>No payments yet. Purchase coins to get started!</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>#</th><th>Coins</th><th>Amount Paid</th><th>Transaction ID</th><th>Date</th></tr></thead>
                <tbody>
                  {payments.map((p, i) => (
                    <tr key={p._id}>
                      <td style={{ color: "var(--text-muted)" }}>{i + 1}</td>
                      <td><span className="coin-badge">🪙 {p.coins}</span></td>
                      <td style={{ fontFamily: "Syne", fontWeight: 700, color: "var(--success)" }}>${p.amount}</td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.78rem", fontFamily: "monospace" }}>{p.transactionId?.slice(0, 20)}...</td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{new Date(p.date).toLocaleDateString()}</td>
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

export default PaymentHistory;