import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import uploadImage from "../../utils/uploadImage";
import { FiUser, FiMail, FiLock, FiImage, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const API = import.meta.env.VITE_API_URL;

const Register = () => {
  const { register: firebaseRegister, updateUser, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const handleImgChange = (e) => {
    const file = e.target.files[0];
    if (file) { setImgFile(file); setImgPreview(URL.createObjectURL(file)); }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      let photoURL = data.photoURL || "";
      if (imgFile) { try { photoURL = await uploadImage(imgFile); } catch (_) {} }
      await firebaseRegister(data.email, data.password);
      await updateUser(data.name, photoURL);
      await axios.post(`${API}/users`, { name: data.name, email: data.email, photo: photoURL, role: data.role });
      const tokenRes = await axios.post(`${API}/jwt`, { email: data.email });
      localStorage.setItem("coinflow-token", tokenRes.data.token);
      toast.success(`Welcome ${data.name}! You got ${data.role === "buyer" ? 50 : 10} coins!`);
      navigate(data.role === "buyer" ? "/dashboard/buyer-home" : "/dashboard/worker-home");
    } catch (err) {
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    try {
      const result = await googleLogin();
      const u = result.user;
      await axios.post(`${API}/users`, { name: u.displayName, email: u.email, photo: u.photoURL, role: "worker" });
      const tokenRes = await axios.post(`${API}/jwt`, { email: u.email });
      localStorage.setItem("coinflow-token", tokenRes.data.token);
      toast.success("Welcome!");
      navigate("/dashboard/worker-home");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "radial-gradient(ellipse at top, rgba(245,158,11,0.05) 0%, transparent 60%)" }}>
      <div style={{ width: "100%", maxWidth: 480 }}>
        <div className="card animate-fadeInUp">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: "16px", background: "linear-gradient(135deg, var(--primary), var(--accent))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", margin: "0 auto 16px", color: "white" }}>C</div>
            <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.75rem" }}>Create Account</h1>
            <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: "0.9rem" }}>Join CoinFlow and start earning today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div style={{ display: "flex", justifyContent: "center", marginBottom: 24 }}>
              <label htmlFor="img-upload" style={{ cursor: "pointer", textAlign: "center" }}>
                <div style={{ width: 80, height: 80, borderRadius: "50%", border: "2px dashed var(--border)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", background: "var(--bg-card2)" }}>
                  {imgPreview ? <img src={imgPreview} alt="preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <FiImage style={{ color: "var(--text-muted)", fontSize: "1.5rem" }} />}
                </div>
                <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: 6 }}>Upload Photo</p>
                <input id="img-upload" type="file" accept="image/*" onChange={handleImgChange} style={{ display: "none" }} />
              </label>
            </div>

            <div className="form-group">
              <label>Profile Picture URL (optional)</label>
              <div style={{ position: "relative" }}>
                <FiImage style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input {...register("photoURL")} type="url" className="form-input" placeholder="https://..." style={{ paddingLeft: 40 }} />
              </div>
            </div>

            <div className="form-group">
              <label>Full Name *</label>
              <div style={{ position: "relative" }}>
                <FiUser style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input {...register("name", { required: "Name is required" })} className="form-input" placeholder="John Doe" style={{ paddingLeft: 40 }} />
              </div>
              {errors.name && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.name.message}</span>}
            </div>

            <div className="form-group">
              <label>Email Address *</label>
              <div style={{ position: "relative" }}>
                <FiMail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" } })} className="form-input" placeholder="you@example.com" style={{ paddingLeft: 40 }} />
              </div>
              {errors.email && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Password *</label>
              <div style={{ position: "relative" }}>
                <FiLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input {...register("password", { required: "Password is required", minLength: { value: 6, message: "Minimum 6 characters" }, pattern: { value: /(?=.*[A-Z])(?=.*[0-9])/, message: "Must have uppercase & number" } })} type={showPass ? "text" : "password"} className="form-input" placeholder="••••••••" style={{ paddingLeft: 40, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.password.message}</span>}
            </div>

            <div className="form-group">
              <label>I want to *</label>
              <select {...register("role", { required: true })} className="form-input">
                <option value="worker">Work & Earn (10 coins free)</option>
                <option value="buyer">Post Tasks (50 coins free)</option>
              </select>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "0.95rem", marginTop: 8 }}>
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "20px 0" }}>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
            <span style={{ color: "var(--text-muted)", fontSize: "0.8rem" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "var(--border)" }} />
          </div>

          <button onClick={handleGoogle} className="btn-secondary" style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "center", gap: 10, padding: "12px" }}>
            <FcGoogle style={{ fontSize: "1.2rem" }} /> Continue with Google
          </button>

          <p style={{ textAlign: "center", marginTop: 20, color: "var(--text-muted)", fontSize: "0.875rem" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;