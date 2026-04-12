import { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  FiHome, FiList, FiCheckSquare, FiDollarSign, FiPlusCircle,
  FiClipboard, FiCreditCard, FiUsers, FiSettings, FiMenu,
  FiLogOut, FiBell,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import axiosSecure from "../hooks/useAxiosSecure";

const workerNav = [
  { to: "/dashboard/worker-home", icon: <FiHome />, label: "Home" },
  { to: "/dashboard/task-list", icon: <FiList />, label: "Task List" },
  { to: "/dashboard/my-submissions", icon: <FiCheckSquare />, label: "My Submissions" },
  { to: "/dashboard/withdrawals", icon: <FiDollarSign />, label: "Withdrawals" },
];

const buyerNav = [
  { to: "/dashboard/buyer-home", icon: <FiHome />, label: "Home" },
  { to: "/dashboard/add-task", icon: <FiPlusCircle />, label: "Add Task" },
  { to: "/dashboard/my-tasks", icon: <FiClipboard />, label: "My Tasks" },
  { to: "/dashboard/purchase-coin", icon: <FiCreditCard />, label: "Purchase Coin" },
  { to: "/dashboard/payment-history", icon: <FiDollarSign />, label: "Payment History" },
];

const adminNav = [
  { to: "/dashboard/admin-home", icon: <FiHome />, label: "Home" },
  { to: "/dashboard/manage-users", icon: <FiUsers />, label: "Manage Users" },
  { to: "/dashboard/manage-tasks", icon: <FiSettings />, label: "Manage Tasks" },
];

const DashboardLayout = () => {
  const { user, dbUser, logout } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const { data: notifications = [] } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => axiosSecure.get("/notifications").then(r => r.data),
    enabled: !!user,
    refetchInterval: 15000,
  });
  const unread = notifications.filter(n => !n.read).length;

  const navItems = dbUser?.role === "admin" ? adminNav
    : dbUser?.role === "buyer" ? buyerNav : workerNav;

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const roleColor = { admin: "#06b6d4", buyer: "#8b5cf6", worker: "#f59e0b" };
  const roleLabel = { admin: "Administrator", buyer: "Buyer", worker: "Worker" };

  const SidebarContent = () => (
    <div style={{
      width: 240, height: "100%", background: "var(--bg-card)",
      borderRight: "1px solid var(--border)",
      display: "flex", flexDirection: "column",
    }}>
      <div style={{ padding: "20px 20px 16px", borderBottom: "1px solid var(--border)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8,
            background: "linear-gradient(135deg, var(--primary), var(--accent))",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontWeight: 800, color: "white", fontSize: "0.9rem",
          }}>C</div>
          <span style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.1rem" }}>
            Coin<span style={{ color: "var(--primary)" }}>Flow</span>
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img
            src={user?.photoURL || `https://ui-avatars.com/api/?name=${user?.displayName}&background=f59e0b&color=000`}
            alt="avatar"
            style={{ width: 40, height: 40, borderRadius: "50%", objectFit: "cover", border: "2px solid var(--primary)" }}
          />
          <div>
            <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.85rem", lineHeight: 1.2 }}>
              {user?.displayName || "User"}
            </p>
            <p style={{
              fontSize: "0.72rem", fontWeight: 700,
              color: roleColor[dbUser?.role] || "var(--text-muted)",
              textTransform: "uppercase", letterSpacing: "0.05em",
            }}>
              {roleLabel[dbUser?.role]}
            </p>
          </div>
        </div>
        <div className="coin-badge" style={{ marginTop: 12, fontSize: "0.8rem" }}>
          🪙 {dbUser?.coins || 0} coins
        </div>
      </div>

      <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setSidebarOpen(false)}
            style={({ isActive }) => ({
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 12px", borderRadius: 8,
              textDecoration: "none", marginBottom: 4,
              fontSize: "0.9rem", fontWeight: 600, transition: "all 0.15s",
              background: isActive ? "rgba(245,158,11,0.12)" : "transparent",
              color: isActive ? "var(--primary)" : "var(--text-muted)",
              borderLeft: isActive ? "3px solid var(--primary)" : "3px solid transparent",
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div style={{ padding: "12px 10px", borderTop: "1px solid var(--border)" }}>
        <button
          onClick={handleLogout}
          style={{
            width: "100%", display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 8, border: "none",
            background: "transparent", color: "var(--text-muted)",
            cursor: "pointer", fontSize: "0.9rem", fontWeight: 600,
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "rgba(239,68,68,0.1)"; e.currentTarget.style.color = "var(--danger)"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--text-muted)"; }}
        >
          <FiLogOut /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ display: "flex", height: "100vh", overflow: "hidden" }}>
      <div style={{ display: "none", flexShrink: 0 }} className="desktop-sidebar">
        <SidebarContent />
      </div>

      {sidebarOpen && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", zIndex: 200 }}
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div style={{
        position: "fixed", left: sidebarOpen ? 0 : -280,
        top: 0, bottom: 0, zIndex: 201,
        transition: "left 0.3s ease", width: 240,
      }}>
        <SidebarContent />
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{
          height: 56, background: "var(--bg-card)", borderBottom: "1px solid var(--border)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "0 20px", flexShrink: 0,
        }}>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", color: "var(--text)", cursor: "pointer", fontSize: "1.2rem" }}
          >
            <FiMenu />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div className="coin-badge" style={{ fontSize: "0.8rem" }}>🪙 {dbUser?.coins || 0}</div>
            <div style={{ position: "relative" }}>
              <FiBell style={{ color: unread ? "var(--primary)" : "var(--text-muted)", fontSize: "1.2rem" }} />
              {unread > 0 && (
                <span style={{
                  position: "absolute", top: -5, right: -5,
                  background: "var(--danger)", color: "white", borderRadius: "50%",
                  width: 14, height: 14, fontSize: "0.6rem",
                  display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700,
                }}>{unread}</span>
              )}
            </div>
          </div>
        </div>

        <main style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          <Outlet />
        </main>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .desktop-sidebar { display: flex !important; }
        }
      `}</style>
    </div>
  );
};

export default DashboardLayout;