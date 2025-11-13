import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Suspense, lazy, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import { socket } from "./main";

// ✅ Lazy load components
const AdminDashboard = lazy(() => import("./components/Admin/AdminDashboard"));
const MembersPage = lazy(() => import("./components/Admin/MemberPage"));
const ProfilePage = lazy(() => import("./components/Admin/Profile"));
const ProjectsPage = lazy(() => import("./components/Admin/Projects"));
const TasksPage = lazy(() => import("./components/Admin/Tasks"));
const ProjectDetailsPage = lazy(
  () => import("./components/Admin/ProjectDetailsPage")
);

const MemberDashboard = lazy(() => import("./components/Member/Dashboard"));
const TaskDashboard = lazy(() => import("./components/Member/Task"));
const MemberProjects = lazy(() => import("./components/Member/Projects"));
const MemberProfile = lazy(() => import("./components/Member/Profile"));

const LoginPage = lazy(() => import("./authComponent/LoginPage"));
const SignupPage = lazy(() => import("./authComponent/Signup"));

const AuthenticateUserRoutes = lazy(
  () => import("./HOC/AuthenticateUserRoutes")
);
const AuthenticateAdminRoutes = lazy(
  () => import("./HOC/AutenticateAdminRoutes")
);

function App() {
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    socket.emit("join-user", user?.id);
    console.log("user id is : ", user?.id);
  }, [user?.id]);

  return (
    <Router>
      {/* Suspense fallback ensures UI shows something while chunks load */}
      <Suspense fallback={<div className="text-center p-6">Loading...</div>}>
        <Routes>
          {/* Admin routes */}
          <Route
            path="/"
            element={
              <AuthenticateAdminRoutes>
                <AdminDashboard />
              </AuthenticateAdminRoutes>
            }
          />
          <Route
            path="/projects"
            element={
              <AuthenticateAdminRoutes>
                <ProjectsPage />
              </AuthenticateAdminRoutes>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <AuthenticateAdminRoutes>
                <ProjectDetailsPage />
              </AuthenticateAdminRoutes>
            }
          />
          <Route
            path="/tasks"
            element={
              <AuthenticateAdminRoutes>
                <TasksPage />
              </AuthenticateAdminRoutes>
            }
          />
          <Route
            path="/members"
            element={
              <AuthenticateAdminRoutes>
                <MembersPage />
              </AuthenticateAdminRoutes>
            }
          />
          <Route
            path="/profile"
            element={
              <AuthenticateAdminRoutes>
                <ProfilePage />
              </AuthenticateAdminRoutes>
            }
          />

          {/* Common routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />

          {/* Member routes */}
          <Route
            path="/member/dashboard"
            element={
              <AuthenticateUserRoutes>
                <MemberDashboard />
              </AuthenticateUserRoutes>
            }
          />
          <Route
            path="/member/tasks"
            element={
              <AuthenticateUserRoutes>
                <TaskDashboard />
              </AuthenticateUserRoutes>
            }
          />
          <Route
            path="/member/projects"
            element={
              <AuthenticateUserRoutes>
                <MemberProjects />
              </AuthenticateUserRoutes>
            }
          />
          <Route
            path="/member/profile"
            element={
              <AuthenticateUserRoutes>
                <MemberProfile />
              </AuthenticateUserRoutes>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
