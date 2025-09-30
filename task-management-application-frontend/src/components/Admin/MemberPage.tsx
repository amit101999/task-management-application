import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  Mail,
  MoreHorizontal,
  Filter,
  User,
  Crown,
  Shield,
  Users,
  
} from "lucide-react";
import SideBar from "../../sharedComponents/Admin/SideBar";
import Header from "../../sharedComponents/Admin/Header";
import { UsefetchUsers } from "../../hooks/hookUsers";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { useDispatch } from "react-redux";
import {
  clearFilter,
  filterUser,
  filterUserByDepartment,
} from "../../redux/userSlice";

const MembersPage = () => {
  UsefetchUsers();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const { filteredUser } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  console.log(filteredUser[0]);

  useEffect(() => {
    dispatch(filterUser(searchQuery));
  }, [searchQuery]);

  useEffect(() => {
    if (selectedRole === "All") {
      dispatch(clearFilter());
    } else {
      console.log("all");
      dispatch(filterUserByDepartment(selectedRole));
    }
  }, [selectedRole]);

  const getRoleIcon = (role: string = "") => {
    switch (role) {
      case "DEVELOPER":
        return <Crown className="w-4 h-4 text-amber-600" />;
      case "DESIGNER":
        return <Shield className="w-4 h-4 text-blue-600" />;
      case "TESTER":
        return <User className="w-4 h-4 text-green-600" />;
      case "DEVOPS":
        return <User className="w-4 h-4 text-purple-600" />;
      default:
        return <User className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-amber-50 text-amber-700 border-amber-200";
      case "Manager":
        return "bg-blue-50 text-blue-700 border-blue-200";
      case "Developer":
        return "bg-green-50 text-green-700 border-green-200";
      case "Designer":
        return "bg-purple-50 text-purple-700 border-purple-200";
      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      <SideBar />
      {/* Header */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4 lg:p-6">
          {/* Header with Create Button */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3 sm:gap-0">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Members
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Manage team members and their roles
              </p>
            </div>
            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors text-sm sm:text-base"
            >
              <Plus className="w-4 h-4" />
              <span>Add Member</span>
            </button>
          </div>

          {/* Filters and Search */}
          <div className="max-w-7xl mx-auto px-0 sm:px-6 py-3 sm:py-6">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
              <div className="relative flex-1 max-w-full sm:max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search members..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                />
              </div>

              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-gray-500" />
                <select
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base min-w-0"
                >
                  <option value="All">All Roles</option>
                  <option value="Tester">Tester</option>
                  <option value="Devops">Devops</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                </select>
              </div>
            </div>

            {/* Members Table - Desktop */}
            <div className="hidden lg:block bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Member
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Tasks
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="text-left py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined
                      </th>
                      {/* <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        View profile
                      </th>
                       <th className="text-right py-3 px-6 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th> */}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {filteredUser?.map((member) => (
                      <tr
                        key={member.id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm">
                              <img src={member?.avatar || ""} />
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">
                                {member.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {member.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <div
                            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getRoleColor(
                              member.role
                            )}`}
                          >
                            {getRoleIcon(member?.department)}
                            {member?.department}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                            {member?._count?.tasks || 0} tasks
                          </button>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                              (member as any)?.status === "Active"
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            <div
                              className={`w-2 h-2 rounded-full ${
                                (member as any).status === "Active" || null
                                  ? "bg-green-500"
                                  : "bg-gray-400"
                              }`}
                            />
                            active
                          </span>
                        </td>
                        <td className="py-4 px-6 text-sm text-gray-600">
                          {typeof (member as any)?.createdAt === 'string' ? String((member as any)?.createdAt).split("T")[0] : ''}
                          {/* {new Date(member.joinedDate).toLocaleDateString()} */}
                        </td>
                        {/* <td className="py-4 px-6 text-right">
                          <button className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors">
                            <Eye />
                          </button>
                        </td> */}
                        {/* <td className="py-4 px-6 text-right">
                          <button className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors">
                            <MessageCircleIcon />
                          </button>
                        </td> */}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Members Cards - Mobile & Tablet */}
            <div className="lg:hidden space-y-3 sm:space-y-4">
              {filteredUser?.map((member) => (
                <div
                  key={member.id}
                  className="bg-white rounded-lg border border-gray-200 p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-medium text-sm sm:text-base flex-shrink-0">
                        {member.avatar}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-medium text-gray-900 text-sm sm:text-base truncate">
                          {member.name}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-500 truncate">
                          {member.email}
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600 p-1 rounded transition-colors flex-shrink-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                    <div
                      className={`inline-flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 rounded-full font-medium border ${getRoleColor(
                        member.role
                      )}`}
                    >
                      {getRoleIcon(member?.department)}
                      <span className="truncate">{member?.department}</span>
                    </div>

                    <button className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                      {member?._count?.tasks || 0} tasks
                    </button>

                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full font-medium ${
                        (member as any).status === "Active"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      <div
                        className={`w-2 h-2 rounded-full ${
                          (member as any).status === "Active" || null
                            ? "bg-green-500"
                            : "bg-gray-400"
                        }`}
                      />
                      active
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-4 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                <div className="flex items-center gap-2">
                  <Users className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 flex-shrink-0" />
                  <h3 className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base truncate">
                    Total Members
                  </h3>
                </div>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 mt-1">
                  {filteredUser?.length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                  <h3 className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base truncate">
                    Active
                  </h3>
                </div>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 mt-1">
                  {filteredUser?.length}
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                <div className="flex items-center gap-2">
                  <Crown className="w-4 sm:w-5 h-4 sm:h-5 text-amber-600 flex-shrink-0" />
                  <h3 className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base truncate">
                    Admins
                  </h3>
                </div>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 mt-1">
                  1
                </p>
              </div>
              <div className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
                <div className="flex items-center gap-2">
                  <User className="w-4 sm:w-5 h-4 sm:h-5 text-green-600 flex-shrink-0" />
                  <h3 className="font-medium text-gray-900 text-xs sm:text-sm lg:text-base truncate">
                    Developers
                  </h3>
                </div>
                <p className="text-lg sm:text-2xl font-semibold text-gray-900 mt-1">
                  2
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Add Member Modal */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
              Add New Member
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
                  placeholder="Enter email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base">
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Manager">Manager</option>
                  <option value="Admin">Admin</option>
                </select>
              </div>

              <div className="flex items-start gap-2 p-3 bg-blue-50 rounded-lg">
                <Mail className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-blue-700">
                  An invitation email will be sent to the member
                </span>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAddMemberModalOpen(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm sm:text-base"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm sm:text-base"
                >
                  Send Invitation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembersPage;
