import { useQuery, useQueryClient } from "@tanstack/react-query";
import axiosSecure from "../../../hooks/useAxiosSecure";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ManageTasks = () => {
  const qc = useQueryClient();
  const { data: tasks = [], isLoading } = useQuery({ queryKey: ["admin-tasks"], queryFn: () => axiosSecure.get("/tasks/all").then(r => r.data) });

  const handleDelete = async (taskId, title) => {
    const result = await Swal.fire({ title: "Delete Task?", text: `"${title}" will be permanently deleted.`, icon: "warning", showCancelButton: true, confirmButtonText: "Delete", confirmButtonColor: "#ef4444", background: "#111827", color: "#f9fafb" });
    if (!result.isConfirmed) return;
    try {
      await axiosSecure.delete(`/tasks/admin/${taskId}`);
      toast.success("Task deleted");
      qc.invalidateQueries(["admin-tasks"]);
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="animate-fadeInUp">
      <h1 className="page-title">Manage Tasks</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, marginTop: -16 }}>{tasks.length} total tasks on the platform</p>
      <div className="card">
        {isLoading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><span className="loading-spinner" /></div>
          : tasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "2rem", marginBottom: 8 }}>📋</p><p>No tasks in the system.</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Task Title</th><th>Buyer</th><th>Workers Needed</th><th>Coins/Worker</th><th>Deadline</th><th>Action</th></tr></thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task._id}>
                      <td style={{ fontWeight: 600, maxWidth: 220 }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.task_title}</div>
                      </td>
                      <td style={{ color: "var(--text-muted)" }}>{task.buyer_name}</td>
                      <td>{task.required_workers}</td>
                      <td><span className="coin-badge" style={{ fontSize: "0.75rem" }}>🪙 {task.payable_amount}</span></td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{new Date(task.completion_date).toLocaleDateString()}</td>
                      <td><button onClick={() => handleDelete(task._id, task.task_title)} className="btn-danger" style={{ padding: "5px 12px", fontSize: "0.8rem" }}>🗑️ Delete</button></td>
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

export default ManageTasks;