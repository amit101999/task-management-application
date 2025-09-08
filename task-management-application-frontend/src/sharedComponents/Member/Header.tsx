import { Bell, LogOut } from "lucide-react";
// import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/userSlice";
import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { logoutUserTask } from "../../redux/taskSlice";
import { logoutUserProject } from "../../redux/projectSlice";

const Header = () => {
  const { user } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    localStorage.removeItem("token");
    dispatch(logoutUser());
    dispatch(logoutUserTask());
    dispatch(logoutUserProject());
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="flex items-center justify-between px-4 sm:px-6 py-4">
        <div className="flex items-center">
          <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">
            Hello , {user?.name} 👋
          </h2>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <img
              src={user?.avatar}
              className="w-6 h-6 sm:w-8 sm:h-8 rounded-full"
            />
            <span className="hidden sm:block text-sm font-medium text-gray-700"></span>
          </div>

          <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors flex space-x-2 ">
            <LogOut className="w-4 h-4 sm:w-5 sm:h-5" onClick={handleSignOut} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
