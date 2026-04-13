import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../../context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { FiMail, FiLock, FiEye, FiEyeOff } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const API = import.meta.env.VITE_API_URL;

const Login = () => {
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard/worker-home";
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      await login(data.email, data.password);
      const tokenRes = await axios.post(`${API}/jwt`, { email: data.email });
      localStorage.setItem("coinflow-token", tokenRes.data.token);
      toast.success("Welcome back!");
      navigate(from, { replace: true });
    } catch {
      toast.error("Invalid email or password");
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
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", background: "radial-gradient(ellipse at top, rgba(6,182,212,0.05) 0%, transparent 60%)" }}>
      <div style={{ width: "100%", maxWidth: 440 }}>
        <div className="card animate-fadeInUp">
          <div style={{ textAlign: "center", marginBottom: 32 }}>
            <div style={{ width: 56, height: 56, borderRadius: "16px", background: "linear-gradient(135deg, var(--accent), var(--primary))", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", margin: "0 auto 16px" }}>🔑</div>
            <h1 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "1.75rem" }}>Welcome Back</h1>
            <p style={{ color: "var(--text-muted)", marginTop: 6, fontSize: "0.9rem" }}>Sign in to your CoinFlow account</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Email Address</label>
              <div style={{ position: "relative" }}>
                <FiMail style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input {...register("email", { required: "Email required", pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email" } })} className="form-input" placeholder="you@example.com" style={{ paddingLeft: 40 }} />
              </div>
              {errors.email && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.email.message}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: "relative" }}>
                <FiLock style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
                <input {...register("password", { required: "Password required" })} type={showPass ? "text" : "password"} className="form-input" placeholder="••••••••" style={{ paddingLeft: 40, paddingRight: 40 }} />
                <button type="button" onClick={() => setShowPass(!showPass)} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)" }}>
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <span style={{ color: "var(--danger)", fontSize: "0.8rem" }}>{errors.password.message}</span>}
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "12px", fontSize: "0.95rem", marginTop: 8 }}>
              {loading ? "Signing In..." : "Sign In"}
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
            Don't have an account?{" "}
            <Link to="/register" style={{ color: "var(--primary)", fontWeight: 700, textDecoration: "none" }}>Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;