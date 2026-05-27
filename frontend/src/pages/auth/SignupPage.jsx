
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import toast from "react-hot-toast";
import { signupSchema } from "../../validations/auth.validation";
import { useAuth } from "../../context/AuthContext";
import api from "../../api/axios";
import { CheckCircle2, Loader2, LayoutDashboard, Shield, Zap, Users, Eye, EyeOff } from "lucide-react";

// ─── Style constants (defined once, reused everywhere) ───────────────────────
const S = {
  input: {
    width: "100%",
    padding: "11px 14px",
    border: "1.5px solid #e5e7eb",
    borderRadius: 12,
    fontSize: 14,
    color: "#111827",
    background: "#f9fafb",
    outline: "none",
    fontFamily: "inherit",
    boxSizing: "border-box",
    transition: "border-color 0.15s, background 0.15s, box-shadow 0.15s",
  },
  inputError: {
    border: "1.5px solid #fca5a5",
    background: "#fff7f7",
  },
  inputFocus: {
    borderColor: "#059669",
    background: "#ffffff",
    boxShadow: "0 0 0 3px rgba(5,150,105,0.12)",
  },
  label: {
    display: "block",
    fontSize: 13.5,
    fontWeight: 600,
    color: "#374151",
    marginBottom: 8,
  },
  field: {
    display: "flex",
    flexDirection: "column",
  },
  fieldsGroup: {
    display: "flex",
    flexDirection: "column",
    gap: 20,
    marginBottom: 28,
  },
  errorMsg: {
    marginTop: 6,
    fontSize: 12,
    fontWeight: 500,
    color: "#ef4444",
    display: "flex",
    alignItems: "center",
    gap: 5,
  },
  errorDot: {
    width: 14,
    height: 14,
    borderRadius: "50%",
    background: "#fee2e2",
    color: "#ef4444",
    fontSize: 9,
    fontWeight: 700,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  btn: {
    width: "100%",
    padding: "13px 20px",
    background: "#059669",
    color: "#ffffff",
    fontSize: 15,
    fontWeight: 600,
    border: "none",
    borderRadius: 12,
    cursor: "pointer",
    fontFamily: "inherit",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    transition: "background 0.15s",
    boxSizing: "border-box",
  },
  btnDisabled: {
    background: "#6ee7b7",
    cursor: "not-allowed",
  },
};
// ─────────────────────────────────────────────────────────────────────────────

const SignupPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [focused, setFocused] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(signupSchema) });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/signup", formData);
      login(data.data.user, data.data.token);
      toast.success("Account created! Welcome aboard 🎉");
      navigate("/dashboard");
    } catch (err) {
      toast.error(err.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const inputStyle = (name) => ({
    ...S.input,
    ...(errors[name] ? S.inputError : {}),
    ...(focused === name ? S.inputFocus : {}),
  });

  return (
    <div style={{ display: "flex", minHeight: "100vh", width: "100%", fontFamily: "inherit" }}>

      {/* ── LEFT PANEL ── */}
      <div
        className="hidden lg:flex"
        style={{
          width: "48%",
          backgroundColor: "#0F172A",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "40px 48px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{ position: "absolute", top: -120, left: -120, width: 420, height: 420, borderRadius: "50%", background: "rgba(16,185,129,0.08)", filter: "blur(100px)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -60, right: -60, width: 260, height: 260, borderRadius: "50%", background: "rgba(16,185,129,0.05)", filter: "blur(80px)", pointerEvents: "none" }} />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, position: "relative", zIndex: 1 }}>
          <div style={{ width: 38, height: 38, borderRadius: 8, background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.25)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <LayoutDashboard style={{ width: 18, height: 18, color: "#34d399" }} />
          </div>
          <span style={{ color: "#fff", fontSize: 16, fontWeight: 600 }}>TaskPilot</span>
        </div>

        {/* Main copy */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", borderRadius: 999, padding: "5px 14px", marginBottom: 24 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#34d399", flexShrink: 0 }} />
            <span style={{ color: "#34d399", fontSize: 11, fontWeight: 500, letterSpacing: "0.04em" }}>Free to get started</span>
          </div>

          <h1 style={{ color: "#fff", fontSize: 30, fontWeight: 700, lineHeight: 1.22, letterSpacing: "-0.02em", marginBottom: 16 }}>
            Everything your team needs<br />
            <span style={{ color: "#34d399" }}>in one place.</span>
          </h1>

          <p style={{ color: "#94a3b8", fontSize: 14, lineHeight: 1.65, marginBottom: 28, maxWidth: 300 }}>
            Set up your workspace in minutes. Collaborate, track progress, and ship faster from day one.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {[
              { Icon: CheckCircle2, text: "Unlimited projects & tasks" },
              { Icon: Users, text: "Invite your whole team" },
              { Icon: Zap, text: "Ready in under 2 minutes" },
              { Icon: Shield, text: "Enterprise-grade security" },
            ].map(({ Icon, text }) => (
              <div key={text} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 26, height: 26, borderRadius: "50%", background: "rgba(16,185,129,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                  <Icon style={{ width: 13, height: 13, color: "#34d399" }} />
                </div>
                <span style={{ color: "#cbd5e1", fontSize: 13 }}>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Social proof */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, paddingTop: 24, borderTop: "1px solid rgba(255,255,255,0.1)", position: "relative", zIndex: 1 }}>
          <div style={{ display: "flex" }}>
            {[["#7c3aed", "A"], ["#0284c7", "B"], ["#d97706", "C"], ["#db2777", "D"]].map(([bg, l], i) => (
              <div key={l} style={{ width: 28, height: 28, borderRadius: "50%", background: bg, border: "2px solid #0F172A", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 700, marginLeft: i === 0 ? 0 : -8 }}>
                {l}
              </div>
            ))}
          </div>
          <span style={{ color: "#94a3b8", fontSize: 13 }}>Join thousands of happy teams</span>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        style={{
          flex: 1,
          backgroundColor: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 40px",
          overflowY: "auto",
          minHeight: "100vh",
        }}
      >
        <div style={{ width: "100%", maxWidth: 380 }}>

          {/* Mobile logo */}
          <div className="lg:hidden" style={{ display: "flex", justifyContent: "center", marginBottom: 40 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 8, background: "#f0fdf4", border: "1px solid #d1fae5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LayoutDashboard style={{ width: 18, height: 18, color: "#059669" }} />
              </div>
              <span style={{ color: "#111827", fontWeight: 600, fontSize: 16 }}>TaskPilot</span>
            </div>
          </div>

          {/* Heading */}
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#111827", letterSpacing: "-0.02em", marginBottom: 6 }}>
              Create your account
            </h2>
            <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.5 }}>
              Get started for free. No credit card required.
            </p>
          </div>

          {/* ── FORM ── */}
          <form onSubmit={handleSubmit(onSubmit)} noValidate>

            <div style={S.fieldsGroup}>

              {/* Full name */}
              <div style={S.field}>
                <label htmlFor="name" style={S.label}>Full name</label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  placeholder="John Doe"
                  {...register("name")}
                  style={inputStyle("name")}
                  onFocus={() => setFocused("name")}
                  onBlur={() => setFocused("")}
                />
                {errors.name && (
                  <p style={S.errorMsg}>
                    <span style={S.errorDot}>!</span>
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div style={S.field}>
                <label htmlFor="signup-email" style={S.label}>Email address</label>
                <input
                  id="signup-email"
                  type="email"
                  autoComplete="email"
                  placeholder="name@company.com"
                  {...register("email")}
                  style={inputStyle("email")}
                  onFocus={() => setFocused("email")}
                  onBlur={() => setFocused("")}
                />
                {errors.email && (
                  <p style={S.errorMsg}>
                    <span style={S.errorDot}>!</span>
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div style={S.field}>
                <label htmlFor="signup-password" style={S.label}>Password</label>
                <div style={{ position: "relative" }}>
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="Min. 6 characters"
                    {...register("password")}
                    style={{ ...inputStyle("password"), paddingRight: 40 }}
                    onFocus={() => setFocused("password")}
                    onBlur={() => setFocused("")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: "absolute",
                      right: 12,
                      top: "50%",
                      transform: "translateY(-50%)",
                      background: "none",
                      border: "none",
                      padding: 0,
                      cursor: "pointer",
                      color: "#9ca3af",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {errors.password && (
                  <p style={S.errorMsg}>
                    <span style={S.errorDot}>!</span>
                    {errors.password.message}
                  </p>
                )}
              </div>

            </div>

            {/* Submit */}
            <button
              id="signup-btn"
              type="submit"
              disabled={isLoading}
              style={{ ...S.btn, ...(isLoading ? S.btnDisabled : {}) }}
              onMouseEnter={e => { if (!isLoading) e.currentTarget.style.background = "#047857"; }}
              onMouseLeave={e => { if (!isLoading) e.currentTarget.style.background = "#059669"; }}
            >
              {isLoading ? (
                <>
                  <Loader2 style={{ width: 16, height: 16, animation: "spin 1s linear infinite" }} />
                  Creating account…
                </>
              ) : "Create account"}
            </button>

          </form>

          {/* Divider */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "24px 0" }}>
            <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
            <span style={{ fontSize: 12, color: "#9ca3af", fontWeight: 500, letterSpacing: "0.05em" }}>OR</span>
            <div style={{ flex: 1, height: 1, background: "#f3f4f6" }} />
          </div>

          {/* Sign-in link */}
          <p style={{ textAlign: "center", fontSize: 14, color: "#6b7280" }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#059669", fontWeight: 700, textDecoration: "none" }}>
              Sign in
            </Link>
          </p>

          {/* Trust */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginTop: 28 }}>
            <Shield style={{ width: 13, height: 13, color: "#d1d5db", flexShrink: 0 }} />
            <span style={{ fontSize: 11.5, color: "#9ca3af" }}>256-bit SSL encrypted · SOC 2 compliant</span>
          </div>

        </div>
      </div>

    </div>
  );
};

export default SignupPage;
