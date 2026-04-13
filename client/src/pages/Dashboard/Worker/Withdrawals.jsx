import { useState } from "react";
import { useForm } from "react-hook-form";
import { useAuth } from "../../../context/AuthContext";
import axiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";

const Withdrawals = () => {
  const { dbUser, refetchDbUser } = useAuth();
  const [loading, setLoading] = useState(false);
  const coins = dbUser?.coins || 0;
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const coinToWithdraw = Number(watch("withdrawal_coin") || 0);
  const withdrawAmount = (coinToWithdraw / 20).toFixed(2);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await axiosSecure.post("/withdrawals", { worker_email: dbUser.email, worker_name: dbUser.name, withdrawal_coin: coinToWithdraw, withdrawal_amount: parseFloat(withdrawAmount), payment_system: data.payment_system, account_number: data.account_number });
      toast.success("Withdrawal request submitted!");
      await refetchDbUser();
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-fadeInUp">
      <h1 className="page-title">Withdrawals</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, marginTop: -16 }}>Convert your coins to real money</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
        {[["🪙", "Available Coins", coins, "var(--primary)", "rgba(245,158,11,0.1)"], ["💵", "Withdrawable", `$${(coins / 20).toFixed(2)}`, "var(--success)", "rgba(16,185,129,0.1)"]].map(([icon, label, val, color, bg], i) => (
          <div key={i} className="stat-card">
            <div className="stat-icon" style={{ background: bg }}>{icon}</div>
            <div><p className="stat-value" style={{ color }}>{val}</p><p className="stat-label">{label}</p></div>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 520 }}>
        {coins < 200 ? (
          <div className="card" style={{ textAlign: "center", padding: "40px 24px" }}>
            <p style={{ fontSize: "3rem", marginBottom: 12 }}>🔒</p>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 8 }}>Insufficient Coins</h3>
            <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>You need at least <strong style={{ color: "var(--primary)" }}>200 coins ($10)</strong> to withdraw. You have <strong>{coins}</strong> coins.</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 12 }}>{200 - coins} more coins needed</p>
          </div>
        ) : (
          <div className="card">
            <h2 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20, fontSize: "1.1rem" }}>Withdrawal Request</h2>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="form-group">
                <label>Coins to Withdraw (max: {coins})</label>
                <input {...register("withdrawal_coin", { required: "Amount required", min: { value: 200, message: "Minimum 200 coins" }, max: { value: coins, message: "Cannot exceed available coins" } })} type="number" className="form-input" placeholder={`200 - ${coins}`} />
                {errors.withdrawal_coin && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.withdrawal_coin.message}</span>}
              </div>
              <div className="form-group">
                <label>Withdrawal Amount ($)</label>
                <input value={`$${withdrawAmount}`} readOnly className="form-input" style={{ background: "var(--bg)", cursor: "not-allowed", color: "var(--success)", fontWeight: 700 }} />
                <span style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>20 coins = $1.00</span>
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select {...register("payment_system")} className="form-input">
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="bank">Bank Transfer</option>
                </select>
              </div>
              <div className="form-group">
                <label>Account Number</label>
                <input {...register("account_number", { required: "Account number required" })} className="form-input" placeholder="Your account number" />
                {errors.account_number && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.account_number.message}</span>}
              </div>
              <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
                {loading ? "Submitting..." : "Submit Withdrawal Request"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Withdrawals;