import { useState } from "react";
import toast from "react-hot-toast";
import { KeyRound, Loader2, LogOut, Shield, UserCircle2 } from "lucide-react";

import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import ModalShell from "./ModalShell";

const surfaceCard = {
  padding: 18,
  borderRadius: 18,
  background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(241,246,255,0.88))",
  border: "1px solid rgba(216,227,255,0.9)",
  boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
};

const inputClass =
  "w-full px-4 py-3 rounded-[12px] bg-white border border-[#D8E3FF] text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition";

const ProfileModal = ({ onClose }) => {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    if (!currentPassword.trim()) {
      toast.error("Current password is required");
      return;
    }

    if (!newPassword.trim()) {
      toast.error("New password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    setIsSaving(true);
    try {
      await api.patch("/auth/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      onClose?.();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    onClose?.();
  };

  const userInitial = (user?.name?.charAt(0) || "W").toUpperCase();
  const userRole = user?.role?.toLowerCase() || "member";

  return (
    <ModalShell
      title="Profile"
      eyebrow="Account settings"
      description="Review your account details, update your password, or log out when you are done."
      icon={<UserCircle2 className="w-5 h-5" />}
      onClose={onClose}
      maxWidth="620px"
      contentPadding="24px"
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div style={surfaceCard}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 18,
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#fff",
                fontSize: 18,
                fontWeight: 900,
                background: "linear-gradient(135deg, #1E5FFF 0%, #5E87FF 42%, #FF7A1A 135%)",
                boxShadow: "0 14px 30px rgba(30,95,255,0.22)",
              }}
            >
              {userInitial}
            </div>

            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 16, fontWeight: 900, color: "#0C1B3A", letterSpacing: "-0.04em" }}>
                {user?.name || "Workspace member"}
              </p>
              <p style={{ fontSize: 13, color: "#5B6B8A", marginTop: 3, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {user?.email}
              </p>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  marginTop: 10,
                  padding: "7px 12px",
                  borderRadius: 999,
                  background: "rgba(30,95,255,0.08)",
                  border: "1px solid rgba(30,95,255,0.14)",
                  color: "#1E5FFF",
                  fontSize: 12,
                  fontWeight: 800,
                  textTransform: "capitalize",
                }}
              >
                <Shield className="w-3.5 h-3.5" />
                {userRole}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handlePasswordChange} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={surfaceCard}>
            <div style={{ marginBottom: 14 }}>
              <p
                style={{
                  fontSize: 11,
                  fontWeight: 800,
                  letterSpacing: "0.12em",
                  textTransform: "uppercase",
                  color: "#1E5FFF",
                  marginBottom: 4,
                }}
              >
                Change password
              </p>
              <p style={{ fontSize: 13, color: "#5B6B8A", lineHeight: 1.55 }}>
                Update your password from here without leaving the app.
              </p>
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Current Password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">New Password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-primary mb-2">Confirm New Password</label>
                <input
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className={inputClass}
                  placeholder="Re-enter new password"
                />
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "14px 16px",
              borderRadius: 18,
              background: "rgba(255,122,26,0.08)",
              border: "1px solid rgba(255,122,26,0.12)",
              color: "#7C4A1F",
              fontSize: 12.5,
              lineHeight: 1.5,
            }}
          >
            <span style={{ fontWeight: 800 }}>Tip:</span>
            Use a strong password with at least six characters.
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <button
              type="button"
              onClick={handleLogout}
              className="flex-1 py-3 px-4 border border-[#D8E3FF] bg-white text-text-secondary hover:text-text-primary hover:bg-[#F8FBFF] font-semibold rounded-[12px] transition-colors text-sm shadow-sm flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-3 px-4 disabled:opacity-60 text-white font-semibold rounded-[12px] transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
              style={{
                background: "linear-gradient(135deg, #1E5FFF 0%, #2D74FF 45%, #FF7A1A 140%)",
              }}
            >
              {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
              Update Password
            </button>
          </div>
        </form>
      </div>
    </ModalShell>
  );
};

export default ProfileModal;
