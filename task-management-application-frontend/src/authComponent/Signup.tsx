import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, Target, User } from "lucide-react";
import ProfileImageUpload from "./FileUpload";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";

// TypeScript Interfaces
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "google";
  size?: "lg";
  children: React.ReactNode;
}

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

// Design System Components
const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  size = "lg",
  children,
  className = "",
  ...props
}) => {
  const baseClasses =
    "font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2";

  const variants = {
    primary:
      "bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm",
    google:
      "bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 focus:ring-gray-500 shadow-sm",
  };

  const sizes = {
    lg: "px-6 py-3 text-base",
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ label, icon, className = "", ...props }: InputProps) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            {icon}
          </div>
        )}
        <input
          className={`
            w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200
            ${icon ? "pl-11" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
};

const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div
      className={`bg-white rounded-xl shadow-lg border border-gray-200 p-8 ${className}`}
    >
      {children}
    </div>
  );
};

// Profile Image Upload Component

// Main Signup Component
const SignupPage: React.FC = () => {
  const [loader, setLoader] = useState<Boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deatils, setDetails] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    profileImage: "",
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = (e: any) => {
    setDetails((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegisterUser = async (e: any) => {
    setLoader(true);
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", deatils.name);
    formData.append("email", deatils.email);
    formData.append("password", deatils.password);
    formData.append("profileImage", deatils.profileImage);

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/createUser`,
        formData,
        { withCredentials: true }
      );
      dispatch(loginSuccess(res.data.data));
      console.log(res.data.data);
      toast.success("Signup Successfull");
      setLoader(false);
      navigate("/member/dashboard");
    } catch (err) {
      setLoader(false);
      toast.error("User Already Exists");
      console.log(err);
    }
  };

  // const loginwithGoogle = useGoogleLogin({
  //   onSuccess: (tokenResponse: any) => handleGoogleSignup(tokenResponse),
  //   flow: 'auth-code',
  // });

  const handleGoogleSignup = async (data: any) => {
    console.log(data);
    if (data.code !== "") {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/user/signup-with-google?code=${
          data.code
        }`
      );
      console.log(res);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="w-full max-w-2xl lg:max-w-3xl xl:max-w-4xl">
        <Card className="backdrop-blur-sm bg-white/80 border-white/20 shadow-xl p-6 sm:p-8">
          {/* Logo and Header */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Create Account
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Join Project Tracker and start collaborating
            </p>
          </div>

          {/* Signup Form */}
          <form className="space-y-4 sm:space-y-6">
            {/* Full Name and Email - Stack on mobile, side by side on larger screens */}
            <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0">
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={deatils.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                icon={<User size={18} className="sm:w-5 sm:h-5" />}
              />

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={deatils.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                icon={<Mail size={18} className="sm:w-5 sm:h-5" />}
              />
            </div>

            {/* Password and Confirm Password - Stack on mobile, side by side on larger screens */}
            <div className="flex flex-col lg:flex-row lg:space-x-6 space-y-4 lg:space-y-0">
              <div className="relative w-full">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={deatils.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
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

              {/* Confirm Password */}
              <div className="relative w-full">
                <Input
                  label="Confirm Password"
                  value={deatils.confirmPassword}
                  onChange={handleInputChange}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  icon={<Lock size={18} className="sm:w-5 sm:h-5" />}
                />
                <button
                  type="button"
                  className="absolute right-3 top-8 sm:top-9 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} className="sm:w-5 sm:h-5" />
                  ) : (
                    <Eye size={18} className="sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Profile Image Upload */}
            <ProfileImageUpload setDetails={setDetails} />

            {/* Terms and Conditions */}
            <div className="flex items-start space-x-3">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <label
                htmlFor="terms"
                className="text-xs sm:text-sm text-gray-600"
              >
                I agree to the{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Terms of Service
                </button>{" "}
                and{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  Privacy Policy
                </button>
              </label>
            </div>

            {/* Create Account Button */}
            <Button
              variant="primary"
              className="w-full"
              size="lg"
              type="submit"
              onClick={(e) => handleRegisterUser(e)}
            >
              {loader ? (
                <div className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 mx-auto"></div>
              ) : (
                <>Create Account</>
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
          {/* <Button
            variant="google"
            className="w-full"
            size="lg"
            type="button"
            onClick={() => loginwithGoogle()}
          >
            Signup With Google
          </Button> */}

          {/* Login Link */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login">
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                >
                  Login
                </button>
              </Link>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SignupPage;
