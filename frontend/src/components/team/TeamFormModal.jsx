import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { Loader2, Users2 } from "lucide-react";
import ModalShell from "../layout/ModalShell";

const TeamFormModal = ({ onClose, onSave, initial = null, projectId }) => {
  const [name, setName] = useState(initial?.name || "");
  const [description, setDescription] = useState(initial?.description || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Team name is required");
    setLoading(true);
    try {
      let data;
      if (initial) {
        const res = await api.patch(`/projects/${projectId}/teams/${initial._id}`, {
          name: name.trim(),
          description: description.trim(),
        });
        data = res.data.data;
        toast.success("Team updated");
      } else {
        const res = await api.post(`/projects/${projectId}/teams`, {
          name: name.trim(),
          description: description.trim(),
        });
        data = res.data.data;
        toast.success("Team created");
      }
      onSave(data, !!initial);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save team");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ModalShell
      title={initial ? "Edit Team" : "Create New Team"}
      eyebrow="Team setup"
      description="Keep team ownership clear and make the workspace easier to navigate."
      icon={<Users2 className="w-5 h-5" />}
      onClose={onClose}
      maxWidth="520px"
    >
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        <div
          style={{
            padding: 18,
            borderRadius: 22,
            background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(241,246,255,0.88))",
            border: "1px solid rgba(216,227,255,0.9)",
            boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
          }}
        >
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Team Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Frontend, Backend, QA"
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#D8E3FF] text-text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-text-primary mb-2">
                Description
                <span className="ml-1 text-xs font-normal text-text-secondary">(optional)</span>
              </label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What does this team focus on?"
                className="w-full px-4 py-3.5 rounded-xl bg-white border border-[#D8E3FF] text-text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition resize-none"
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
          Use short, distinct names so teams are easy to spot in project views.
        </div>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-3 px-4 border border-[#D8E3FF] bg-white text-text-secondary hover:text-text-primary hover:bg-[#F8FBFF] font-semibold rounded-xl transition-colors text-sm cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 py-3 px-4 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #1E5FFF 0%, #2D74FF 45%, #FF7A1A 140%)",
            }}
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : null}
            {initial ? "Save Changes" : "Create Team"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
};

export default TeamFormModal;
