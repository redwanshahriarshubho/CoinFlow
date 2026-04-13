import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const packages = [
  { coins: 10, price: 1, label: "Starter", icon: "🌱" },
  { coins: 150, price: 10, label: "Basic", icon: "⚡" },
  { coins: 500, price: 35, label: "Pro", icon: "🚀", popular: true },
  { coins: 1000, price: 50, label: "Elite", icon: "💎" },
];

const CheckoutForm = ({ pkg, onSuccess, onCancel }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { user, refetchDbUser } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setLoading(true);
    try {
      const { data } = await axiosSecure.post("/create-payment-intent", { amount: pkg.price });
      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
      });
      if (result.error) {
        toast.error(result.error.message);
      } else if (result.paymentIntent.status === "succeeded") {
        await axiosSecure.post("/payments", { email: user.email, coins: pkg.coins, amount: pkg.price, transactionId: result.paymentIntent.id });
        toast.success(`🎉 ${pkg.coins} coins added!`);
        await refetchDbUser();
        onSuccess();
      }
    } catch { toast.error("Payment failed. Try again."); }
    finally { setLoading(false); }
  };

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 8 }}>Complete Purchase</h3>
        <p style={{ color: "var(--text-muted)", marginBottom: 20, fontSize: "0.9rem" }}>{pkg.label} Pack — {pkg.coins} coins for ${pkg.price}</p>
        <form onSubmit={handleSubmit}>
          <div style={{ background: "var(--bg-card2)", border: "1px solid var(--border)", borderRadius: 8, padding: "14px 16px", marginBottom: 16 }}>
            <CardElement options={{ style: { base: { color: "#f9fafb", fontFamily: "DM Sans", fontSize: "15px", "::placeholder": { color: "#6b7280" } }, invalid: { color: "#ef4444" } } }} />
          </div>
          <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: 16 }}>Test card: 4242 4242 4242 4242 | Any future date | Any CVC</p>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" className="btn-primary" disabled={!stripe || loading} style={{ flex: 1, justifyContent: "center", padding: "12px" }}>{loading ? "Processing..." : `Pay $${pkg.price}`}</button>
            <button type="button" onClick={onCancel} className="btn-secondary">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PurchaseCoin = () => {
  const [selectedPkg, setSelectedPkg] = useState(null);

  return (
    <div className="animate-fadeInUp">
      <h1 className="page-title">Purchase Coins</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, marginTop: -16 }}>Buy coins to post tasks and manage your campaigns</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 20, maxWidth: 900 }}>
        {packages.map((pkg, i) => (
          <div key={i} className="card card-hover" style={{ textAlign: "center", cursor: "pointer", position: "relative", border: pkg.popular ? "2px solid var(--primary)" : "1px solid var(--border)" }} onClick={() => setSelectedPkg(pkg)}>
            {pkg.popular && (
              <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: "var(--primary)", color: "#0a0f1e", padding: "3px 14px", borderRadius: 999, fontSize: "0.72rem", fontFamily: "Syne", fontWeight: 800 }}>BEST VALUE</div>
            )}
            <div style={{ fontSize: "2.5rem", marginBottom: 12 }}>{pkg.icon}</div>
            <p style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>{pkg.label}</p>
            <p style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "2rem", color: "var(--primary)", marginBottom: 4 }}>🪙 {pkg.coins}</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginBottom: 16 }}>coins</p>
            <div style={{ background: "var(--bg-card2)", borderRadius: 8, padding: "10px" }}>
              <p style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.4rem" }}>${pkg.price}</p>
            </div>
          </div>
        ))}
      </div>
      {selectedPkg && (
        <Elements stripe={stripePromise}>
          <CheckoutForm pkg={selectedPkg} onSuccess={() => setSelectedPkg(null)} onCancel={() => setSelectedPkg(null)} />
        </Elements>
      )}
    </div>
  );
};

export default PurchaseCoin;