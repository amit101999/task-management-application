import { Link } from "react-router";
import { useState } from 'react';
import { Menu, X } from 'lucide-react';

const navItems: NavItem[] = [
    { id: "dashboard", label: "Dashboard", icon: "📊", redirect: "/member/dashboard" },
    { id: "tasks", label: "My Tasks", icon: "✅", redirect: "/member/tasks" },
    { id: "projects",label: "Projects",icon: "📁",redirect: "/member/projects"} ,
    { id: "profile",label: "Profile",icon: "👤",redirect: "/member/profile", },
  ];

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

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
        fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-4 sm:p-6 border-b border-gray-200">
          <h2 className="text-lg sm:text-xl font-bold text-blue-600">ProjectTracker</h2>
        </div>
        <nav className="p-4 sm:p-6">
          {navItems.map((item) => (
            <Link key={item.id} to={item.redirect} onClick={() => setIsOpen(false)}>
              <button
                className="w-full flex items-center px-4 py-3 mb-2 rounded-lg transition-colors duration-200 hover:bg-gray-50"
                >
                <span className="mr-3 text-base sm:text-lg">{item.icon}</span>
                <span className="font-medium text-sm sm:text-base">{item.label}</span>
              </button>
            </Link>
          ))}
        </nav>
      </div>
    </>
  )
}

export default Sidebar