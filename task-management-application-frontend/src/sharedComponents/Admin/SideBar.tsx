import { Link } from "react-router";
import { 
  Home, 
  FolderOpen, 
  CheckSquare, 
  Users, 
  Settings,
  Menu,
  X
} from 'lucide-react';
import { useState } from 'react';

const SideBar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const sidebarItems = [
    { icon: Home, label: 'Dashboard', active: true , redirect :"/" },
    { icon: FolderOpen, label: 'Projects', active: false , redirect :"/projects" },
    { icon: CheckSquare, label: 'Tasks', active: false , redirect :"/tasks" },
    { icon: Users, label: 'Members', active: false , redirect :"/members" },
    { icon: Settings, label: 'Profile', active: false , redirect :"/profile" }
  ];

  return (
    <>
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 bg-white rounded-lg shadow-lg border border-gray-200"
        >
          {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 flex flex-col transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-4 sm:px-6 border-b border-gray-200">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-xs sm:text-sm">PT</span>
          </div>
          <span className="ml-3 text-lg sm:text-xl font-semibold text-gray-900">
            ProjectTracker
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 sm:px-4 py-6 space-y-2">
          {sidebarItems.map((item, index) => (
            <Link
              key={index}
              to={item.redirect}
              onClick={() => setIsOpen(false)}
              className={`flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                item.active
                  ? "bg-blue-50 text-blue-700 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <item.icon className="w-4 h-4 sm:w-5 sm:h-5 mr-3" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default SideBar;
