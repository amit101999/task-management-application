import React, { useState } from "react";
import { Mail, Lock, Eye, EyeOff, User, Upload } from "lucide-react";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/userSlice";
// import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import signupImage from "../assets/19712.jpg";

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
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
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
            w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 text-sm sm:text-base
            ${icon ? "pl-10 sm:pl-11" : ""}
            ${className}
          `}
          {...props}
        />
      </div>
    </div>
  );
};

// Profile Image Components
interface ProfileImageProps {
  setDetails: (prevState: any) => void;
}

const ProfileImageCircle = () => {
  const [preview, setPreview] = useState<string | null>(null);

  // Listen for file changes from the upload button
  React.useEffect(() => {
    const handleFileChange = (e: any) => {
      if (e.detail && e.detail.preview) {
        setPreview(e.detail.preview);
      }
    };
    window.addEventListener('profileImageChanged' as any, handleFileChange);
    return () => {
      window.removeEventListener('profileImageChanged' as any, handleFileChange);
    };
  }, []);

  return (
    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-2 border-gray-200 flex items-center justify-center overflow-hidden bg-gray-50 flex-shrink-0">
      {preview ? (
        <img src={preview} alt="Profile preview" className="w-full h-full object-cover" />
      ) : (
        <User className="w-6 h-6 sm:w-8 sm:h-8 text-gray-400" />
      )}
    </div>
  );
};

const ProfileImageUploadButton = ({ setDetails }: ProfileImageProps) => {
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    if (file.type.startsWith('image/')) {
      setDetails((prevState: any) => ({ ...prevState, profileImage: file }));
      const reader = new FileReader();
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        // Dispatch custom event to update the circle
        window.dispatchEvent(new CustomEvent('profileImageChanged', { detail: { preview } }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 ">
        Profile Image
      </label>
      <div
        className={`
          relative border-2 border-dashed rounded-lg px-3 sm:px-4 py-2 sm:py-3 transition-colors cursor-pointer flex items-center gap-2
          ${dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
        `}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          name="profileImage"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInput}
          accept="image/*"
        />
        <Upload className="h-4 w-4 text-gray-400 flex-shrink-0" />
        <p className="text-xs sm:text-sm text-gray-600 flex-1">
          <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
        </p>
        <span className="text-xs text-gray-500 flex-shrink-0">PNG, JPG up to 5MB</span>
      </div>
    </div>
  );
};

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
        formData
      );
      dispatch(loginSuccess(res.data.data));
      // storing token in localstorage
      localStorage.setItem("token", JSON.stringify(res.data.token));

      toast.success("Signup Successfull");
      setLoader(false);
      navigate("/member/dashboard");
    } catch (err) {
      setLoader(false);
      toast.error("User Already Exists");
      console.log(err);
    }
  };



  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 via-white to-gray-50 flex items-center justify-center   sm:p-4 overflow-hidden">
      <div className="w-full max-w-6xl h-full max-h-[95vh]">
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col lg:flex-row h-full">
          {/* Left Side - Signup Form */}
          <div className="w-full lg:w-1/2 p-4 sm:p-6 lg:p-8 flex flex-col justify-center overflow-hidden">
              {/* Logo and Header */}
              <div className="text-center lg:text-left  sm:mb-4">
                {/* Create Account heading with Profile Circle */}
                <div className="flex items-center justify-between lg:justify-start gap-8 ">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                    Create Account
                  </h1>
                  <ProfileImageCircle />
                </div>
              </div>

            {/* Signup Form */}
            <form className="space-y-3 sm:space-y-4">
              {/* Full Name */}
              <Input
                label="Full Name"
                type="text"
                name="name"
                value={deatils.name}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                icon={<User size={16} className="sm:w-4 sm:h-4" />}
              />

              {/* Email */}
              <Input
                label="Email Address"
                type="email"
                name="email"
                value={deatils.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                icon={<Mail size={16} className="sm:w-4 sm:h-4" />}
              />

              {/* Password */}
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={deatils.password}
                  onChange={handleInputChange}
                  placeholder="Create a password"
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

              {/* Confirm Password */}
              <div className="relative">
                <Input
                  label="Confirm Password"
                  value={deatils.confirmPassword}
                  onChange={handleInputChange}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  icon={<Lock size={16} className="sm:w-4 sm:h-4" />}
                />
                <button
                  type="button"
                  className="absolute right-3 top-7 sm:top-8 text-gray-400 hover:text-gray-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff size={16} className="sm:w-4 sm:h-4" />
                  ) : (
                    <Eye size={16} className="sm:w-4 sm:h-4" />
                  )}
                </button>
              </div>

              {/* Profile Image Upload Button */}
              <ProfileImageUploadButton setDetails={setDetails} />

              {/* Create Account Button */}
              <Button
                variant="primary"
                className="w-full"
                size="lg"
                type="submit"
                onClick={(e) => handleRegisterUser(e)}
              >
                {loader ? (
                  <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                ) : (
                  <>Create Account</>
                )}
              </Button>

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

            {/* Login Link */}
            <div className="mt-2 text-center">
              <p className="text-xs text-gray-600">
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
          </div>

          {/* Right Side - Signup Image */}
          <div className="w-full lg:w-1/2 bg-white hidden lg:flex overflow-hidden">
            <img
              src={signupImage}
              alt="Signup Illustration"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
