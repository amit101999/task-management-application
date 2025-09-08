import { type JSX } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { Link } from "react-router";

const AuthenticateAdminRoutes = ({ children }: { children: JSX.Element }) => {
  const { user } = useSelector((state: RootState) => state.user);
  return (
    <>
      {user ? (
        user.role === "ADMIN" ? (
          children
        ) : (
          <>
            <h1 className="text-2xl text-center text-red-600">
              You are not authorized to access this content.
            </h1>
            <Link
              to="/member/dashboard"
              className="text-blue-500 text-center block mt-4"
            >
              Go to Dashboard
            </Link>
          </>
        )
      ) : (
        <>
          <h1 className="text-2xl text-center text-red-600">
            Please log in to access this content.
          </h1>
          <Link to="/login" className="text-blue-500 text-center block mt-4">
            Go to Login
          </Link>
        </>
      )}
    </>
  );
};

export default AuthenticateAdminRoutes;
