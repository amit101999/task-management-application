import { type JSX, useEffect } from 'react'
import { useSelector } from 'react-redux'
import type { RootState } from '../redux/store'
import { useNavigate } from 'react-router'

const AuthenticateUserRoutes = ({ children }: { children: JSX.Element }) => {
  const { user } = useSelector((state: RootState) => state.user)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else if (user.role !== "MEMBER") {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) {
    return null; // Will redirect to login
  }

  if (user.role !== "MEMBER") {
    return null; // Will redirect to admin dashboard
  }

  return children
}

export default AuthenticateUserRoutes