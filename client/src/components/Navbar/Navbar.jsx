import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../hooks/useAxiosSecure";
import { FiCodesandbox, FiBell, FiLogOut } from "react-icons/fi";

const Navbar = () => {
  const { user, dbUser, logout } = useAuth();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const [notifOpen, setNotifOpen] = useState(false);
  const notifRef = useRef(null);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosSecure.get("/notifications").then(r => r.data),
    enabled: !!user,
    refetchInterval: 30000,
  });

  const unread = notifications.filter(n => !n.read).length;

  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const markRead = async () => {
    if (unread > 0) {
      await axiosSecure.patch("/notifications/read");
      qc.invalidateQueries(["notifications"]);
    }
  };

  const dashHome = dbUser?.role === "admin" ? "/dashboard/admin-home"
    : dbUser?.role === "buyer" ? "/dashboard/buyer-home"
    : "/dashboard/worker-home";

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(10,15,30,0.95)",
      backdropFilter: "blur(12px)",
      borderBottom: "1px solid var(--border)",
      padding: "0 24px", height: "64px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
        <div style={{
          width: 36, height: 36, borderRadius: "10px",
          background: "linear-gradient(135deg, var(--primary), var(--accent))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1.1rem", fontWeight: 800, color: "white",
        }}>C</div>
        <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.2rem", color: "var(--text)" }}>
          Coin<span style={{ color: "var(--primary)" }}>Flow</span>
        </span>
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {user ? (
          <>
            <div className="coin-badge">🪙 {dbUser?.coins || 0}</div>

            <Link to={dashHome} style={{ color: "var(--text-muted)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>
              Dashboard
            </Link>

            <div ref={notifRef} style={{ position: "relative" }}>
              <button
                onClick={() => { setNotifOpen(!notifOpen); markRead(); }}
                style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", fontSize: "1.2rem", display: "flex", alignItems: "center", position: "relative" }}>
                <FiBell />
                {unread > 0 && (
                  <span style={{
                    position: "absolute", top: -4, right: -4,
                    background: "var(--danger)", color: "white",
                    borderRadius: "999px", width: 16, height: 16,
                    fontSize: "0.65rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                  }}>{unread}</span>
                )}
              </button>

              {notifOpen && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 8px)",
                  width: 320, background: "var(--bg-card)", border: "1px solid var(--border)",
                  borderRadius: "12px", boxShadow: "0 16px 48px rgba(0,0,0,0.5)",
                  maxHeight: 360, overflowY: "auto", zIndex: 200,
                }}>
                  <div style={{ padding: "14px 16px", borderBottom: "1px solid var(--border)", fontFamily: "Syne", fontWeight: 700, fontSize: "0.9rem" }}>
                    Notifications
                  </div>
                  {notifications.length === 0 ? (
                    <div style={{ padding: 20, textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>No notifications yet</div>
                  ) : (
                    notifications.map(n => (
                      <Link key={n._id} to={n.actionRoute} onClick={() => setNotifOpen(false)}
                        style={{
                          display: "block", padding: "12px 16px",
                          borderBottom: "1px solid var(--border)",
                          textDecoration: "none", color: "var(--text)",
                          background: n.read ? "transparent" : "rgba(245,158,11,0.05)",
                          fontSize: "0.85rem",
                        }}>
                        <p>{n.message}</p>
                        <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: 4 }}>
                          {new Date(n.time).toLocaleString()}
                        </p>
                      </Link>
                    ))
                  )}
                </div>
              )}
            </div>

            <img
              src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}`}
              alt="avatar"
              style={{ width: 36, height: 36, borderRadius: "50%", border: "2px solid var(--primary)", objectFit: "cover" }}
            />
            <button onClick={handleLogout} className="btn-secondary" style={{ padding: "6px 14px", fontSize: "0.85rem", display: "flex", alignItems: "center", gap: 6 }}>
              <FiLogOut /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: "var(--text-muted)", textDecoration: "none", fontWeight: 600, fontSize: "0.9rem" }}>Login</Link>
            <Link to="/register">
              <button className="btn-primary" style={{ padding: "8px 20px", fontSize: "0.9rem" }}>Register</button>
            </Link>
          </>
        )}
        <a href="https://github.com/redwanshahriarshubho" target="_blank" rel="noreferrer">
          <button className="btn-secondary" style={{ padding: "6px 14px", fontSize: "0.8rem", display: "flex", alignItems: "center", gap: 6 }}>
            <FiCodesandbox /> Join as Dev
          </button>
        </a>
      </div>
    </nav>
  );
};

export default Navbar;