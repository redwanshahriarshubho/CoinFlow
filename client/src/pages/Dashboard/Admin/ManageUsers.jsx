import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ManageUsers = () => {
  const { user: currentUser } = useAuth();
  const qc = useQueryClient();
  const { data: users = [], isLoading } = useQuery({ queryKey: ["all-users"], queryFn: () => axiosSecure.get("/users").then(r => r.data) });

  const handleRoleChange = async (userId, role) => {
    try {
      await axiosSecure.patch(`/users/${userId}/role`, { role });
      toast.success("Role updated!");
      qc.invalidateQueries(["all-users"]);
    } catch { toast.error("Failed to update role"); }
  };

  const handleDelete = async (userId, name) => {
    const result = await Swal.fire({ title: `Delete ${name}?`, text: "This cannot be undone.", icon: "warning", showCancelButton: true, confirmButtonText: "Delete", confirmButtonColor: "#ef4444", background: "#111827", color: "#f9fafb" });
    if (!result.isConfirmed) return;
    try {
      await axiosSecure.delete(`/users/${userId}`);
      toast.success("User deleted");
      qc.invalidateQueries(["all-users"]);
    } catch { toast.error("Delete failed"); }
  };

  const roleColor = { admin: "#06b6d4", buyer: "#8b5cf6", worker: "#f59e0b" };

  return (
    <div className="animate-fadeInUp">
      <h1 className="page-title">Manage Users</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, marginTop: -16 }}>{users.length} registered users on the platform</p>
      <div className="card">
        {isLoading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><span className="loading-spinner" /></div> : (
          <div className="table-wrapper">
            <table>
              <thead><tr><th>User</th><th>Email</th><th>Role</th><th>Coins</th><th>Change Role</th><th>Action</th></tr></thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <img src={u.photo || `https://ui-avatars.com/api/?name=${u.name}`} alt={u.name} style={{ width: 36, height: 36, borderRadius: "50%", objectFit: "cover" }} />
                        <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{u.email}</td>
                    <td><span style={{ display: "inline-block", padding: "3px 10px", borderRadius: 999, fontSize: "0.72rem", fontWeight: 700, fontFamily: "Syne", background: `${roleColor[u.role]}22`, color: roleColor[u.role] }}>{u.role}</span></td>
                    <td><span className="coin-badge" style={{ fontSize: "0.75rem" }}>🪙 {u.coins}</span></td>
                    <td>
                      {u.email !== currentUser?.email ? (
                        <select value={u.role} onChange={e => handleRoleChange(u._id, e.target.value)} className="form-input" style={{ padding: "5px 10px", fontSize: "0.82rem", width: "auto" }}>
                          <option value="worker">Worker</option>
                          <option value="buyer">Buyer</option>
                          <option value="admin">Admin</option>
                        </select>
                      ) : <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>You</span>}
                    </td>
                    <td>
                      {u.email !== currentUser?.email ? (
                        <button onClick={() => handleDelete(u._id, u.name)} className="btn-danger" style={{ padding: "5px 12px", fontSize: "0.8rem" }}>🗑️ Remove</button>
                      ) : <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>—</span>}
                    </td>
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

export default ManageUsers;