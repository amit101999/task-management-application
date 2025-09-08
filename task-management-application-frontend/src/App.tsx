import { BrowserRouter as Router, Routes, Route } from "react-router";
import AdminDashboard from "./components/Admin/AdminDashboard";
import MembersPage from "./components/Admin/MemberPage";
import ProfilePage from "./components/Admin/Profile";
import ProjectsPage from "./components/Admin/Projects";
import TasksPage from "./components/Admin/Tasks";
import MemberDashboard from "./components/Member/Dashboard";
import TaskDashboard from "./components/Member/Task";
import MemberProjects from "./components/Member/Projects";
import LoginPage from "./authComponent/LoginPage";
import SignupPage from "./authComponent/Signup";
import AuthenticateUserRoutes from "./HOC/AuthenticateUserRoutes";
import AuthenticateAdminRoutes from "./HOC/AutenticateAdminRoutes";
import ProjectDetailsPage from "./components/Admin/ProjectDetailsPage";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "./redux/store";
import { socket } from "./main";
import MemberProfile from "./components/Member/Profile";

function App() {
  const { user } = useSelector((state: RootState) => state.user);
  useEffect(() => {
    socket.emit("join-user", user?.id);
    console.log("user id is : ", user?.id);
  }, [user?.id]);

  return (
    <Router>
      <Routes>
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

        {/* common routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        {/* member routes */}
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
    </Router>
  );
}

export default App;
