import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import axios from "axios";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

const API = import.meta.env.VITE_API_URL;

const slides = [
  {
    heading: "Earn Money Completing Micro Tasks",
    subheading: "Join thousands of workers earning coins daily. Complete tasks, get paid fast.",
    cta: "Start Earning",
    accent: "#f59e0b",
  },
  {
    heading: "Post Tasks, Get Results Fast",
    subheading: "Buyers can create tasks and have them completed by our global workforce in hours.",
    cta: "Post a Task",
    accent: "#06b6d4",
  },
  {
    heading: "Trusted Platform, Secure Payments",
    subheading: "Every transaction is secure. Withdraw your earnings anytime via multiple payment methods.",
    cta: "Register Now",
    accent: "#8b5cf6",
  },
];

const testimonials = [
  { name: "Sarah Johnson", role: "Freelancer", text: "CoinFlow changed my life! I earn extra income completing small tasks in my free time. The withdrawal system is super fast.", img: "https://randomuser.me/api/portraits/women/44.jpg" },
  { name: "Marcus Lee", role: "Content Creator", text: "As a buyer, I get quality task completions quickly. The platform is reliable and the workers are dedicated.", img: "https://randomuser.me/api/portraits/men/32.jpg" },
  { name: "Priya Sharma", role: "Student", text: "I started using CoinFlow to earn pocket money. Now I make more than my part-time job! Highly recommend.", img: "https://randomuser.me/api/portraits/women/65.jpg" },
  { name: "Ahmed Hassan", role: "Digital Marketer", text: "The task quality is excellent. I use CoinFlow to grow my social media accounts and the results are amazing.", img: "https://randomuser.me/api/portraits/men/75.jpg" },
];

const stats = [
  { value: "50K+", label: "Active Workers" },
  { value: "$2M+", label: "Total Paid Out" },
  { value: "1M+", label: "Tasks Completed" },
  { value: "99%", label: "Satisfaction Rate" },
];

const howItWorks = [
  { step: "01", title: "Create Account", desc: "Sign up as a Worker or Buyer in under 60 seconds. Get coins instantly on registration.", icon: "👤" },
  { step: "02", title: "Browse Tasks", desc: "Workers browse available tasks. Buyers post tasks with clear instructions and rewards.", icon: "🔍" },
  { step: "03", title: "Complete & Earn", desc: "Submit completed tasks for review. Get approved and watch your coin balance grow.", icon: "✅" },
  { step: "04", title: "Withdraw Earnings", desc: "Convert your coins to real money. Withdraw via multiple payment methods instantly.", icon: "💰" },
];

const categories = [
  { icon: "📱", name: "Social Media", count: "2,341 tasks" },
  { icon: "✍️", name: "Content Writing", count: "1,892 tasks" },
  { icon: "🎥", name: "Video Reviews", count: "987 tasks" },
  { icon: "⭐", name: "App Reviews", count: "3,210 tasks" },
  { icon: "🔍", name: "Data Entry", count: "1,456 tasks" },
  { icon: "🌐", name: "Web Research", count: "2,780 tasks" },
];

const Home = () => {
  const { data: topWorkers = [] } = useQuery({
    queryKey: ["top-workers"],
    queryFn: () => axios.get(`${API}/users/top-workers`).then(r => r.data),
  });

  return (
    <div>
      {/* HERO */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <Swiper
          modules={[Autoplay, Pagination, EffectFade]}
          effect="fade"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          loop
          style={{ height: "90vh", minHeight: 500 }}
        >
          {slides.map((slide, i) => (
            <SwiperSlide key={i}>
              <div style={{
                height: "100%",
                background: "linear-gradient(135deg, #0a0f1e 0%, #1a2744 50%, #0a0f1e 100%)",
                display: "flex", alignItems: "center", justifyContent: "center",
                textAlign: "center", padding: "0 24px", position: "relative", overflow: "hidden",
              }}>
                <div style={{
                  position: "absolute", width: 600, height: 600, borderRadius: "50%",
                  border: `1px solid ${slide.accent}22`,
                  top: "50%", left: "50%", transform: "translate(-50%,-50%)",
                }} />
                <div style={{ position: "relative", zIndex: 1, maxWidth: 700 }}>
                  <div style={{
                    display: "inline-block", background: `${slide.accent}22`,
                    color: slide.accent, padding: "6px 16px", borderRadius: 999,
                    fontSize: "0.8rem", fontWeight: 700, marginBottom: 20,
                    border: `1px solid ${slide.accent}44`, fontFamily: "Syne",
                  }}>
                    🚀 #1 Micro-Tasking Platform
                  </div>
                  <h1 style={{
                    fontFamily: "Syne", fontWeight: 800,
                    fontSize: "clamp(2rem, 5vw, 3.5rem)",
                    lineHeight: 1.1, marginBottom: 20, color: "white",
                  }}>{slide.heading}</h1>
                  <p style={{
                    color: "rgba(255,255,255,0.7)",
                    fontSize: "clamp(1rem, 2vw, 1.2rem)",
                    marginBottom: 36, maxWidth: 500, margin: "0 auto 36px",
                  }}>{slide.subheading}</p>
                  <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                    <Link to="/register">
                      <button style={{
                        background: slide.accent, color: "#0a0f1e",
                        fontFamily: "Syne", fontWeight: 800, fontSize: "1rem",
                        padding: "14px 32px", borderRadius: 12, border: "none", cursor: "pointer",
                      }}>{slide.cta} →</button>
                    </Link>
                    <Link to="/login">
                      <button style={{
                        background: "transparent", color: "white",
                        fontFamily: "Syne", fontWeight: 700, fontSize: "1rem",
                        padding: "14px 32px", borderRadius: 12,
                        border: "1px solid rgba(255,255,255,0.3)", cursor: "pointer",
                      }}>Sign In</button>
                    </Link>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* STATS */}
      <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: 24, textAlign: "center" }}>
          {stats.map((s, i) => (
            <div key={i}>
              <p style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "2rem", color: "var(--primary)" }}>{s.value}</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TOP WORKERS */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ color: "var(--primary)", fontFamily: "Syne", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: 8 }}>LEADERBOARD</p>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>Top Earning Workers</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 20 }}>
          {topWorkers.length === 0
            ? Array(6).fill(0).map((_, i) => (
              <div key={i} className="card" style={{ textAlign: "center", padding: "24px 16px" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "var(--bg-card2)", margin: "0 auto 12px" }} />
                <div style={{ height: 12, background: "var(--bg-card2)", borderRadius: 4, margin: "0 auto 8px", width: "70%" }} />
              </div>
            ))
            : topWorkers.map((w, i) => (
              <div key={w._id} className="card card-hover" style={{ textAlign: "center", padding: "24px 16px", position: "relative" }}>
                {i < 3 && (
                  <div style={{
                    position: "absolute", top: -10, right: -10, width: 28, height: 28,
                    borderRadius: "50%", background: i === 0 ? "#f59e0b" : i === 1 ? "#9ca3af" : "#cd7f32",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: "0.75rem", fontWeight: 800, color: "#0a0f1e",
                  }}>#{i + 1}</div>
                )}
                <img
                  src={w.photo || `https://ui-avatars.com/api/?name=${w.name}&background=f59e0b&color=000`}
                  alt={w.name}
                  style={{ width: 64, height: 64, borderRadius: "50%", objectFit: "cover", border: "3px solid var(--primary)", marginBottom: 12 }}
                />
                <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.9rem", marginBottom: 8 }}>{w.name}</p>
                <div className="coin-badge" style={{ fontSize: "0.75rem" }}>🪙 {w.coins}</div>
              </div>
            ))
          }
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "var(--accent)", fontFamily: "Syne", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: 8 }}>PROCESS</p>
            <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>How CoinFlow Works</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 24 }}>
            {howItWorks.map((step, i) => (
              <div key={i} className="card" style={{ position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: -10, right: -10, fontFamily: "Syne", fontWeight: 800, fontSize: "4rem", color: "rgba(245,158,11,0.05)", lineHeight: 1 }}>{step.step}</div>
                <div style={{ fontSize: "2rem", marginBottom: 16 }}>{step.icon}</div>
                <h3 style={{ fontFamily: "Syne", fontWeight: 700, marginBottom: 10, fontSize: "1.05rem" }}>{step.title}</h3>
                <p style={{ color: "var(--text-muted)", fontSize: "0.875rem", lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORIES */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 48 }}>
          <p style={{ color: "var(--primary)", fontFamily: "Syne", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: 8 }}>EXPLORE</p>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>Browse Task Categories</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 16 }}>
          {categories.map((cat, i) => (
            <div key={i} className="card card-hover" style={{ textAlign: "center", cursor: "pointer" }}>
              <div style={{ fontSize: "2rem", marginBottom: 10 }}>{cat.icon}</div>
              <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.9rem", marginBottom: 6 }}>{cat.name}</p>
              <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{cat.count}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border)", padding: "80px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ color: "var(--accent)", fontFamily: "Syne", fontWeight: 700, fontSize: "0.85rem", letterSpacing: "0.1em", marginBottom: 8 }}>TESTIMONIALS</p>
            <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}>What Our Community Says</h2>
          </div>
          <Swiper modules={[Autoplay, Pagination]} autoplay={{ delay: 3500 }} pagination={{ clickable: true }} loop spaceBetween={24} breakpoints={{ 640: { slidesPerView: 2 } }}>
            {testimonials.map((t, i) => (
              <SwiperSlide key={i}>
                <div className="card" style={{ marginBottom: 40 }}>
                  <p style={{ fontSize: "2rem", marginBottom: 12, color: "var(--primary)" }}>"</p>
                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.7, marginBottom: 20, fontStyle: "italic" }}>{t.text}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <img src={t.img} alt={t.name} style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover" }} />
                    <div>
                      <p style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "0.9rem" }}>{t.name}</p>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.75rem" }}>{t.role}</p>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 600, margin: "0 auto" }}>
          <h2 style={{ fontFamily: "Syne", fontWeight: 800, fontSize: "clamp(1.75rem, 3vw, 2.5rem)", marginBottom: 16 }}>Ready to Start Earning?</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 32, fontSize: "1.05rem" }}>Join over 50,000 workers and buyers. Register now and get free coins!</p>
          <Link to="/register">
            <button className="btn-primary" style={{ fontSize: "1rem", padding: "14px 36px" }}>Create Free Account →</button>
          </Link>
        </div>
      </section>

      <style>{`
        .swiper-pagination-bullet { background: rgba(255,255,255,0.4) !important; }
        .swiper-pagination-bullet-active { background: var(--primary) !important; }
      `}</style>
    </div>
  );
};

export default Home;