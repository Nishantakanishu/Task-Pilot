import { Trash2, Loader2 } from "lucide-react";
import ModalShell from "../layout/ModalShell";

const ConfirmDeleteModal = ({ team, onClose, onConfirm, loading }) => (
  <ModalShell
    title="Delete Team?"
    eyebrow="Danger zone"
    description={`Are you sure you want to delete "${team.name}"? This action cannot be undone.`}
    icon={<Trash2 className="w-5 h-5" />}
    onClose={onClose}
    maxWidth="420px"
    tone="danger"
  >
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          padding: 16,
          borderRadius: 22,
          background: "rgba(220,38,38,0.06)",
          border: "1px solid rgba(220,38,38,0.1)",
          color: "#7F1D1D",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        Removing a team also removes it from the sidebar and project views.
      </div>
      <div className="flex gap-3">
        <button
          onClick={onClose}
          className="flex-1 py-3 px-4 border border-[#D8E3FF] bg-white text-text-secondary hover:bg-[#F8FBFF] hover:text-text-primary font-semibold rounded-xl text-sm transition-colors cursor-pointer"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className="flex-1 py-3 px-4 disabled:opacity-60 text-white font-semibold rounded-xl text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
          style={{
            background: "linear-gradient(135deg, #DC2626 0%, #F97316 100%)",
          }}
        >
          {loading && <Loader2 className="animate-spin h-4 w-4" />}
          Delete
        </button>
      </div>
    </div>
  </ModalShell>
);

export default ConfirmDeleteModal;
