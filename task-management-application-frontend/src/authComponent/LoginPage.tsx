import React, { useEffect, useState } from "react";
import { Mail, Lock, Eye, EyeOff, Target } from "lucide-react";
import { Link, useNavigate } from "react-router";
// import { useLogin } from '../hooks/hookUsers';
import { Button } from "../UIComponents/AuthButtons";
import { Input } from "../UIComponents/Input";
import { Card } from "../UIComponents/Card";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useGoogleLogin } from "@react-oauth/google";
import { socket } from "../main";

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
        {}, // empty body, since you only send query param
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token")
            )}`,
          },
        }
      );
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoader(true);
    e.preventDefault();
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/login`,
        userState
      );
      const data = res.data.data;
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-xl">
        <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl p-6 sm:p-8">
          {/* Logo and Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Sign in to your Project Tracker account
            </p>
          </div>

          {/* Login Form */}
          <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
            <Input
              value={userState.email}
              label="Email Address"
              type="email"
              name="email"
              handleChange={handleChange}
              placeholder="Enter your email"
              icon={<Mail size={18} className="sm:w-5 sm:h-5" />}
            />

            <div className="relative">
              <Input
                value={userState.password}
                label="Password"
                type={showPassword ? "text" : "password"}
                name="password"
                handleChange={handleChange}
                placeholder="Enter your password"
                icon={<Lock size={18} className="sm:w-5 sm:h-5" />}
              />
              <button
                type="button"
                className="absolute right-3 top-8 sm:top-9 text-gray-400 hover:text-gray-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff size={18} className="sm:w-5 sm:h-5" />
                ) : (
                  <Eye size={18} className="sm:w-5 sm:h-5" />
                )}
              </button>
            </div>

            {/* Forgot Password Link */}
            <div className="flex items-center justify-end">
              <button
                type="button"
                className="text-xs sm:text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors"
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
                  <div className="w-6 h-6 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
                </>
              ) : (
                <> Sign In</>
              )}
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-4 bg-white text-gray-500 font-medium">
                  or
                </span>
              </div>
            </div>
          </form>

          {/* Google Login Button */}
          <Button
            variant="google"
            className="w-full"
            size="lg"
            type="button"
            onClick={() => loginwithGoogle()}
          >
            Continue with Google
          </Button>

          {/* Sign Up Link */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
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
        </Card>
      </div>
    </div>
  );
};

export default LoginPage;
