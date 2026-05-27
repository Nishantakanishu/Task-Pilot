import { useEffect, useRef, useState } from "react";

const StatCard = ({ title, value, icon, colorClass = "text-primary", bgClass = "bg-primary/10", delay = 0, gradient }) => {
  const [displayed, setDisplayed] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  // Count-up animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!visible || typeof value !== "number") return;
    let start = 0;
    const duration = 800;
    const step = Math.ceil(value / (duration / 16));
    const timer = setInterval(() => {
      start += step;
      if (start >= value) { setDisplayed(value); clearInterval(timer); }
      else setDisplayed(start);
    }, 16);
    return () => clearInterval(timer);
  }, [visible, value]);

  const defaultGradients = [
    "linear-gradient(135deg, #1E5FFF, #60A5FA)",
    "linear-gradient(135deg, #FF7A1A, #FCD34D)",
    "linear-gradient(135deg, #10B981, #34D399)",
    "linear-gradient(135deg, #8B5CF6, #A78BFA)",
    "linear-gradient(135deg, #EC4899, #F9A8D4)",
  ];

  const cardGradient = gradient || defaultGradients[0];

  return (
    <div
      ref={ref}
      className="card-hover animate-fade-in-up"
      style={{
        animationDelay: `${delay}ms`,
        background: "#fff",
        border: "1.5px solid #D8E3FF",
        borderRadius: "20px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 2px 16px rgba(12,27,58,0.06)",
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        height: "3px",
        background: cardGradient,
        opacity: 0.8,
      }} />

      {/* Background glow blob */}
      <div style={{
        position: "absolute",
        top: "-20px",
        right: "-20px",
        width: "80px",
        height: "80px",
        borderRadius: "50%",
        background: cardGradient,
        opacity: 0.06,
        filter: "blur(20px)",
        pointerEvents: "none",
      }} />

      {/* Icon */}
      <div style={{
        width: "44px",
        height: "44px",
        borderRadius: "14px",
        background: cardGradient,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        boxShadow: "0 4px 16px rgba(30,95,255,0.25)",
        transition: "transform 0.3s ease",
      }}
        className="group-hover:scale-110"
      >
        {icon}
      </div>

      {/* Text */}
      <div>
        <p style={{
          fontSize: "11px",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "#5B6B8A",
          marginBottom: "6px",
        }}>
          {title}
        </p>
        <p style={{
          fontSize: "36px",
          fontWeight: 800,
          color: "#0C1B3A",
          letterSpacing: "-0.03em",
          lineHeight: 1,
        }}>
          {visible && typeof value === "number" ? displayed : value}
        </p>
      </div>
    </div>
  );
};

export default StatCard;
