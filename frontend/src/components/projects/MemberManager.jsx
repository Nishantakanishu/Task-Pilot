import { useState } from "react";
import toast from "react-hot-toast";
import api from "../../api/axios";
import { useAuth } from "../../context/AuthContext";
import { Loader2, Plus, X, Search } from "lucide-react";

const MemberManager = ({ project, allUsers, onUpdate }) => {
  const { isAdmin } = useAuth();
  const [addingId, setAddingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [memberSearch, setMemberSearch] = useState("");

  const memberIds = project.members.map((m) => m._id?.toString() || m.toString());

  // Users not yet in the project
  const availableUsers = allUsers.filter((u) => !memberIds.includes(u._id?.toString() || u.toString()));

  const handleAddMember = async (userId) => {
    if (!userId) return;
    setAddingId(userId);
    try {
      const { data } = await api.post(`/projects/${project._id}/members`, {
        userId: userId,
      });
      toast.success("Member added");
      setMemberSearch("");
      onUpdate?.(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add member");
    } finally {
      setAddingId(null);
    }
  };

  const handleRemoveMember = async (userId) => {
    setRemovingId(userId);
    try {
      const { data } = await api.delete(
        `/projects/${project._id}/members/${userId}`
      );
      toast.success("Member removed");
      onUpdate?.(data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove member");
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* Add Member Search */}
      {isAdmin && (
        <div className="relative">
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search users to add to project..."
              value={memberSearch}
              onChange={(e) => setMemberSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl bg-white border border-gray-300 text-text-primary placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent shadow-sm transition"
            />
          </div>

          {/* Search Results List */}
          <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl shadow-inner-soft divide-y divide-gray-100 mb-4 bg-gray-50">
            {availableUsers
              .filter(u => 
                u.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
                u.email.toLowerCase().includes(memberSearch.toLowerCase())
              )
              .map(user => (
                <div key={user._id} className="flex items-center justify-between p-3 hover:bg-white transition-colors">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                    <p className="text-xs text-text-secondary truncate">{user.email} — {user.role}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleAddMember(user._id)}
                    disabled={addingId === user._id}
                    className="ml-3 px-3 py-1.5 bg-primary/10 text-primary hover:bg-primary hover:text-white disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    {addingId === user._id ? (
                      <Loader2 className="animate-spin h-3 w-3" />
                    ) : (
                      <Plus className="h-3 w-3" />
                    )}
                    Add
                  </button>
                </div>
              ))}
            {availableUsers.length === 0 ? (
              <div className="p-3 text-sm text-text-secondary text-center">No other users available to add.</div>
            ) : availableUsers.filter(u => 
              u.name.toLowerCase().includes(memberSearch.toLowerCase()) || 
              u.email.toLowerCase().includes(memberSearch.toLowerCase())
            ).length === 0 ? (
              <div className="p-3 text-sm text-text-secondary text-center">No users match your search.</div>
            ) : null}
          </div>
        </div>
      )}

      {/* Member List */}
      <div className="space-y-2.5">
        {project.members.length === 0 ? (
          <p className="text-text-secondary text-sm">No members yet.</p>
        ) : (
          project.members.map((member) => {
            const isCreator =
              project.createdBy?._id === member._id ||
              project.createdBy === member._id;
            return (
              <div
                key={member._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-gray-300 transition-colors"
              >
                <div className="flex items-center gap-3 sm:gap-4 overflow-hidden">
                  <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center text-sm font-bold text-white uppercase shadow-sm shrink-0">
                    {member.name.charAt(0)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-text-primary font-semibold truncate">
                      {member.name}
                      {isCreator && (
                        <span className="ml-2 text-xs text-primary font-medium shrink-0">
                          (Owner)
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-text-secondary truncate mt-0.5">{member.email}</p>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-3 shrink-0 pl-12 sm:pl-0">
                  <span
                    className={`text-xs px-2.5 py-1 rounded-md font-bold uppercase tracking-wider ${
                      member.role === "ADMIN"
                        ? "bg-purple-100 text-purple-700 border border-purple-200"
                        : "bg-slate-100 text-slate-700 border border-slate-200"
                    }`}
                  >
                    {member.role}
                  </span>
                  {isAdmin && !isCreator && (
                    <button
                      onClick={() => handleRemoveMember(member._id)}
                      disabled={removingId === member._id}
                      className="text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors p-2 rounded-lg"
                      title="Remove member"
                    >
                      {removingId === member._id ? (
                        <Loader2 className="animate-spin h-4 w-4" />
                      ) : (
                        <X className="h-4 w-4" />
                      )}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default MemberManager;
