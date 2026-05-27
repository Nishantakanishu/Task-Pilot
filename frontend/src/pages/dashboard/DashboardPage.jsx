import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import StatCard from "../../components/dashboard/StatCard";
import RecentTasksList from "../../components/dashboard/RecentTasksList";
import OverdueAlert from "../../components/dashboard/OverdueAlert";
import ProfileMenu from "../../components/layout/ProfileMenu";
import { Link } from "react-router-dom";
import { FolderKanban, ClipboardList, CheckCircle2, Clock3, Users2, ArrowRight, Sparkles, TrendingUp } from "lucide-react";

const DashboardPage = () => {
  const { user, isAdmin } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setData(res.data.data);
      } catch (err) {
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
        {/* Skeleton Header */}
        <div style={{
          background: "#fff", borderBottom: "1.5px solid #D8E3FF",
          padding: "24px 32px",
        }}>
          <div className="skeleton" style={{ height: "32px", width: "240px", marginBottom: "8px" }} />
          <div className="skeleton" style={{ height: "16px", width: "320px" }} />
        </div>
        {/* Skeleton Cards */}
        <div style={{ flex: 1, padding: "24px 32px" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "20px", marginBottom: "32px" }}>
            {[...Array(4)].map((_, i) => (
              <div key={i} className="skeleton" style={{ height: "140px", borderRadius: "20px" }} />
            ))}
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
            <div className="skeleton" style={{ height: "280px", borderRadius: "20px" }} />
            <div className="skeleton" style={{ height: "280px", borderRadius: "20px" }} />
          </div>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div style={{
        display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
        padding: "96px 24px", textAlign: "center",
      }}>
        <p style={{ color: "#5B6B8A", fontWeight: 500 }}>Failed to load dashboard.</p>
        <button
          onClick={() => window.location.reload()}
          className="btn-primary"
          style={{ marginTop: "16px", padding: "10px 20px", fontSize: "14px" }}
        >
          Retry
        </button>
      </div>
    );
  }

  const { stats, recentTasks, overdueTasksList, activeProjects, activeTeams } = data;

  const statCards = [];
  if (isAdmin) {
    statCards.push({
      title: "Total Workspaces", value: stats.totalProjects,
      icon: <FolderKanban style={{ width: 20, height: 20 }} />,
      gradient: "linear-gradient(135deg, #1E5FFF, #60A5FA)",
    });
  }
  statCards.push(
    {
      title: isAdmin ? "Total Teams" : "Your Teams", value: stats.totalTeams,
      icon: <Users2 style={{ width: 20, height: 20 }} />,
      gradient: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
    },
    {
      title: isAdmin ? "Total Tasks" : "Assigned Tasks", value: stats.totalTasks,
      icon: <ClipboardList style={{ width: 20, height: 20 }} />,
      gradient: "linear-gradient(135deg, #FF7A1A, #FCD34D)",
    },
    {
      title: "Completed", value: stats.completedTasks,
      icon: <CheckCircle2 style={{ width: 20, height: 20 }} />,
      gradient: "linear-gradient(135deg, #059669, #34D399)",
    },
    {
      title: "Pending", value: stats.pendingTasks,
      icon: <Clock3 style={{ width: 20, height: 20 }} />,
      gradient: "linear-gradient(135deg, #EC4899, #F9A8D4)",
    }
  );

  const colClass = isAdmin
    ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5"
    : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4";

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>

      {/* ── Header ── */}
      <div
        className="animate-fade-in-down"
        style={{
          background: "#ffffff",
          borderBottom: "1.5px solid #D8E3FF",
          padding: "24px 32px",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          position: "relative", overflow: "visible", flexShrink: 0,
          boxShadow: "0 2px 16px rgba(30,95,255,0.04)",
          zIndex: 10,
        }}
      >
        {/* Header orb */}
        <div style={{
          position: "absolute", top: "-40px", right: "60px",
          width: "120px", height: "120px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30,95,255,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-30px", right: "200px",
          width: "80px", height: "80px", borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,122,26,0.05) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
            <h1 style={{ fontSize: "24px", fontWeight: 800, color: "#0C1B3A", letterSpacing: "-0.03em" }}>
              Welcome back, <span className="gradient-text">{user?.name.split(" ")[0]}</span>!
            </h1>
            <Sparkles style={{ width: 22, height: 22, color: "#FF7A1A" }} className="animate-float" />
          </div>
          <p style={{ fontSize: "14px", color: "#5B6B8A", fontWeight: 500 }}>
            {isAdmin ? "Here's an overview of your team's work." : "Here's a summary of your assigned tasks."}
          </p>
        </div>

        <div style={{
          display: "flex", alignItems: "center", gap: "10px",
          position: "relative", zIndex: 1,
        }}>
          <div style={{
            display: "flex", alignItems: "center", gap: "8px",
            padding: "8px 16px",
            background: "#EBF0FF", border: "1px solid #D8E3FF",
            borderRadius: "12px",
          }}>
            <TrendingUp style={{ width: 16, height: 16, color: "#1E5FFF" }} />
            <span style={{ fontSize: "12px", fontWeight: 600, color: "#1E5FFF" }}>Live Dashboard</span>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: "#059669",
              boxShadow: "0 0 6px #059669",
              animation: "bounceDot 1.4s ease-in-out infinite",
            }} />
          </div>
          <ProfileMenu />
        </div>
      </div>

      {/* ── Content ── */}
      <div className="flex-1 px-6 lg:px-12 py-8 max-w-7xl mx-auto w-full">
        {/* Stats Grid */}
        <div className={`grid ${colClass} gap-8`} style={{ marginBottom: "32px" }}>
          {statCards.map((card, i) => (
            <StatCard
              key={card.title}
              title={card.title}
              value={card.value}
              icon={card.icon}
              gradient={card.gradient}
              delay={i * 80}
            />
          ))}
        </div>

        {/* Main Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px" }}
          className="lg:!grid-cols-[2fr_1fr]"
        >
          {/* Left column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            <RecentTasksList tasks={recentTasks} />
            <OverdueAlert tasks={overdueTasksList} />
          </div>

          {/* Right column */}
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Active Workspaces */}
            <div
              className="card-hover animate-fade-in-right"
              style={{
                background: "#fff", border: "1.5px solid #D8E3FF",
                borderRadius: "20px", padding: "24px",
                boxShadow: "0 2px 16px rgba(12,27,58,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "10px",
                    background: "linear-gradient(135deg, #FF7A1A, #FCD34D)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: "0 2px 8px rgba(255,122,26,0.3)",
                  }}>
                    <FolderKanban style={{ width: 16, height: 16, color: "#fff" }} />
                  </div>
                  <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0C1B3A", letterSpacing: "-0.01em" }}>Active Workspaces</h2>
                </div>
                <Link to="/projects" style={{
                  display: "flex", alignItems: "center", gap: "4px",
                  fontSize: "12px", fontWeight: 600, color: "#FF7A1A", textDecoration: "none",
                  padding: "4px 10px", borderRadius: "8px", transition: "background 0.2s",
                }}
                  onMouseEnter={e => e.currentTarget.style.background = "#FFF3E8"}
                  onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                >
                  View All <ArrowRight style={{ width: 12, height: 12 }} />
                </Link>
              </div>
              {activeProjects && activeProjects.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {activeProjects.map((p, idx) => (
                    <Link key={p._id} to={`/projects/${p._id}`}
                      className="animate-fade-in-up"
                      style={{
                        animationDelay: `${idx * 50}ms`,
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "10px 12px", borderRadius: "12px",
                        textDecoration: "none", transition: "all 0.2s",
                        background: "transparent",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#FFF3E8"; e.currentTarget.style.transform = "translateX(4px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateX(0)"; }}
                    >
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "10px",
                        background: "#FFF3E8", border: "1px solid #FFD4A8",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <FolderKanban style={{ width: 14, height: 14, color: "#FF7A1A" }} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#0C1B3A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.title}</p>
                        <p style={{ fontSize: "11px", color: "#5B6B8A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          Created {new Date(p.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: "center", padding: "24px",
                  fontSize: "13px", color: "#5B6B8A",
                  border: "1.5px dashed #D8E3FF", borderRadius: "14px",
                  background: "#F8FAFF",
                }}>
                  No active workspaces found
                </div>
              )}
            </div>

            {/* Active Teams */}
            <div
              className="card-hover animate-fade-in-right delay-200"
              style={{
                background: "#fff", border: "1.5px solid #D8E3FF",
                borderRadius: "20px", padding: "24px",
                boxShadow: "0 2px 16px rgba(12,27,58,0.06)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                <div style={{
                  width: "32px", height: "32px", borderRadius: "10px",
                  background: "linear-gradient(135deg, #8B5CF6, #A78BFA)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 8px rgba(139,92,246,0.3)",
                }}>
                  <Users2 style={{ width: 16, height: 16, color: "#fff" }} />
                </div>
                <h2 style={{ fontSize: "15px", fontWeight: 700, color: "#0C1B3A", letterSpacing: "-0.01em" }}>Active Teams</h2>
              </div>
              {activeTeams && activeTeams.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  {activeTeams.map((t, idx) => (
                    <Link key={t._id} to={`/projects/${t.project?._id || t.project}/teams/${t._id}`}
                      className="animate-fade-in-up"
                      style={{
                        animationDelay: `${idx * 50}ms`,
                        display: "flex", alignItems: "center", gap: "12px",
                        padding: "10px 12px", borderRadius: "12px",
                        textDecoration: "none", transition: "all 0.2s",
                        background: "transparent",
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#F5F3FF"; e.currentTarget.style.transform = "translateX(4px)"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.transform = "translateX(0)"; }}
                    >
                      <div style={{
                        width: "32px", height: "32px", borderRadius: "10px",
                        background: "#F5F3FF", border: "1px solid #DDD6FE",
                        display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                      }}>
                        <Users2 style={{ width: 14, height: 14, color: "#8B5CF6" }} />
                      </div>
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: "13px", fontWeight: 600, color: "#0C1B3A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.name}</p>
                        <p style={{ fontSize: "11px", color: "#5B6B8A", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.project?.title}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div style={{
                  textAlign: "center", padding: "24px",
                  fontSize: "13px", color: "#5B6B8A",
                  border: "1.5px dashed #D8E3FF", borderRadius: "14px",
                  background: "#F8FAFF",
                }}>
                  No active teams found
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
