import { Link } from "react-router-dom";
import { FiGithub, FiLinkedin, FiFacebook } from "react-icons/fi";

const Footer = () => (
  <footer style={{
    background: "var(--bg-card)",
    borderTop: "1px solid var(--border)",
    padding: "40px 24px",
    textAlign: "center",
  }}>
    <Link to="/" style={{ textDecoration: "none", display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: 16 }}>
      <div style={{
        width: 32, height: 32, borderRadius: "8px",
        background: "linear-gradient(135deg, var(--primary), var(--accent))",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontWeight: 800, color: "white",
      }}>C</div>
      <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.1rem", color: "var(--text)" }}>
        Coin<span style={{ color: "var(--primary)" }}>Flow</span>
      </span>
    </Link>

    <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", maxWidth: 400, margin: "8px auto 20px" }}>
      The next-generation micro-tasking platform. Earn coins, complete tasks, grow your income.
    </p>

    <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: 20 }}>
      {[
        { icon: <FiGithub />, href: "https://github.com/redwanshahriarshubho" },
        { icon: <FiLinkedin />, href: "https://linkedin.com" },
        { icon: <FiFacebook />, href: "https://facebook.com" },
      ].map((s, i) => (
        <a key={i} href={s.href} target="_blank" rel="noreferrer" style={{
          width: 40, height: 40, borderRadius: "50%",
          border: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--text-muted)", textDecoration: "none", fontSize: "1rem",
        }}>{s.icon}</a>
      ))}
    </div>

    <p style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>
      © {new Date().getFullYear()} CoinFlow. All rights reserved.
    </p>
  </footer>
);

export default Footer;