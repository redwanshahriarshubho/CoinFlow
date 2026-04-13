import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import axiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const MyTasks = () => {
  const { refetchDbUser } = useAuth();
  const qc = useQueryClient();
  const [editTask, setEditTask] = useState(null);
  const [updating, setUpdating] = useState(false);
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["buyer-tasks"],
    queryFn: () => axiosSecure.get("/tasks/buyer").then(r => r.data),
  });
  const { register, handleSubmit, reset, setValue } = useForm();

  const openEdit = (task) => {
    setEditTask(task);
    setValue("task_title", task.task_title);
    setValue("task_detail", task.task_detail);
    setValue("submission_info", task.submission_info);
  };

  const onUpdate = async (data) => {
    setUpdating(true);
    try {
      await axiosSecure.patch(`/tasks/${editTask._id}`, data);
      toast.success("Task updated!");
      qc.invalidateQueries(["buyer-tasks"]);
      setEditTask(null);
      reset();
    } catch { toast.error("Update failed"); }
    finally { setUpdating(false); }
  };

  const handleDelete = async (taskId) => {
    const result = await Swal.fire({
      title: "Delete Task?", text: "Unused coins will be refunded.", icon: "warning",
      showCancelButton: true, confirmButtonText: "Yes, Delete",
      confirmButtonColor: "#ef4444", background: "#111827", color: "#f9fafb",
    });
    if (!result.isConfirmed) return;
    try {
      await axiosSecure.delete(`/tasks/${taskId}`);
      toast.success("Task deleted, coins refunded!");
      qc.invalidateQueries(["buyer-tasks"]);
      await refetchDbUser();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="animate-fadeInUp">
      <h1 className="page-title">My Tasks</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, marginTop: -16 }}>Manage all tasks you have posted</p>
      <div className="card">
        {isLoading ? <div style={{ display: "flex", justifyContent: "center", padding: 40 }}><span className="loading-spinner" /></div>
          : tasks.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "var(--text-muted)" }}>
              <p style={{ fontSize: "2rem", marginBottom: 8 }}>📋</p>
              <p>No tasks posted yet. Add your first task!</p>
            </div>
          ) : (
            <div className="table-wrapper">
              <table>
                <thead><tr><th>Task Title</th><th>Workers Needed</th><th>Coins/Worker</th><th>Deadline</th><th>Actions</th></tr></thead>
                <tbody>
                  {tasks.map(task => (
                    <tr key={task._id}>
                      <td style={{ fontWeight: 600, maxWidth: 200 }}>
                        <div style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.task_title}</div>
                      </td>
                      <td>{task.required_workers}</td>
                      <td><span className="coin-badge" style={{ fontSize: "0.75rem" }}>🪙 {task.payable_amount}</span></td>
                      <td style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{new Date(task.completion_date).toLocaleDateString()}</td>
                      <td>
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => openEdit(task)} className="btn-secondary" style={{ padding: "5px 12px", fontSize: "0.8rem" }}>✏️ Edit</button>
                          <button onClick={() => handleDelete(task._id)} className="btn-danger" style={{ padding: "5px 12px", fontSize: "0.8rem" }}>🗑️ Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
      </div>

      {editTask && (
        <div className="modal-overlay" onClick={() => setEditTask(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20 }}>Edit Task</h3>
            <form onSubmit={handleSubmit(onUpdate)}>
              <div className="form-group"><label>Task Title</label><input {...register("task_title", { required: true })} className="form-input" /></div>
              <div className="form-group"><label>Description</label><textarea {...register("task_detail", { required: true })} className="form-input" style={{ minHeight: 100 }} /></div>
              <div className="form-group"><label>Submission Instructions</label><textarea {...register("submission_info", { required: true })} className="form-input" /></div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" className="btn-primary" disabled={updating} style={{ flex: 1, justifyContent: "center" }}>{updating ? "Saving..." : "Save Changes"}</button>
                <button type="button" onClick={() => setEditTask(null)} className="btn-secondary">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyTasks;