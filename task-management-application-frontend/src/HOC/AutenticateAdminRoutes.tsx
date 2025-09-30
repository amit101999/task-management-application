import { type JSX, useEffect } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router";

const AuthenticateAdminRoutes = ({ children }: { children: JSX.Element }) => {
  const { user } = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "ADMIN") {
      navigate("/member/dashboard");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect to login
  }

  if (user.role !== "ADMIN") {
    return null; // Will redirect to member dashboard
  }

  return children;
};

export default AuthenticateAdminRoutes;
