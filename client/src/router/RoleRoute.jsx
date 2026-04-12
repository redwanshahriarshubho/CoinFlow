import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleHomeMap = {
  worker: "/dashboard/worker-home",
  buyer: "/dashboard/buyer-home",
  admin: "/dashboard/admin-home",
};

const RoleRoute = ({ children, role }) => {
  const { dbUser, loading } = useAuth();

  if (loading)
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <span className="loading-spinner" />
      </div>
    );

  if (!dbUser) return null;
  if (dbUser.role !== role) return <Navigate to={roleHomeMap[dbUser.role] || "/"} replace />;
  return children;
};

export default RoleRoute;