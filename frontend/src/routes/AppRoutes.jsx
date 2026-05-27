import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Loader2 } from "lucide-react";
import LoginPage from "../pages/auth/LoginPage";
import SignupPage from "../pages/auth/SignupPage";
import ProjectsPage from "../pages/projects/ProjectsPage";
import ProjectDetailPage from "../pages/projects/ProjectDetailPage";
import TasksPage from "../pages/tasks/TasksPage";
import TaskDetailPage from "../pages/tasks/TaskDetailPage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import GlobalTeamsPage from "../pages/team/GlobalTeamsPage";
import TeamDetailPage from "../pages/projects/TeamDetailPage";
import DashboardLayout from "../layouts/DashboardLayout";

// Route guards
const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );
  }
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />

      {/* Protected routes */}
      {/* Protected routes wrapped in DashboardLayout */}
      <Route element={<PrivateRoute><DashboardLayout /></PrivateRoute>}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/projects/:id" element={<ProjectDetailPage />} />
        <Route path="/teams" element={<GlobalTeamsPage />} />
        <Route path="/tasks" element={<TasksPage />} />
        <Route path="/tasks/:id" element={<TaskDetailPage />} />
        <Route path="/projects/:id/teams/:teamId" element={<TeamDetailPage />} />
      </Route>

      {/* Redirect root */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 */}
      <Route
        path="*"
        element={
          <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="text-center bg-card p-10 rounded-2xl border border-border shadow-sm max-w-md w-full mx-4">
              <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
              <p className="text-xl font-semibold text-text-primary mb-2">Page not found</p>
              <p className="text-text-secondary text-sm">The page you're looking for doesn't exist or you don't have access.</p>
            </div>
          </div>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
