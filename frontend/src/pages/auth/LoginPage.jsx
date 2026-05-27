import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LayoutDashboard,
  Loader2,
  Shield,
  Sparkles,
  Zap,
} from "lucide-react";

import { loginSchema } from "../../validations/auth.validation";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";

const features = [
  {
    Icon: LayoutDashboard,
    title: "Everything in one beautiful cockpit",
    text: "Projects, tasks, and team updates stay visible in one workspace.",
  },
  {
    Icon: Shield,
    title: "Secure access by default",
    text: "Protected sessions and role-based access keep things calm.",
  },
  {
    Icon: Zap,
    title: "Move fast without losing clarity",
    text: "Sign in fast and keep momentum across the team.",
  },
];

const metrics = [
  { value: "24", label: "Tasks in motion", accent: "blue" },
  { value: "98%", label: "On-time delivery", accent: "orange" },
  { value: "12", label: "Team members", accent: "white" },
];

const MetricTile = ({ value, label, accent }) => {
  const tone =
    accent === "orange"
      ? {
          background: "linear-gradient(135deg, rgba(255,122,26,0.18), rgba(255,255,255,0.12))",
          border: "1px solid rgba(255,255,255,0.18)",
        }
      : accent === "white"
        ? {
            background: "linear-gradient(135deg, rgba(255,255,255,0.26), rgba(255,255,255,0.08))",
            border: "1px solid rgba(255,255,255,0.16)",
          }
        : {
            background: "linear-gradient(135deg, rgba(30,95,255,0.22), rgba(255,255,255,0.08))",
            border: "1px solid rgba(120,160,255,0.3)",
          };

  return (
    <div
      style={{
        borderRadius: 18,
        padding: 16,
        minHeight: 112,
        boxShadow: "0 14px 32px rgba(12,27,58,0.18)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        ...tone,
      }}
    >
      <div
        style={{
          fontSize: 28,
          fontWeight: 800,
          lineHeight: 1,
          letterSpacing: "-0.04em",
          color: "#FFFFFF",
          marginBottom: 10,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "rgba(255,255,255,0.82)",
        }}
      >
        {label}
      </div>
    </div>
  );
};

const FeatureRow = ({ Icon, title, text }) => (
  <div
    className="animate-fade-in-up"
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 14,
      padding: "12px 14px",
      borderRadius: 16,
      background: "rgba(255,255,255,0.06)",
      border: "1px solid rgba(255,255,255,0.08)",
      boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)",
    }}
  >
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 14,
        flexShrink: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, rgba(30,95,255,0.2), rgba(255,122,26,0.16))",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "#FFFFFF",
        boxShadow: "0 10px 20px rgba(30,95,255,0.16)",
      }}
    >
      <Icon size={17} />
    </div>
    <div>
      <div
        style={{
          color: "#FFFFFF",
          fontSize: 14,
          fontWeight: 700,
          marginBottom: 3,
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: "rgba(226,235,255,0.82)",
          fontSize: 13,
          lineHeight: 1.55,
        }}
      >
        {text}
      </div>
    </div>
  </div>
);

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (formData) => {
    setIsLoading(true);

    try {
      const { data } = await api.post("/auth/login", formData);
      login(data.data.user, data.data.token);
      toast.success(`Welcome back, ${data.data.user?.name?.split(" ")[0] || "there"}!`);
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (name) => ({
    width: "100%",
    padding: "13px 15px",
    paddingRight: name === "password" ? 44 : 15,
    borderRadius: 12,
    border: `1.5px solid ${errors[name] ? "rgba(249,115,22,0.6)" : "rgba(184,204,255,0.95)"}`,
    background: errors[name] ? "rgba(255,247,237,0.92)" : "rgba(255,255,255,0.96)",
    color: "#0C1B3A",
    fontSize: 14,
    fontWeight: 500,
    outline: "none",
    boxShadow:
      focused === name
        ? "0 0 0 4px rgba(30,95,255,0.12), 0 12px 30px rgba(30,95,255,0.08)"
        : "inset 0 1px 0 rgba(255,255,255,0.65)",
    transition: "all 0.22s ease",
    boxSizing: "border-box",
  });

  return (
    <div
      className="page-shell"
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        background:
          "radial-gradient(circle at 18% 20%, rgba(30,95,255,0.16), transparent 26%), radial-gradient(circle at 82% 14%, rgba(255,122,26,0.14), transparent 22%), linear-gradient(135deg, #f7faff 0%, #edf3ff 46%, #fff8f0 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(30,95,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(30,95,255,0.06) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          opacity: 0.35,
          pointerEvents: "none",
        }}
      />

      <div
        className="animate-orb"
        style={{
          position: "absolute",
          top: -120,
          left: -100,
          width: 360,
          height: 360,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(30,95,255,0.22) 0%, rgba(30,95,255,0.08) 38%, transparent 70%)",
          filter: "blur(8px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="animate-orb"
        style={{
          position: "absolute",
          bottom: -140,
          right: -110,
          width: 420,
          height: 420,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,122,26,0.18) 0%, rgba(255,122,26,0.08) 36%, transparent 70%)",
          filter: "blur(10px)",
          pointerEvents: "none",
          animationDelay: "1.6s",
        }}
      />
      <section
        className="hidden lg:flex"
          style={{
            width: "55%",
            minHeight: "100vh",
            position: "relative",
            overflow: "hidden",
            padding: "34px 36px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          background:
            "linear-gradient(155deg, rgba(6,14,28,0.98) 0%, rgba(11,26,54,0.98) 42%, rgba(18,45,88,0.98) 100%)",
          borderRight: "1px solid rgba(255,255,255,0.08)",
          boxShadow: "inset -1px 0 0 rgba(255,255,255,0.04), 20px 0 72px rgba(12,27,58,0.22)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at 20% 18%, rgba(30,95,255,0.22), transparent 22%), radial-gradient(circle at 84% 18%, rgba(255,122,26,0.18), transparent 18%), radial-gradient(circle at 65% 72%, rgba(255,255,255,0.08), transparent 28%)",
            pointerEvents: "none",
          }}
        />
        <div
          className="animate-orb"
          style={{
            position: "absolute",
            top: -90,
            right: -70,
            width: 260,
            height: 260,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(255,122,26,0.16), transparent 68%)",
            filter: "blur(8px)",
            pointerEvents: "none",
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div
              className="animate-pulse-glow"
              style={{
                width: 48,
                height: 48,
                borderRadius: 18,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "linear-gradient(135deg, #1E5FFF 0%, #5E87FF 42%, #FF7A1A 135%)",
                boxShadow: "0 16px 36px rgba(30,95,255,0.35)",
                flexShrink: 0,
              }}
            >
              <LayoutDashboard size={22} color="#ffffff" />
            </div>
            <div>
              <div style={{ color: "#ffffff", fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em" }}>
                TaskPilot
              </div>
              <div style={{ color: "rgba(226,235,255,0.7)", fontSize: 12.5, fontWeight: 500 }}>
                Blue-white-orange command center
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.05fr) minmax(300px, 0.95fr)",
            gap: 28,
            alignItems: "center",
          }}
        >
          <div style={{ maxWidth: 560 }}>
            <div
              className="animate-fade-in-up delay-100"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "7px 14px",
                borderRadius: 999,
                marginBottom: 16,
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.1)",
                boxShadow: "0 10px 22px rgba(0,0,0,0.12)",
              }}
            >
              <span
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#FF7A1A",
                  boxShadow: "0 0 0 6px rgba(255,122,26,0.12)",
                }}
              />
              <span style={{ color: "#ffffff", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                Welcome back
              </span>
            </div>

            <h1
              className="animate-fade-in-up delay-150"
              style={{
                color: "#ffffff",
                fontSize: "clamp(2.6rem, 4.4vw, 4.6rem)",
                lineHeight: 0.94,
                fontWeight: 900,
                letterSpacing: "-0.06em",
                marginBottom: 14,
                textShadow: "0 14px 30px rgba(0,0,0,0.22)",
              }}
            >
              Sign in to a{" "}
              <span className="gradient-text" style={{ display: "inline-block" }}>
                sharper
              </span>{" "}
              workspace.
            </h1>

            <p
              className="animate-fade-in-up delay-200"
              style={{
                color: "rgba(226,235,255,0.84)",
                fontSize: 16,
                lineHeight: 1.75,
                maxWidth: 520,
                marginBottom: 20,
              }}
            >
              Manage projects, track tasks, and keep the team moving in one premium control room. The design
              is bright, focused, and tuned for speed.
            </p>

            <div style={{ display: "grid", gap: 10, marginBottom: 22 }}>
              {features.map((feature, index) => (
                <div key={feature.title} className={`animate-fade-in-up delay-${(index + 1) * 100}`}>
                  <FeatureRow {...feature} />
                </div>
              ))}
            </div>
          </div>

          <div
            className="animate-fade-in-right delay-200"
            style={{
              position: "relative",
              perspective: 1500,
              transformStyle: "preserve-3d",
              minHeight: 430,
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: "auto 12px 16px auto",
                width: "82%",
                height: "82%",
                borderRadius: 32,
                background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))",
                border: "1px solid rgba(255,255,255,0.08)",
                boxShadow: "0 28px 64px rgba(0,0,0,0.22)",
                transform: "translateZ(-30px) rotateY(-14deg) rotateX(7deg)",
                backdropFilter: "blur(18px)",
                WebkitBackdropFilter: "blur(18px)",
              }}
            />

            <div
              style={{
                position: "relative",
                zIndex: 2,
                borderRadius: 34,
                padding: 18,
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.16), rgba(255,255,255,0.06))",
                border: "1px solid rgba(255,255,255,0.16)",
                boxShadow: "0 30px 70px rgba(0,0,0,0.3)",
                backdropFilter: "blur(22px) saturate(150%)",
                WebkitBackdropFilter: "blur(22px) saturate(150%)",
                transform: "translateZ(65px) rotateY(-12deg) rotateX(8deg)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 14,
                  marginBottom: 16,
                }}
              >
                <div>
                  <div style={{ color: "rgba(226,235,255,0.7)", fontSize: 12, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
                    Command center
                  </div>
                  <div style={{ color: "#FFFFFF", fontSize: 20, fontWeight: 800, letterSpacing: "-0.03em" }}>
                    Live workspace view
                  </div>
                </div>
                <div
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "8px 12px",
                    borderRadius: 999,
                    background: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.08)",
                    color: "#FFFFFF",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  <span
                    className="animate-pulse-glow"
                    style={{
                      width: 8,
                      height: 8,
                      borderRadius: "50%",
                      background: "#FF7A1A",
                      boxShadow: "0 0 0 6px rgba(255,122,26,0.12)",
                    }}
                  />
                  Synced
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12, marginBottom: 14 }}>
                {metrics.map((metric) => (
                  <MetricTile key={metric.label} {...metric} />
                ))}
              </div>

              <div
                style={{
                  borderRadius: 22,
                  padding: 16,
                  marginBottom: 14,
                  background: "rgba(6,14,28,0.26)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 10,
                    marginBottom: 10,
                    color: "#FFFFFF",
                    fontSize: 13,
                    fontWeight: 700,
                  }}
                >
                  <span>Launch sprint</span>
                  <span style={{ color: "rgba(255,255,255,0.72)" }}>86%</span>
                </div>
                <div
                  style={{
                    height: 10,
                    borderRadius: 999,
                    overflow: "hidden",
                    background: "rgba(255,255,255,0.1)",
                  }}
                >
                  <div
                    className="animate-gradient"
                    style={{
                      width: "86%",
                      height: "100%",
                      borderRadius: 999,
                      background: "linear-gradient(90deg, #1E5FFF 0%, #5E87FF 42%, #FF7A1A 120%)",
                      boxShadow: "0 0 20px rgba(30,95,255,0.26)",
                    }}
                  />
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: 16,
                  borderRadius: 22,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.08)",
                }}
              >
                <div style={{ display: "flex", marginRight: 4 }}>
                  {["NC", "AB", "TS"].map((label, index) => (
                    <div
                      key={label}
                      style={{
                        width: 34,
                        height: 34,
                        borderRadius: "50%",
                        marginLeft: index === 0 ? 0 : -8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: "#FFFFFF",
                        fontSize: 11,
                        fontWeight: 800,
                        background:
                          index === 0
                            ? "linear-gradient(135deg, #1E5FFF, #5E87FF)"
                            : index === 1
                              ? "linear-gradient(135deg, #FF7A1A, #FF9B4F)"
                              : "linear-gradient(135deg, #FFFFFF, rgba(255,255,255,0.5))",
                        border: "2px solid rgba(255,255,255,0.16)",
                        boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
                      }}
                    >
                      {label}
                    </div>
                  ))}
                </div>
                <div>
                  <div style={{ color: "#FFFFFF", fontSize: 14, fontWeight: 700, marginBottom: 2 }}>
                    Daily standup in progress
                  </div>
                  <div style={{ color: "rgba(255,255,255,0.76)", fontSize: 12.5, lineHeight: 1.5 }}>
                    3 updates, 1 blocker, and zero missed handoffs.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            position: "relative",
            zIndex: 1,
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 18,
            paddingTop: 20,
            borderTop: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            {["N", "S", "H", "U"].map((letter, index) => (
              <div
                key={letter}
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  marginLeft: index === 0 ? 0 : -8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#FFFFFF",
                  fontSize: 10,
                  fontWeight: 800,
                  background:
                    index === 0
                      ? "linear-gradient(135deg, rgba(30,95,255,0.95), rgba(96,133,255,0.88))"
                      : index === 1
                        ? "linear-gradient(135deg, rgba(255,122,26,0.95), rgba(255,155,79,0.88))"
                        : index === 2
                          ? "linear-gradient(135deg, rgba(255,255,255,0.44), rgba(255,255,255,0.18))"
                          : "linear-gradient(135deg, rgba(30,95,255,0.72), rgba(255,122,26,0.62))",
                  border: "2px solid rgba(11,26,54,0.85)",
                }}
              >
                {letter}
              </div>
            ))}
          </div>
          <div>
            <div style={{ color: "#FFFFFF", fontSize: 13, fontWeight: 700, marginBottom: 2 }}>
              Trusted by fast-moving teams
            </div>
            <div style={{ color: "rgba(226,235,255,0.72)", fontSize: 12.5, lineHeight: 1.5 }}>
              Designed to make work feel crisp, calm, and visually magnetic.
            </div>
          </div>
        </div>
      </section>

      <section
        style={{
          flex: 1,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "36px 24px",
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: 476,
          }}
        >
          <div className="lg:hidden" style={{ display: "flex", justifyContent: "center", marginBottom: 28 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 16,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "linear-gradient(135deg, #1E5FFF 0%, #5E87FF 42%, #FF7A1A 135%)",
                  boxShadow: "0 14px 28px rgba(30,95,255,0.24)",
                }}
              >
                <LayoutDashboard size={20} color="#FFFFFF" />
              </div>
              <div>
                <div style={{ color: "#0C1B3A", fontSize: 17, fontWeight: 800 }}>TaskPilot</div>
                <div style={{ color: "#5B6B8A", fontSize: 12.5 }}>Blue-white-orange command center</div>
              </div>
            </div>
          </div>

          <div
            style={{
              borderRadius: 34,
              padding: 28,
              background:
                "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.82) 100%)",
              border: "1px solid rgba(255,255,255,0.86)",
              boxShadow: "0 28px 80px rgba(12,27,58,0.16)",
              backdropFilter: "blur(24px) saturate(150%)",
              WebkitBackdropFilter: "blur(24px) saturate(150%)",
            }}
          >
            <div style={{ marginBottom: 22 }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  padding: "7px 13px",
                  marginBottom: 16,
                  borderRadius: 999,
                  background: "linear-gradient(135deg, rgba(30,95,255,0.08), rgba(255,122,26,0.08))",
                  border: "1px solid rgba(216,227,255,0.9)",
                  color: "#1E5FFF",
                  fontSize: 12,
                  fontWeight: 800,
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                }}
              >
                <Sparkles size={14} />
                Welcome back
              </div>
              <h2
                style={{
                  fontSize: "clamp(2rem, 4vw, 2.6rem)",
                  fontWeight: 900,
                  color: "#0C1B3A",
                  letterSpacing: "-0.05em",
                  lineHeight: 1.05,
                  marginBottom: 12,
                }}
              >
                Sign in to{" "}
                <span className="gradient-text-blue" style={{ display: "inline-block" }}>
                  TaskPilot
                </span>
              </h2>
              <p
                style={{
                  color: "#5B6B8A",
                  fontSize: 14.5,
                  lineHeight: 1.7,
                  maxWidth: 420,
                }}
              >
                Use your workspace email to continue.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              <div style={{ display: "flex", flexDirection: "column", gap: 18, marginBottom: 22 }}>
                <div>
                  <label htmlFor="login-email" style={{ display: "block", marginBottom: 8, color: "#0C1B3A", fontSize: 13.5, fontWeight: 700 }}>
                    Email address
                  </label>
                  <input
                    id="login-email"
                    type="email"
                    autoComplete="email"
                    placeholder="name@company.com"
                    {...register("email")}
                    style={inputStyle("email")}
                    onFocus={() => setFocused("email")}
                    onBlur={() => setFocused("")}
                  />
                  {errors.email && (
                    <p
                      style={{
                        marginTop: 7,
                        color: "#F97316",
                        fontSize: 12.5,
                        fontWeight: 600,
                      }}
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label htmlFor="login-password" style={{ display: "block", marginBottom: 8, color: "#0C1B3A", fontSize: 13.5, fontWeight: 700 }}>
                    Password
                  </label>
                  <div style={{ position: "relative" }}>
                    <input
                      id="login-password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      placeholder="Enter your password"
                      {...register("password")}
                      style={inputStyle("password")}
                      onFocus={() => setFocused("password")}
                      onBlur={() => setFocused("")}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      style={{
                        position: "absolute",
                        right: 12,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 28,
                        height: 28,
                        borderRadius: 10,
                        background: "transparent",
                        border: "none",
                        color: "#7C8AA6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                      }}
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  {errors.password && (
                    <p
                      style={{
                        marginTop: 7,
                        color: "#F97316",
                        fontSize: 12.5,
                        fontWeight: 600,
                      }}
                    >
                      {errors.password.message}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="animate-gradient"
                style={{
                  width: "100%",
                  height: 52,
                  border: "none",
                  borderRadius: 12,
                  cursor: isLoading ? "not-allowed" : "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 10,
                  color: "#FFFFFF",
                  fontSize: 15,
                  fontWeight: 800,
                  letterSpacing: "0.01em",
                  background: "linear-gradient(135deg, #1E5FFF 0%, #2D74FF 44%, #FF7A1A 140%)",
                  boxShadow: isLoading
                    ? "0 10px 24px rgba(30,95,255,0.16)"
                    : "0 16px 34px rgba(30,95,255,0.24), 0 8px 18px rgba(255,122,26,0.14)",
                  transform: "translateY(0)",
                  opacity: isLoading ? 0.88 : 1,
                  transition: "transform 0.22s ease, box-shadow 0.22s ease, opacity 0.22s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = "translateY(-2px)";
                    e.currentTarget.style.boxShadow =
                      "0 20px 40px rgba(30,95,255,0.28), 0 12px 24px rgba(255,122,26,0.18)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isLoading) {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 16px 34px rgba(30,95,255,0.24), 0 8px 18px rgba(255,122,26,0.14)";
                  }
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Enter workspace
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                margin: "22px 0",
              }}
            >
              <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, transparent, rgba(184,204,255,0.92))" }} />
              <span style={{ color: "#8A97B3", fontSize: 12, fontWeight: 800, letterSpacing: "0.1em" }}>
                OR
              </span>
              <div style={{ height: 1, flex: 1, background: "linear-gradient(90deg, rgba(184,204,255,0.92), transparent)" }} />
            </div>

            <p
              style={{
                textAlign: "center",
                color: "#5B6B8A",
                fontSize: 14,
                lineHeight: 1.65,
              }}
            >
              Need a new workspace?{" "}
              <Link
                to="/signup"
                style={{
                  color: "#1E5FFF",
                  fontWeight: 800,
                  textDecoration: "none",
                }}
              >
                Create an account
              </Link>
            </p>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                marginTop: 22,
                color: "#8A97B3",
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              <Shield size={14} />
              <span>Secure sessions, role-based access, and encrypted sign-in.</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LoginPage;
