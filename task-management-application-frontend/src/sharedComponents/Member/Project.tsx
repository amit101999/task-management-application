import axios from "axios";
import {
  Calendar,
  CheckCircle,
  Circle,
  Clock,
  Filter,
  Search,
  Target,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";

interface PropType {
  selectedProject: ProjectType;
  userId: string | undefined;
}

const ProjectTask = ({ selectedProject, userId }: PropType) => {
  const [tasks, setTasks] = useState<Task[]>();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setTasks(selectedProject?.tasks);
  }, [selectedProject]);

  // const [project, setProject] = useState<ProjectType[]>()

  useEffect(() => {
    const fetchProjectsByid = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/project/getProject/${
            selectedProject.id
          }`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token") || ""
              )}`,
            },
          }
        );

        // console.log("hello",res.data.data.tasks)
        const data = res.data.data.tasks.filter(
          (item: any) => item.assignedTo?.id === userId
        );
        setTasks(data);
        
        // Calculate progress based on filtered tasks
        const closedTask = data.filter(
          (item: any) => item.taskStatus === "CLOSED"
        );
        const calculatedProgress = data.length ? (closedTask.length / data.length) * 100 : 0;
        setProgress(calculatedProgress);
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };
    fetchProjectsByid();
  }, [selectedProject, setTasks]);

  const getStatusBadge = (status: string) => {
    const baseClasses =
      "px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium";
    switch (status) {
      case "Done":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "In Progress":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getPriorityBadge = (priority: string) => {
    const baseClasses = "px-2 py-1 rounded text-xs font-medium";
    switch (priority) {
      case "High":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "Medium":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case "Low":
        return `${baseClasses} bg-green-100 text-green-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Done":
        return <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />;
      case "In Progress":
        return <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500" />;
      default:
        return <Circle className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />;
    }
  };

  const getProjectStatusBadge = (status: string) => {
    const baseClasses =
      "px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium inline-block";
    switch (status) {
      case "COMPLETED":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "ACTIVE":
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case "UPCOMING":
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="w-full max-w-full overflow-hidden">
      {/* Stats Cards - Enhanced Responsiveness */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 min-w-0">
          <div className="flex flex-col space-y-2">
            <p className="text-xs sm:text-sm text-gray-600 truncate">Status</p>
            <div className="flex items-center justify-center sm:justify-start">
              <span className={getProjectStatusBadge(selectedProject?.status)}>
                <span className="hidden sm:inline">
                  {selectedProject?.status}
                </span>
                <span className="sm:hidden">
                  {selectedProject?.status?.substring(0, 6)}
                  {selectedProject?.status?.length > 6 ? "..." : ""}
                </span>
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">
                Progress
              </p>
              <p className="text-base sm:text-lg font-bold text-gray-800">
                {progress.toFixed(2)}%
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-blue-100 rounded-full flex-shrink-0">
              <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600" />
            </div>
          </div>
          {/* Progress Bar */}
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-500 h-2 rounded-full transition-all duration-300 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Tasks</p>
              <p className="text-base sm:text-lg font-bold text-gray-800">
                {tasks?.length || 0}
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-green-100 rounded-full flex-shrink-0">
              <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3 sm:p-4 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <p className="text-xs sm:text-sm text-gray-600 truncate">Team</p>
              <p className="text-base sm:text-lg font-bold text-gray-800">
                {selectedProject?.users?.length || 0}
              </p>
            </div>
            <div className="p-1.5 sm:p-2 bg-purple-100 rounded-full flex-shrink-0">
              <Users className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="space-y-4">
        {/* Header and Controls - Enhanced Mobile Layout */}
        <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="text-base sm:text-lg font-medium text-gray-800">
            Project Tasks
          </h4>

          {/* Search and Filter Controls */}
          <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-3">
            <div className="relative flex-1 sm:flex-initial">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                className="w-full sm:w-48 md:w-56 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm"
              />
            </div>

            <div className="relative flex-1 sm:flex-initial">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <select className="w-full sm:w-auto pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white text-sm">
                <option value="All">All Status</option>
                <option value="Todo">Todo</option>
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
              </select>
            </div>
          </div>
        </div>

        {/* Task Cards - Enhanced Responsive Layout */}
        <div className="space-y-3 sm:space-y-4">
          {tasks?.map((task: Task) => (
            <div
              key={task.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="space-y-3 sm:space-y-4">
                {/* Task Header */}
                <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 mt-0.5">
                      {getStatusIcon(task.taskStatus)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-medium text-gray-800 text-sm sm:text-base break-words">
                        {task.title}
                      </h5>
                    </div>
                  </div>

                  {task.priority && (
                    <div className="flex-shrink-0 self-start">
                      <span className={getPriorityBadge(task.priority)}>
                        {task.priority}
                      </span>
                    </div>
                  )}
                </div>

                {/* Task Details */}
                <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-4">
                    <span className="flex items-center text-xs sm:text-sm text-gray-600">
                      <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                      <span className="truncate">
                        Due: {task.dueDate?.split("T")[0]}
                      </span>
                    </span>

                    <div className="sm:hidden">
                      <span className={getStatusBadge(task.taskStatus)}>
                        {task.taskStatus}
                      </span>
                    </div>
                  </div>

                  {/* Action Area */}
                  <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:items-center sm:space-x-3">
                    <div className="hidden sm:block">
                      <span className={getStatusBadge(task.taskStatus)}>
                        {task.taskStatus}
                      </span>
                    </div>

                    <button className="w-full sm:w-auto px-3 py-1.5 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 transition-colors font-medium">
                      Update Status
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectTask;
