import React, { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, Target } from "lucide-react";
import { Link, useNavigate } from "react-router";
// import { useLogin } from '../hooks/hookUsers';
import { Button } from "../UIComponents/AuthButtons";
import { Input } from "../UIComponents/Input";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useGoogleLogin } from "@react-oauth/google";
import { socket } from "../main";
import projectManagerImage from "../assets/projectmanager_1.jpg"

// Main Login Component
const LoginPage: React.FC = () => {
  const [loader, setLoader] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [userState, setUserState] = useState<{
    email: string;
    password: string;
  }>({
    email: "",
    password: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // getting user from state
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    // If user is already logged in, redirect to dashboard
    if (user) {
      if (user.role == "ADMIN") {
        navigate("/");
      } else {
        navigate("/member/dashboard");
      }
    }
  }, [user, navigate]);

  const loginwithGoogle = useGoogleLogin({
    onSuccess: (tokenResponse: any) => handleGoogleLogin(tokenResponse),
    flow: "auth-code",
  });

  const handleGoogleLogin = async (data: any) => {
    if (data.code !== "") {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/login-with-google?code=${
          data.code
        }`,
        {},
        { withCredentials: true }
      );

      console.log(res);

      const userData = res.data.user;
      // storing token in localstorage
      localStorage.setItem("token", JSON.stringify(res.data.token));
      dispatch(loginSuccess(userData));
      toast.success("Login Successfull");
      // Redirect based on user role
      navigate("/member/dashboard");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserState((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  // reusable login function
  const performLogin = async (credentials: {
    email: string;
    password: string;
  }) => {
    setLoader(true);
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/login`,
        credentials
      );
      const data = res.data.data;
      console.log(data);
      // storing token in localstorage
      localStorage.setItem("token", JSON.stringify(res.data.token));

      // join user room on the basis of the room id
      if (data.role === "ADMIN") {
        socket.emit("join-admin");
      } else {
        socket.emit("join-user", data.id);
      }

      // sending socket to join the room
      dispatch(loginSuccess(data));
      toast.success("Login Successfull");
      // Redirect based on user role
      data.role === "ADMIN" ? navigate("/") : navigate("/member/dashboard");
      setLoader(false);
    } catch (err) {
      setLoader(false);
      toast.error("Wrong credentials");
      console.log(err);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await performLogin(userState);
  };

  const quickAdminSignIn = async () => {
    const adminCreds = { email: "admin@gmail.com", password: "root" };
    setUserState(adminCreds);
    // Do not auto-submit; user will click Sign In
  };

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="w-full max-w-6xl h-full max-h-[95vh]">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row h-full">
          {/* Left Side - Login Form */}
          <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center overflow-hidden">
            {/* Logo and Header */}
            <div className="text-center lg:text-left mb-3 sm:mb-4">
              <div className="mx-auto lg:mx-0 w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center mb-2 shadow-lg">
                <Target className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
                Welcome Back
              </h1>
              <p className="text-xs sm:text-sm text-gray-600">
                Sign in to your Project Tracker account
              </p>
            </div>

            {/* Login Form */}
            <form className="space-y-3 sm:space-y-4" onSubmit={handleSubmit}>
              <Input
                value={userState.email}
                label="Email Address"
                type="email"
                name="email"
                handleChange={handleChange}
                placeholder="Enter your email"
                icon={<Mail size={16} className="sm:w-4 sm:h-4" />}
              />

              <div className="relative">
                <Input
                  value={userState.password}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  handleChange={handleChange}
                  placeholder="Enter your password"
                  icon={<Lock size={16} className="sm:w-4 sm:h-4" />}
                />
                <button
                  type="button"
                  className="absolute right-3 top-7 sm:top-8 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff size={16} className="sm:w-4 sm:h-4" />
                  ) : (
                    <Eye size={16} className="sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>

              {/* Forgot Password Link */}
              <div className="flex items-center justify-end -mt-1">
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-500 font-medium transition-colors"
                >
                  Forgot your password?
                </button>
              </div>

              {/* Login Button */}
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                type="submit"
              >
                {loader ? (
                  <>
                    <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  </>
                ) : (
                  <> Sign In</>
                )}
              </Button>

              {/* Quick Admin Sign In Link */}
              <div className="text-center -mt-1">
                <button
                  type="button"
                  onClick={quickAdminSignIn}
                  className="text-xs text-blue-600 hover:text-blue-500 font-medium"
                >
                  Sign in as Admin
                </button>
              </div>

              {/* Divider */}
              <div className="relative -my-1">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-3 bg-white text-gray-500 font-medium">
                    or
                  </span>
                </div>
              </div>
            </form>

            {/* Google Login Button */}
            <Button
              variant="google"
              className="w-full mt-1"
              size="lg"
              type="button"
              onClick={() => loginwithGoogle()}
            >
              Continue with Google
            </Button>

            {/* Sign Up Link */}
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-600">
                Don't have an account?{" "}
                <Link to="/signup">
                  <button
                    type="button"
                    className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                  >
                    Sign up
                  </button>
                </Link>
              </p>
            </div>
          </div>

          {/* Right Side - Project Manager Image */}
          <div className="w-full lg:w-1/2 bg-white hidden lg:flex overflow-hidden">
            <img
              src={projectManagerImage}
              alt="Project Manager Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
