import { createPortal } from "react-dom";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { ChevronDown, KeyRound, LogOut, Shield, UserCircle2 } from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import ProfileModal from "./ProfileModal";

const ProfileMenu = ({ className = "" }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);
  const menuRef = useRef(null);
  const dropdownRef = useRef(null);
  const userName = user?.name || "Workspace member";
  const userEmail = user?.email || "";
  const userRole = user?.role?.toLowerCase() || "member";
  const userInitial = (user?.name?.charAt(0) || "W").toUpperCase();

  const updateMenuPosition = () => {
    if (!menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    const dropdownWidth = 248;
    const viewportPadding = 16;
    const dropdownGap = 12;
    const maxLeft = Math.max(viewportPadding, window.innerWidth - dropdownWidth - viewportPadding);
    const left = Math.min(Math.max(viewportPadding, rect.right - dropdownWidth), maxLeft);
    const top = Math.max(
      viewportPadding,
      Math.min(rect.bottom + dropdownGap, window.innerHeight - viewportPadding - 12)
    );

    setMenuPosition({
      left,
      top,
      width: dropdownWidth,
      maxHeight: Math.max(180, window.innerHeight - top - viewportPadding),
    });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current?.contains(event.target) ||
        dropdownRef.current?.contains(event.target)
      ) {
        return;
      }

      if (isOpen) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setMenuPosition(null);
      return;
    }

    updateMenuPosition();
  }, [isOpen, userInitial]);

  useEffect(() => {
    if (!isOpen) return;

    const handleReposition = () => updateMenuPosition();

    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [isOpen]);

  return (
    <>
      <div
        ref={menuRef}
        className={`relative inline-flex ${className}`}
        style={{ zIndex: isOpen ? 1000 : "auto" }}
      >
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          aria-haspopup="menu"
          aria-expanded={isOpen}
          className="inline-flex items-center gap-2 rounded-xl border border-[#D8E3FF] bg-white px-3.5 py-2.5 text-sm font-semibold text-text-primary shadow-sm transition-colors hover:bg-[#F8FBFF]"
        >
          <span
            className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black uppercase text-white"
            style={{
              background: "linear-gradient(135deg, #1E5FFF 0%, #5E87FF 42%, #FF7A1A 135%)",
              boxShadow: "0 10px 20px rgba(30,95,255,0.18)",
            }}
          >
            {userInitial}
          </span>
          <span className="hidden sm:inline">Profile</span>
          <ChevronDown
            className={`h-4 w-4 text-text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && menuPosition && typeof document !== "undefined"
          ? createPortal(
              <div
                ref={dropdownRef}
                className="overflow-hidden rounded-[28px] border border-[#D8E3FF] bg-white shadow-[0_20px_50px_rgba(12,27,58,0.16)]"
                style={{
                  position: "fixed",
                  top: menuPosition.top,
                  left: menuPosition.left,
                  width: menuPosition.width,
                  maxHeight: menuPosition.maxHeight,
                  zIndex: 1000,
                  background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(248,251,255,0.98))",
                }}
              >
                <div className="border-b border-[#E8EEFF] p-5">
                  <div className="flex items-start gap-3">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center text-sm font-black uppercase text-white shrink-0"
                      style={{
                        background: "linear-gradient(135deg, #1E5FFF 0%, #5E87FF 42%, #FF7A1A 135%)",
                        boxShadow: "0 12px 22px rgba(30,95,255,0.18)",
                      }}
                    >
                      {userInitial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold text-text-primary">{userName}</p>
                      <p className="mt-0.5 truncate text-xs text-text-secondary">{userEmail}</p>
                      <div
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-[#D8E3FF] bg-[#F8FBFF] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[#33527E]"
                      >
                        <Shield className="h-3 w-3 text-[#1E5FFF]" />
                        {userRole}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 overflow-y-auto" style={{ maxHeight: "inherit" }}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      setShowProfileModal(true);
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-4 text-left text-sm font-semibold text-text-primary transition-colors hover:bg-[#F8FBFF]"
                    style={{ marginBottom: 10, minHeight: 72 }}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EBF0FF] text-[#1E5FFF]">
                      <KeyRound className="h-4 w-4" />
                    </span>
                    <span className="flex-1">
                      <span className="block">Change password</span>
                      <span className="block text-xs font-medium text-text-secondary">Update your account password</span>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsOpen(false);
                      logout();
                    }}
                    className="flex w-full items-center gap-3 rounded-2xl px-3.5 py-4 text-left text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
                    style={{ minHeight: 72 }}
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
                      <LogOut className="h-4 w-4" />
                    </span>
                    <span className="flex-1">
                      <span className="block">Logout</span>
                      <span className="block text-xs font-medium text-red-500/80">Sign out of your session</span>
                    </span>
                  </button>
                </div>
              </div>,
              document.body
            )
          : null}
      </div>

      {showProfileModal ? <ProfileModal onClose={() => setShowProfileModal(false)} /> : null}
    </>
  );
};

export default ProfileMenu;
