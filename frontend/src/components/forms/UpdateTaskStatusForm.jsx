import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { TASK_STATUS } from "../../constants";
import { Loader2 } from "lucide-react";

const UpdateTaskStatusForm = ({ task, onUpdate }) => {
  const [status, setStatus] = useState(task.status);
  const [isLoading, setIsLoading] = useState(false);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);
    setIsLoading(true);

    try {
      const { data } = await api.patch(`/tasks/${task._id}`, {
        status: newStatus,
      });
      toast.success("Status updated");
      onUpdate?.(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update status");
      // Revert status on error
      setStatus(task.status);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      style={{
        minWidth: 220,
        padding: 14,
        borderRadius: 20,
        background: "linear-gradient(180deg, rgba(255,255,255,0.98), rgba(241,246,255,0.9))",
        border: "1px solid rgba(216,227,255,0.9)",
        boxShadow: "0 14px 30px rgba(12,27,58,0.08)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 10 }}>
        <div>
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
            Update status
          </p>
          <p style={{ fontSize: 12.5, color: "#5B6B8A", lineHeight: 1.4 }}>
            Keep task progress current with one clean action.
          </p>
        </div>
        {isLoading ? <Loader2 className="animate-spin h-5 w-5 text-primary shrink-0" /> : null}
      </div>

      <select
        value={status}
        onChange={handleStatusChange}
        disabled={isLoading}
        className="w-full px-4 py-3 rounded-xl bg-white border border-[#D8E3FF] text-text-primary text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-primary shadow-sm transition-all duration-200 disabled:opacity-50 cursor-pointer hover:border-[#B9CBF6]"
      >
        <option value={TASK_STATUS.TODO}>To Do</option>
        <option value={TASK_STATUS.IN_PROGRESS}>In Progress</option>
        <option value={TASK_STATUS.DONE}>Done</option>
      </select>
    </div>
  );
};

export default UpdateTaskStatusForm;
