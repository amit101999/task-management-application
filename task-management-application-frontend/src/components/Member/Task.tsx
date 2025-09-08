import React, { useEffect, useState } from "react";
import {
  Search,
  Calendar,
  CheckCircle,
  Clock,
  Circle,
  Filter,
} from "lucide-react";
import Header from "../../sharedComponents/Member/Header";
import Sidebar from "../../sharedComponents/Member/Sidebar";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import axios from "axios";
import { useDispatch } from "react-redux";
import {
  clearFilter,
  filterByStatus,
  filterTaskByText,
  updateTaskStatus,
} from "../../redux/taskSlice";
// import { UsefetchTaskByUserId } from "../../hooks/hookTask";

const TaskDashboard: React.FC = () => {
  const dispatch = useDispatch();

  const [searchTerm, setSearchTerm] = useState<string>("");
  const [statusFilter, setStatusFilter] = useState<string>("ALL");
  const { filterTasks } = useSelector((state: RootState) => state.tasks);
  console.log(filterTasks);

  const filterTaskByStatus = (text: string) => {
    // console.log("text")
    if (text === "ALL") {
      dispatch(clearFilter());
      return;
    }
    dispatch(filterByStatus(text.toUpperCase()));
  };

  useEffect(() => {
    filterTaskByStatus(statusFilter);
  }, [statusFilter]);

  const filterBySearch = (text: string) => {
    if (text === "") {
      dispatch(clearFilter());
      return;
    }
    dispatch(filterTaskByText(text));
  };

  useEffect(() => {
    filterBySearch(searchTerm);
  }, [searchTerm]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return (
          <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500 flex-shrink-0" />
        );
      case "In Progress":
        return (
          <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 flex-shrink-0" />
        );
      default:
        return (
          <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
        );
    }
  };

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-flex items-center justify-center";
    switch (status) {
      case "OPEN":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "INPROGRESS":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const handleChangeStatus = async (
    id: string | undefined,
    status: "OPEN" | "INPROGRESS" | "CLOSED"
  ) => {
    try {
      if (!id) return;
      dispatch(updateTaskStatus({ id: id, status: status }));
      console.log(filterTasks);
      const res = await axios.put(
        `${import.meta.env.VITE_BASE_URL}/api/task/updateTaskStatus/${id}`,
        { data: status },
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") || ""
            )}`,
          },
        }
      );
      console.log(res.data);
    } catch (err) {
      console.log("Error in updating task status", err);
      if (id) dispatch(updateTaskStatus({ id: id, status: "OPEN" }));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <Header />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <div className="space-y-4 sm:space-y-6 max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-800">
                My Tasks
              </h3>

              {/* Search and Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                {/* Search */}
                <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search tasks..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base w-full sm:w-64"
                  />
                </div>

                {/* Status Filter */}
                <div className="relative flex-1 sm:flex-none">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white text-sm sm:text-base w-full sm:w-40"
                  >
                    <option value="ALL">All </option>
                    <option value="OPEN">Open</option>
                    <option value="INPROGRES">In Progress</option>
                    <option value="CLOSED">Closed </option>
                  </select>
                </div>
              </div>
            </div>

            {/* No Tasks Message */}
            {filterTasks?.length === 0 && (
              <div className="text-center py-8 sm:py-12">
                <div className="text-lg sm:text-xl lg:text-2xl text-gray-500">
                  Be Happy! Admin has not assigned any tasks
                </div>
                <div className="text-sm sm:text-base text-gray-400 mt-2">
                  Check back later for new assignments
                </div>
              </div>
            )}

            {/* Tasks Grid */}
            <div className="grid gap-3 sm:gap-4 lg:gap-6">
              {filterTasks?.map((task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-5 lg:p-6 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3 sm:space-y-4">
                    {/* Task Header */}
                    <div className="flex items-start gap-3">
                      {getStatusIcon(task?.taskStatus)}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-gray-800 text-sm sm:text-base lg:text-lg leading-tight">
                          {task.title}
                        </h4>
                      </div>
                    </div>

                    {/* Task Details */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                        <span>Due: {task?.dueDate?.split("T")[0]}</span>
                      </div>
                      <div className="font-medium truncate">
                        Project: {task?.project?.projectName}
                      </div>
                    </div>

                    {/* Status and Actions */}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      {/* Status Badge */}
                      <div className="flex-shrink-0">
                        <span className={getStatusBadge(task.taskStatus)}>
                          {task.taskStatus}
                        </span>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-wrap gap-2 sm:gap-3 sm:justify-end">
                        {task.taskStatus !== "CLOSED" && (
                          <>
                            <button
                              onClick={() =>
                                handleChangeStatus(task?.id, "CLOSED")
                              }
                              className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-green-100 text-green-700 rounded-md hover:bg-green-200 transition-colors font-medium text-center"
                            >
                              Mark Complete
                            </button>
                            {task.taskStatus !== "INPROGRESS" && (
                              <button
                                onClick={() =>
                                  handleChangeStatus(task?.id, "INPROGRESS")
                                }
                                className="flex-1 sm:flex-none px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors font-medium text-center"
                              >
                                Work Started
                              </button>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default TaskDashboard;
