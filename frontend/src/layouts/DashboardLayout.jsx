import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Menu,
  Users,
  ChevronLeft,
  ChevronRight,
  X,
  Zap,
} from "lucide-react";
import ProfileMenu from "../components/layout/ProfileMenu";

const DashboardLayout = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [isCollapsed, setIsCollapsed] = useState(() => {
    return localStorage.getItem("sidebar_collapsed") === "true";
  });

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const newVal = !prev;
      localStorage.setItem("sidebar_collapsed", String(newVal));
      return newVal;
    });
  };

  const navLinks = [
    { name: "Dashboard", path: "/dashboard", icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: "Workspaces", path: "/projects", icon: <FolderKanban className="w-5 h-5" /> },
    { name: "Teams", path: "/teams", icon: <Users className="w-5 h-5" /> },
    { name: "Tasks", path: "/tasks", icon: <CheckSquare className="w-5 h-5" /> },
  ];

  return (
    <div
      className="h-screen overflow-hidden flex font-sans bg-mesh"
      style={{
        background:
          "radial-gradient(circle at top left, rgba(30,95,255,0.08), transparent 24%), radial-gradient(circle at bottom right, rgba(255,122,26,0.06), transparent 20%), linear-gradient(180deg, #F8FBFF 0%, #F0F4FF 40%, #ECF2FF 100%)",
      }}
    >

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: "rgba(12,27,58,0.55)", backdropFilter: "blur(4px)", animation: "fadeInUp 0.2s ease-out" }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* ═══════ SIDEBAR ═══════ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out
          lg:relative lg:translate-x-0 lg:h-screen
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          ${isCollapsed ? "lg:w-[76px]" : "lg:w-[240px]"} w-[240px] shrink-0`}
        style={{
          background:
            "linear-gradient(180deg, rgba(7,16,34,0.98) 0%, rgba(10,22,45,0.98) 48%, rgba(6,14,29,0.99) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "0 24px 80px rgba(12,27,58,0.24), inset -1px 0 0 rgba(255,255,255,0.05)",
          overflow: "hidden",
        }}
      >
        {/* Decorative glows */}
        <div
          className="absolute top-0 left-0 w-52 h-52 rounded-full pointer-events-none animate-orb"
          style={{
            background: "radial-gradient(circle, rgba(30,95,255,0.16) 0%, rgba(30,95,255,0.08) 42%, transparent 72%)",
            filter: "blur(26px)",
          }}
        />
        <div
          className="absolute bottom-16 right-0 w-36 h-36 rounded-full pointer-events-none animate-orb"
          style={{
            background: "radial-gradient(circle, rgba(255,122,26,0.14) 0%, rgba(255,122,26,0.06) 40%, transparent 72%)",
            filter: "blur(18px)",
            animationDelay: "1.2s",
          }}
        />

        {/* ── Logo Header ── */}
        <div
          className={`h-16 flex items-center shrink-0 relative z-10 transition-all duration-300
            ${isCollapsed ? "justify-between px-4" : "justify-between px-5"}`}
          style={{
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0))",
          }}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, #1E5FFF 0%, #5E87FF 40%, #FF7A1A 135%)",
                boxShadow: "0 10px 22px rgba(30,95,255,0.34)",
              }}
            >
              <Zap className="w-[18px] h-[18px] text-white" />
            </div>
            {!isCollapsed && (
              <div className="min-w-0">
                <span className="text-[17px] font-extrabold tracking-tight text-white truncate block">
                  TaskPilot
                </span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={toggleCollapse}
              className="hidden lg:flex w-7 h-7 rounded-lg items-center justify-center transition-all duration-200 cursor-pointer shrink-0"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.55)",
                boxShadow: "0 8px 18px rgba(0,0,0,0.14)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(30,95,255,0.24)";
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.borderColor = "rgba(30,95,255,0.44)";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.color = "rgba(255,255,255,0.55)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.12)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
              title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>

            <button
              className="lg:hidden w-7 h-7 rounded-lg flex items-center justify-center cursor-pointer"
              style={{
                background: "rgba(255,255,255,0.08)",
                color: "rgba(255,255,255,0.62)",
                border: "1px solid rgba(255,255,255,0.08)",
              }}
              onClick={() => setIsSidebarOpen(false)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ── Navigation ── */}
        <nav className={`flex-1 overflow-y-auto py-5 space-y-5 relative z-10 transition-all duration-300
          ${isCollapsed ? "px-2.5" : "px-3"}`}
        >
          {!isCollapsed && (
            <p style={{ fontSize: "10px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: "rgba(255,255,255,0.2)", padding: "0 12px", marginBottom: "8px" }}>
              Menu
            </p>
          )}

          {navLinks.map((link, idx) => {
            const isActive = location.pathname.startsWith(link.path);
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsSidebarOpen(false)}
                title={isCollapsed ? link.name : ""}
                className="animate-fade-in-left"
                style={{
                  animationDelay: `${idx * 50}ms`,
                  display: "flex",
                  alignItems: "center",
                  gap: isCollapsed ? "0" : "12px",
                  justifyContent: isCollapsed ? "center" : "flex-start",
                  padding: isCollapsed ? "12px" : "11px 12px",
                  borderRadius: "14px",
                  fontWeight: 600,
                  fontSize: "14px",
                  textDecoration: "none",
                  position: "relative",
                  transition: "all 0.22s ease",
                  transform: "translateY(0)",
                  background: isActive
                    ? "linear-gradient(135deg, rgba(30,95,255,0.24), rgba(255,122,26,0.09))"
                    : "rgba(255,255,255,0.03)",
                  border: isActive ? "1px solid rgba(120,160,255,0.28)" : "1px solid rgba(255,255,255,0.05)",
                  color: isActive ? "#FFFFFF" : "rgba(255,255,255,0.58)",
                  boxShadow: isActive
                    ? "0 14px 30px rgba(30,95,255,0.16), inset 0 1px 0 rgba(255,255,255,0.08)"
                    : "0 1px 0 rgba(255,255,255,0.02)",
                  backdropFilter: "blur(14px)",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "#fff";
                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.12)";
                    e.currentTarget.style.transform = "translateX(3px)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = "rgba(255,255,255,0.03)";
                    e.currentTarget.style.color = "rgba(255,255,255,0.58)";
                    e.currentTarget.style.border = "1px solid rgba(255,255,255,0.05)";
                    e.currentTarget.style.transform = "translateX(0)";
                  }
                }}
              >
                {/* Left active accent bar */}
                {isActive && (
                  <div style={{
                    position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                    width: "3px", height: "62%", borderRadius: "0 4px 4px 0",
                    background: "linear-gradient(180deg, #FF7A1A, #1E5FFF)",
                  }} />
                )}

                {/* Orange dot indicator */}
                {isActive && !isCollapsed && (
                  <div style={{
                    position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                    width: "6px", height: "6px", borderRadius: "50%",
                    background: "#FF7A1A", boxShadow: "0 0 8px rgba(255,122,26,0.6)",
                  }} />
                )}

                <div style={{ flexShrink: 0, filter: isActive ? "drop-shadow(0 0 10px rgba(255,255,255,0.12))" : "none" }}>{link.icon}</div>
                {!isCollapsed && <span className="truncate">{link.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* ═══════ MAIN CONTENT AREA ═══════ */}
      <div className="flex-1 flex flex-col min-w-0" style={{ background: "#F0F4FF" }}>
        {/* Mobile header */}
        <header
          className="lg:hidden h-14 flex items-center justify-between px-4 shrink-0 z-20"
          style={{
            background: "rgba(255,255,255,0.88)",
            borderBottom: "1px solid rgba(216,227,255,0.9)",
            boxShadow: "0 12px 28px rgba(30,95,255,0.08)",
            backdropFilter: "blur(18px) saturate(150%)",
          }}
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg, #1E5FFF 0%, #5E87FF 42%, #FF7A1A 135%)" }}
            >
              <Zap className="w-4 h-4 text-white" />
            </div>
            <span style={{ fontSize: "16px", fontWeight: 700, color: "#0C1B3A" }}>TaskPilot</span>
          </div>
          <div className="flex items-center gap-2">
            <ProfileMenu className="shrink-0" />
            <button
              onClick={() => setIsSidebarOpen(true)}
              style={{
                width: "36px", height: "36px", borderRadius: "12px",
                display: "flex", alignItems: "center", justifyContent: "center",
                background: "linear-gradient(135deg, rgba(30,95,255,0.08), rgba(255,122,26,0.08))",
                border: "1px solid rgba(216,227,255,0.9)", color: "#1E5FFF",
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(30,95,255,0.06)",
              }}
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="flex-1 flex flex-col overflow-y-auto min-h-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
