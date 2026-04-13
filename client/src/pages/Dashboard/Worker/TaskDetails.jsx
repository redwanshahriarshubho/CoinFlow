import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useState } from "react";
import axiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../context/AuthContext";
import toast from "react-hot-toast";

const TaskDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, dbUser } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const { data: task, isLoading } = useQuery({ queryKey: ["task", id], queryFn: () => axiosSecure.get(`/tasks/${id}`).then(r => r.data) });
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await axiosSecure.post("/submissions", { task_id: task._id, task_title: task.task_title, payable_amount: task.payable_amount, worker_email: user.email, worker_name: dbUser.name, buyer_email: task.buyer_email, buyer_name: task.buyer_name, submission_details: data.submission_details });
      toast.success("Submission sent for review!");
      reset();
      navigate("/dashboard/my-submissions");
    } catch (err) {
      toast.error(err.response?.data?.message || "Submission failed");
    } finally { setSubmitting(false); }
  };

  if (isLoading) return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><span className="loading-spinner" /></div>;
  if (!task) return <div style={{ textAlign: "center", padding: 60, color: "var(--text-muted)" }}>Task not found.</div>;

  return (
    <div className="animate-fadeInUp" style={{ maxWidth: 800, margin: "0 auto" }}>
      <button onClick={() => navigate(-1)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer", marginBottom: 20, fontSize: "0.9rem" }}>← Back</button>
      <div className="card" style={{ marginBottom: 24 }}>
        {task.task_image_url && <img src={task.task_image_url} alt={task.task_title} style={{ width: "100%", height: 200, objectFit: "cover", borderRadius: 8, marginBottom: 20 }} onError={e => e.target.style.display = "none"} />}
        <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.5rem", marginBottom: 16 }}>{task.task_title}</h1>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 12, marginBottom: 20 }}>
          {[["Reward", `🪙 ${task.payable_amount} coins`], ["Workers Needed", task.required_workers], ["Deadline", new Date(task.completion_date).toLocaleDateString()], ["Buyer", task.buyer_name]].map(([label, val], i) => (
            <div key={i} style={{ background: "var(--bg-card2)", padding: "12px 16px", borderRadius: 8 }}>
              <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginBottom: 4 }}>{label}</p>
              <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.95rem" }}>{val}</p>
            </div>
          ))}
        </div>
        <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 10 }}>Task Description</h3>
        <p style={{ color: "var(--text-muted)", lineHeight: 1.7, fontSize: "0.95rem", marginBottom: 20 }}>{task.task_detail}</p>
        <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: 8, padding: 16 }}>
          <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 6, fontSize: "0.95rem", color: "var(--primary)" }}>📋 What to Submit</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>{task.submission_info}</p>
        </div>
      </div>
      <div className="card">
        <h2 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 20, fontSize: "1.1rem" }}>Submit Your Work</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Submission Details *</label>
            <textarea {...register("submission_details", { required: "Please provide details", minLength: { value: 20, message: "At least 20 characters" } })} className="form-input" style={{ minHeight: 140 }} placeholder="Describe what you did, include links, screenshots..." />
            {errors.submission_details && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.submission_details.message}</span>}
          </div>
          <button type="submit" className="btn-primary" disabled={submitting} style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
            {submitting ? "Submitting..." : `Submit for Review — Earn 🪙 ${task.payable_amount}`}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskDetails;