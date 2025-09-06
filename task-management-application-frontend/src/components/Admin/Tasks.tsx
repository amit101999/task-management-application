import React, { useEffect, useState } from "react";
import {
  CheckSquare,
  Plus,
  Calendar,
  ChevronDown,
  AlertCircle,
} from "lucide-react";
import SideBar from "../../sharedComponents/Admin/SideBar";
import Header from "../../sharedComponents/Admin/Header";
import CreateTask from "./CreateTask";
import type { RootState } from "../../redux/store";
import { useSelector } from "react-redux";
import { UsefetchTask } from "../../hooks/hookTask";
import { clearFilter, filterByName, filterByStatus, filterProjectByName } from "../../redux/taskSlice";
import { useDispatch } from "react-redux";

const TasksPage: React.FC = () => {
UsefetchTask()
  const dispatch = useDispatch();

  const [activeStatusFilter, setActiveStatusFilter] = useState<
    "All" | "OPEN" | "INPROGRESS" | "CLOSED"
  >("All");
  const [activeMemberFilter, setActiveMemberFilter] = useState<string>("All");
  const [activeProjectFilter, setActiveProjectFilter] = useState<string>("All");
  const [showCreateModal, setShowCreateModal] = useState(false);
  let { users } = useSelector((state: RootState) => state.user);
  const {user} = useSelector((state: RootState) => state.user);
  const { projects } = useSelector((state: RootState) => state.projects);
  const { filterTasks } = useSelector((state: RootState) => state.tasks);
  console.log(filterTasks[5]?.assignedTo)
  console.log(filterTasks[5]?.project)

  // dont show the current user in the member filter
  users = users.filter((u) => u.id !== user?.id);
  
// filter by projectname
 useEffect(()=>{
  if(activeProjectFilter === "All") { 
    dispatch(clearFilter())
  } else {
    dispatch(filterProjectByName(activeProjectFilter.toLocaleLowerCase()));
  }
 },[activeProjectFilter])

 
useEffect(() => {
  if(activeStatusFilter === "All") { 
    dispatch(clearFilter())
  }else {
    console.log(activeStatusFilter)
    dispatch(filterByStatus(activeStatusFilter));
  }
},[activeStatusFilter])

//  filter by member name
 useEffect(()=>{
  console.log(activeMemberFilter)
  if(activeMemberFilter === "All") { 
    dispatch(clearFilter())
  } else {
    dispatch(filterByName(activeMemberFilter.toLocaleLowerCase()));
  }
 },[activeMemberFilter])
  

  const getStatusColor = (status: string) => {
    switch (status) {
      case "OPEN":
        return "bg-gray-100 text-gray-800";
      case "INPROGRESS":
        return "bg-blue-100 text-blue-800";
      case "CLOSED":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "bg-red-100 text-red-800";
      case "Medium":
        return "bg-yellow-100 text-yellow-800";
      case "Low":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <SideBar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <Header />

        {/* Tasks Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4 md:p-6">
          {/* Header with Create Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Task Management
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Track and manage all project tasks
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create Task</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 mb-6">
            {/* Status Filter */}
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Filter by Status
              </h3>
              <div className="flex flex-wrap gap-2">
                {(["All", "OPEN", "INPROGRESS", "CLOSED"] as const).map(
                  (status) => (
                    <button
                      key={status}
                      onClick={() => setActiveStatusFilter(status)}
                      className={`px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                        activeStatusFilter === status
                          ? "bg-blue-100 text-blue-700"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      {status} 
                    </button>
                  )
                )}
              </div>
            </div>

            {/* Member and Project Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {/* Member Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Filter by Member
                </h3>
                <div className="relative">
                  <select
                    value={activeMemberFilter}
                    onChange={(e) => setActiveMemberFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
                  >
                    <option value="All">All Members</option>
                    {users?.map((member) => (
                      <option key={member.id} value={member.name}>
                        {member.name}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>

              {/* Project Filter */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Filter by Project
                </h3>
                <div className="relative">
                  <select
                    value={activeProjectFilter}
                    onChange={(e) => setActiveProjectFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-sm"
                  >
                    <option value="All">All Projects</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.projectName}>
                        {project.projectName}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Tasks Table */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Desktop Table Header - Hidden on mobile */}
            <div className="hidden lg:block bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-600">
                <div className="col-span-4">Task</div>
                <div className="col-span-2">Assigned To</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-2">Due Date</div>
                <div className="col-span-2">Project</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filterTasks?.map((task, index) => (
                <div
                  key={task.id}
                  className="p-3 sm:p-4 lg:px-6 lg:py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Desktop Layout */}
                  <div className="hidden lg:grid grid-cols-12 gap-4 items-center">
                    {/* Task Info */}
                    <div className="col-span-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <CheckSquare className="w-4 h-4 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-gray-900 truncate">
                            {task.title}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {task.description}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Assigned Users */}
                    <div className="col-span-2">
                      <span className="text-sm text-gray-700">
                        {filterTasks[index]?.assignedTo?.name}
                      </span>
                    </div>

                    {/* Status */}
                    <div className="col-span-2">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            task?.taskStatus
                          )}`}
                        >
                          {task?.taskStatus}
                        </span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="col-span-2">
                      <div
                        className={`flex items-center space-x-2 text-sm ${
                          isOverdue(task?.dueDate)
                            ? "text-red-600"
                            : "text-gray-600"
                        }`}
                      >
                        {isOverdue(task.dueDate) ? (
                          <AlertCircle className="w-4 h-4" />
                        ) : (
                          <Calendar className="w-4 h-4" />
                        )}
                        <span>
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    {/* Project */}
                    <div className="col-span-2">
                      <span className="text-sm text-gray-600 truncate">
                        {task?.project?.projectName}
                      </span>
                    </div>
                  </div>

                  {/* Mobile/Tablet Layout */}
                  <div className="lg:hidden space-y-3">
                    {/* Task Header */}
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CheckSquare className="w-4 h-4 text-blue-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 break-words">
                          {task.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-1 break-words">
                          {task.description}
                        </p>
                      </div>
                    </div>

                    {/* Status Badges */}
                    <div className="flex flex-wrap gap-2 ml-11">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          task?.taskStatus
                        )}`}
                      >
                        {task?.taskStatus}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
                          task.priority
                        )}`}
                      >
                        {task.priority}
                      </span>
                    </div>

                    {/* Task Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 ml-11 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Assigned to:</span>
                        <div className="text-gray-600 mt-1 break-words">
                          {filterTasks[index]?.assignedTo?.name}
                        </div>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Project:</span>
                        <div className="text-gray-600 mt-1 break-words">
                          {task?.project?.projectName}
                        </div>
                      </div>
                      <div className="sm:col-span-2">
                        <span className="font-medium text-gray-700">Due Date:</span>
                        <div
                          className={`flex items-center space-x-2 mt-1 ${
                            isOverdue(task.dueDate)
                              ? "text-red-600"
                              : "text-gray-600"
                          }`}
                        >
                          {isOverdue(task.dueDate) ? (
                            <AlertCircle className="w-4 h-4 flex-shrink-0" />
                          ) : (
                            <Calendar className="w-4 h-4 flex-shrink-0" />
                          )}
                          <span>
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filterTasks?.length === 0 && (
              <div className="text-center py-12 px-4">
                <CheckSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm sm:text-base">
                  No tasks found matching your criteria
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Task Modal */}
      {showCreateModal && (
        <CreateTask
          users={users}
          projects={projects}
          setShowCreateModal={setShowCreateModal}
        />
      )}
    </div>
  );
};

export default TasksPage;