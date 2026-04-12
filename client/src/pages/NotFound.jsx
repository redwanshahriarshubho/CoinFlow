import { Link } from "react-router-dom";

const NotFound = () => (
  <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center", padding: 24 }}>
    <div>
      <p style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "8rem", color: "var(--primary)", lineHeight: 1 }}>404</p>
      <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.75rem", margin: "16px 0 8px" }}>Page Not Found</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32 }}>The page you're looking for doesn't exist.</p>
      <Link to="/"><button className="btn-primary">← Back to Home</button></Link>
    </div>
  </div>
);

export default NotFound;