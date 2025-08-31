import React, { use, useState } from "react";
import {
  User,
  Lock,
  Edit3,
  Save,
  X,
  Camera,
  Bell,
  Shield,
  Activity,
} from "lucide-react";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import Sidebar from "../../sharedComponents/Member/Sidebar";

const MemberProfile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { user } = useSelector((state: RootState) => state.user);
  console.log(user);
  // Mock admin data
  const [adminProfile, setAdminProfile] = useState<UserType | null>();

  useState(() => {
    setAdminProfile(user);
  });

  const [editForm, setEditForm] = useState(adminProfile);

  const handleSave = () => {
    setAdminProfile(editForm);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditForm(adminProfile);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof AdminProfile, value: string) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <Sidebar />
      {/* Header */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-3 sm:py-4 lg:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 truncate">
                  Profile
                </h1>
                <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-1">
                  Manage your account settings and preferences
                </p>
              </div>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium text-xs sm:text-sm lg:text-base w-full sm:w-auto"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 px-3 sm:px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors font-medium text-xs sm:text-sm lg:text-base"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center justify-center gap-2 bg-green-600 text-white px-3 sm:px-4 py-2 rounded-lg hover:bg-green-700 transition-colors font-medium text-xs sm:text-sm lg:text-base"
                  >
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 sticky top-4">
                <div className="text-center">
                  <div className="relative inline-block">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-lg sm:text-xl lg:text-2xl mx-auto">
                      {user?.avatar}
                    </div>
                    {isEditing && (
                      <button className="absolute bottom-0 right-0 w-6 h-6 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors">
                        <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                      </button>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mt-3 sm:mt-4 truncate">
                    {user?.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 mt-2">
                    <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-amber-600 flex-shrink-0" />
                    <span className="text-xs sm:text-sm bg-amber-50 text-amber-700 px-2 py-1 rounded-full border border-amber-200 truncate">
                      {user?.role}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm lg:text-base text-gray-600 mt-2">Developer</p>
                </div>

                <div className="mt-4 sm:mt-6 space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <User className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 truncate">
                      Joining Date : {user?.createdAt?.split("T")[0]}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm">
                    <Activity className="w-3 h-3 sm:w-4 sm:h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-600 truncate">
                      Last login : 12/08/2025
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Personal Information */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Personal Information
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Full Name
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm lg:text-base"
                        />
                      ) : (
                        <p className="text-xs sm:text-sm lg:text-base text-gray-900 py-2 truncate">{user?.name}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm lg:text-base"
                        />
                      ) : (
                        <p className="text-xs sm:text-sm lg:text-base text-gray-900 py-2 truncate">{user?.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) =>
                            handleInputChange("phone", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm lg:text-base"
                        />
                      ) : (
                        <p className="text-xs sm:text-sm lg:text-base text-gray-900 py-2 truncate">{user?.phone}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                        Department
                      </label>
                      {isEditing ? (
                        <select
                          value={editForm.department}
                          onChange={(e) =>
                            handleInputChange("department", e.target.value)
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-xs sm:text-sm lg:text-base"
                        >
                          <option value="Engineering">Engineering</option>
                          <option value="Product">Product</option>
                          <option value="Design">Design</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Sales">Sales</option>
                        </select>
                      ) : (
                        <p className="text-xs sm:text-sm lg:text-base text-gray-900 py-2 truncate">{user?.department}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Security Settings
                </h3>

                <div className="space-y-3 sm:space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 space-y-2 sm:space-y-0 gap-2">
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base truncate">Password</p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Last updated 3 months ago
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setShowPasswordModal(true)}
                      className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm flex-shrink-0 text-left sm:text-right"
                    >
                      Change Password
                    </button>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 border-b border-gray-100 space-y-2 sm:space-y-0 gap-2">
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base truncate">
                          Email Notifications
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Receive updates about projects and tasks
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
                      <input
                        type="checkbox"
                        defaultChecked
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 space-y-2 sm:space-y-0 gap-2">
                    <div className="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 flex-shrink-0 mt-0.5 sm:mt-0" />
                      <div className="min-w-0 flex-1">
                        <p className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base truncate">
                          Two-Factor Authentication
                        </p>
                        <p className="text-xs sm:text-sm text-gray-600">
                          Add an extra layer of security
                        </p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-700 font-medium text-xs sm:text-sm flex-shrink-0 text-left sm:text-right">
                      Enable 2FA
                    </button>
                  </div>
                </div>
              </div>

              {/* Account Statistics */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6">
                <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                  Account Activity
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <Activity className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 flex-shrink-0" />
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base truncate">
                        Projects Created
                      </h4>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mt-1">
                      12
                    </p>
                  </div>

                  {user?.role === "ADMIN" && (
                    <div className="bg-green-50 rounded-lg p-3 sm:p-4">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                        <h4 className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base truncate">
                          Total Tasks
                        </h4>
                      </div>
                      <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mt-1">
                        5
                      </p>
                    </div>
                  )}
                  <div className="bg-purple-50 rounded-lg p-3 sm:p-4">
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0" />
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base truncate">
                        Login Sessions
                      </h4>
                    </div>
                    <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900 mt-1">
                      156
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-3 sm:p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Change Password
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter current password"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Confirm new password"
                />
              </div>

              <div className="flex items-start gap-2 p-3 bg-amber-50 rounded-lg">
                <Lock className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-amber-700">
                  Password must be at least 8 characters long
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Update Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MemberProfile;