import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import axiosSecure from "../../../hooks/useAxiosSecure";

const TaskList = () => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: () => axiosSecure.get("/tasks").then(r => r.data),
  });

  if (isLoading) return <div style={{ display: "flex", justifyContent: "center", padding: 60 }}><span className="loading-spinner" /></div>;

  return (
    <div className="animate-fadeInUp">
      <h1 className="page-title">Available Tasks</h1>
      <p style={{ color: "var(--text-muted)", marginBottom: 32, marginTop: -16 }}>{tasks.length} tasks available — pick one and start earning!</p>

      {tasks.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "60px" }}>
          <p style={{ fontSize: "3rem", marginBottom: 12 }}>🔍</p>
          <p style={{ color: "var(--text-muted)" }}>No tasks available right now. Check back soon!</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {tasks.map(task => (
            <div key={task._id} className="card card-hover" style={{ display: "flex", flexDirection: "column" }}>
              {task.task_image_url && (
                <img src={task.task_image_url} alt={task.task_title} style={{ width: "100%", height: 140, objectFit: "cover", borderRadius: 8, marginBottom: 16 }} onError={e => e.target.style.display = "none"} />
              )}
              <h3 style={{ fontFamily: "Syne", fontWeight: 700, fontSize: "1rem", marginBottom: 12, lineHeight: 1.4 }}>{task.task_title}</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 16, flex: 1 }}>
                {[["Buyer", task.buyer_name], ["Workers Needed", task.required_workers], ["Deadline", new Date(task.completion_date).toLocaleDateString()]].map(([label, val], i) => (
                  <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem" }}>
                    <span style={{ color: "var(--text-muted)" }}>{label}</span>
                    <span style={{ fontWeight: 600 }}>{val}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div className="coin-badge">🪙 {task.payable_amount} coins</div>
                <Link to={`/dashboard/task-details/${task._id}`}>
                  <button className="btn-primary" style={{ padding: "8px 18px", fontSize: "0.85rem" }}>View Details →</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskList;