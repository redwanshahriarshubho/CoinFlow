import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import axiosSecure from "../../../hooks/useAxiosSecure";
import { useAuth } from "../../../context/AuthContext";
import uploadImage from "../../../utils/uploadImage";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const AddTask = () => {
  const { user, dbUser, refetchDbUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const workers = Number(watch("required_workers") || 0);
  const amount = Number(watch("payable_amount") || 0);
  const total = workers * amount;

  const onSubmit = async (data) => {
    if (total > (dbUser?.coins || 0)) {
      Swal.fire({
        title: "Not Enough Coins!",
        text: `This task costs ${total} coins but you only have ${dbUser?.coins}. Purchase more coins.`,
        icon: "warning",
        confirmButtonText: "Purchase Coins",
        confirmButtonColor: "#f59e0b",
        background: "#111827",
        color: "#f9fafb",
      }).then(r => { if (r.isConfirmed) navigate("/dashboard/purchase-coin"); });
      return;
    }
    setLoading(true);
    try {
      let imgUrl = data.task_image_url || "";
      if (imgFile) { try { imgUrl = await uploadImage(imgFile); } catch (_) {} }
      await axiosSecure.post("/tasks", {
        task_title: data.task_title,
        task_detail: data.task_detail,
        required_workers: workers,
        payable_amount: amount,
        completion_date: data.completion_date,
        submission_info: data.submission_info,
        task_image_url: imgUrl,
        buyer_email: user.email,
        buyer_name: dbUser.name,
      });
      toast.success(`Task posted! ${total} coins deducted.`);
      await refetchDbUser();
      navigate("/dashboard/my-tasks");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to post task");
    } finally { setLoading(false); }
  };

  return (
    <div className="animate-fadeInUp">
      <h1 className="page-title">Add New Task</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, marginTop: -16 }}>
        Available coins: <span className="coin-badge" style={{ fontSize: "0.8rem" }}>🪙 {dbUser?.coins}</span>
      </p>
      <div style={{ maxWidth: 640 }}>
        <div className="card">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Task Title *</label>
              <input {...register("task_title", { required: "Title required" })} className="form-input" placeholder="e.g. Watch my YouTube video and leave a comment" />
              {errors.task_title && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.task_title.message}</span>}
            </div>
            <div className="form-group">
              <label>Task Description *</label>
              <textarea {...register("task_detail", { required: "Description required" })} className="form-input" style={{ minHeight: 120 }} placeholder="Describe exactly what workers need to do..." />
              {errors.task_detail && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.task_detail.message}</span>}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div className="form-group">
                <label>Workers Needed *</label>
                <input {...register("required_workers", { required: true, min: 1 })} type="number" min="1" className="form-input" placeholder="100" />
              </div>
              <div className="form-group">
                <label>Coins per Worker *</label>
                <input {...register("payable_amount", { required: true, min: 1 })} type="number" min="1" className="form-input" placeholder="10" />
              </div>
            </div>
            {total > 0 && (
              <div style={{ background: total > (dbUser?.coins || 0) ? "rgba(239,68,68,0.1)" : "rgba(245,158,11,0.1)", border: `1px solid ${total > (dbUser?.coins || 0) ? "rgba(239,68,68,0.3)" : "rgba(245,158,11,0.3)"}`, borderRadius: 8, padding: "12px 16px", marginBottom: 16, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.9rem" }}>Total Cost:</span>
                <span style={{ fontFamily: "Syne", fontWeight: 800, color: total > (dbUser?.coins || 0) ? "var(--danger)" : "var(--primary)", fontSize: "1.1rem" }}>🪙 {total} coins</span>
              </div>
            )}
            <div className="form-group">
              <label>Deadline *</label>
              <input {...register("completion_date", { required: "Deadline required" })} type="date" className="form-input" min={new Date().toISOString().split("T")[0]} />
              {errors.completion_date && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.completion_date.message}</span>}
            </div>
            <div className="form-group">
              <label>Submission Instructions *</label>
              <textarea {...register("submission_info", { required: "Required" })} className="form-input" placeholder="What should workers submit? (screenshot, link, etc.)" />
              {errors.submission_info && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.submission_info.message}</span>}
            </div>
            <div className="form-group">
              <label>Task Image (upload)</label>
              <input type="file" accept="image/*" onChange={e => { setImgFile(e.target.files[0]); setImgPreview(URL.createObjectURL(e.target.files[0])); }} className="form-input" />
              {imgPreview && <img src={imgPreview} alt="preview" style={{ width: "100%", height: 120, objectFit: "cover", borderRadius: 8, marginTop: 8 }} />}
            </div>
            {!imgFile && (
              <div className="form-group">
                <label>Or Image URL</label>
                <input {...register("task_image_url")} type="url" className="form-input" placeholder="https://image-url.com/task.jpg" />
              </div>
            )}
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "12px" }}>
              {loading ? "Posting Task..." : `Post Task — Cost 🪙 ${total || 0}`}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddTask;