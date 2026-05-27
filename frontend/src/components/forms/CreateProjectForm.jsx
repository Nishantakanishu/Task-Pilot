import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { Loader2 } from "lucide-react";

const schema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters").max(100),
  description: z.string().max(500, "Max 500 characters").optional(),
});

const CreateProjectForm = ({ onSuccess, onCancel }) => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({ resolver: zodResolver(schema) });

  const onSubmit = async (formData) => {
    setIsLoading(true);
    try {
      const payload = formData;
      const { data } = await api.post("/projects", payload);
      toast.success("Workspace created successfully!");
      reset();
      onSuccess?.(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create project");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div
        style={{
          padding: 18,
          borderRadius: 22,
          background: "linear-gradient(180deg, rgba(255,255,255,0.96), rgba(241,246,255,0.88))",
          border: "1px solid rgba(216,227,255,0.9)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.85)",
        }}
      >
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
            Workspace details
          </p>
          <p style={{ fontSize: 13, color: "#5B6B8A", lineHeight: 1.55 }}>
            Give the workspace a clear name and a short description so it stays easy to scan later.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Workspace Name <span className="text-red-500">*</span>
            </label>
            <input
              id="project-title"
              type="text"
              {...register("title")}
              className={`w-full px-4 py-3.5 rounded-xl bg-white border text-text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition shadow-sm ${
                errors.title ? "border-red-300 focus:ring-red-500" : "border-[#D8E3FF]"
              }`}
              placeholder="e.g. Website Redesign"
            />
            {errors.title && (
              <p className="mt-2 text-xs font-medium text-red-500">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-text-primary mb-2">
              Description
            </label>
            <textarea
              id="project-description"
              rows={4}
              {...register("description")}
              className={`w-full px-4 py-3.5 rounded-xl bg-white border text-text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition resize-none shadow-sm ${
                errors.description ? "border-red-300 focus:ring-red-500" : "border-[#D8E3FF]"
              }`}
              placeholder="What is this workspace about?"
            />
            {errors.description && (
              <p className="mt-2 text-xs font-medium text-red-500">{errors.description.message}</p>
            )}
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
        Keep workspace names short. It helps the sidebar stay clean.
      </div>

      <div className="flex gap-3 pt-1">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 py-3 px-4 border border-[#D8E3FF] bg-white text-text-secondary hover:text-text-primary hover:bg-[#F8FBFF] font-semibold rounded-xl transition-colors text-sm shadow-sm"
        >
          Cancel
        </button>
        <button
          id="create-project-btn"
          type="submit"
          disabled={isLoading}
          className="flex-1 py-3 px-4 disabled:opacity-60 text-white font-semibold rounded-xl transition-colors text-sm flex items-center justify-center gap-2 shadow-sm"
          style={{
            background: "linear-gradient(135deg, #1E5FFF 0%, #2D74FF 45%, #FF7A1A 140%)",
          }}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin h-4 w-4" />
              Creating...
            </>
          ) : "Create Workspace"}
        </button>
      </div>
    </form>
  );
};

export default CreateProjectForm;
