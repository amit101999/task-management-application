import axios from "axios";
import { Calendar, ChevronDown, FileText, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import { addTask } from "../../redux/taskSlice";
import { useDispatch } from "react-redux";

interface propType {
  setShowCreateModal: (string: boolean) => void;
  users: UserType[];
  projects: ProjectType[];
}

interface ValidationErrors {
  title?: string;
  description?: string;
  projectName?: string;
  assignedUser?: string;
  dueDate?: string;
  priority?: string;
}

const CreateTask = ({ setShowCreateModal, users, projects }: propType) => {
  const [loader, setLoader] = useState<boolean>(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const disptach = useDispatch();

  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedUser: "",
    status: "OPEN",
    projectName: "",
    priority: "",
    userEmail: "",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setTaskData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate title
    if (!taskData.title.trim()) {
      newErrors.title = "Task title is required";
    }

    // Validate description
    if (!taskData.description.trim()) {
      newErrors.description = "Description is required";
    }

    // Validate project
    if (!taskData.projectName) {
      newErrors.projectName = "Please select a project";
    }

    // Validate assigned user
    if (!taskData.assignedUser) {
      newErrors.assignedUser = "Please assign task to a user";
    }

    // Validate due date
    if (!taskData.dueDate) {
      newErrors.dueDate = "Due date is required";
    }

    // Validate priority
    if (!taskData.priority) {
      newErrors.priority = "Please select a priority";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setLoader(true);
    try {
      const Data = {
        ...taskData,
        dueDate: new Date(taskData.dueDate).toISOString(),
      };
      const newTask = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/task/createTask`,
        Data,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") || ""
            )}`,
          },
        }
      );
      const data = newTask.data.data;
      disptach(addTask(data));
      setShowCreateModal(false);
      // Reset form
      setTaskData({
        title: "",
        description: "",
        dueDate: "",
        assignedUser: "",
        status: "OPEN",
        projectName: "",
        priority: "",
        userEmail: "",
      });
      setErrors({});
    } catch (err) {
      console.log("Error in creating task", err);
    } finally {
      setLoader(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-lg w-full">
        {/* Modal Header */}
        <div className="flex items-center justify-between  border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Create New Task
          </h3>
          <button
            onClick={() => setShowCreateModal(false)}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {/* Task Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Task Title <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                placeholder="Enter task title..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.title
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {errors.title && (
              <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.title}</span>
              </div>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter task description..."
              className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
                errors.description
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:ring-blue-500"
              }`}
            />
            {errors.description && (
              <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.description}</span>
              </div>
            )}
          </div>

          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <select
                name="projectName"
                value={taskData.projectName}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent appearance-none ${
                  errors.projectName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              >
                <option value="">Select project...</option>
                {projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.projectName}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
            </div>
            {errors.projectName && (
              <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.projectName}</span>
              </div>
            )}
          </div>

          {/* Assign Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To <span className="text-red-500">*</span>
            </label>
            <div className={`space-y-2 max-h-40 overflow-y-auto border rounded-lg p-2 ${
              errors.assignedUser ? "border-red-500" : "border-transparent"
            }`}>
              {users.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <input
                    name="assignedUser"
                    value={member.id}
                    type="radio"
                    checked={taskData.assignedUser === member.id}
                    onChange={(e) => {
                      setTaskData((prev) => ({
                        ...prev,
                        userEmail: member.email,
                      }));
                      handleChange(e);
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <img
                    src={member.avatar || ""}
                    alt={member.name}
                    className="w-8 h-8 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {member.name}
                    </p>
                    <span className="text-xs text-gray-500">
                      {member.department}
                    </span>
                  </div>
                </label>
              ))}
            </div>
            {errors.assignedUser && (
              <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.assignedUser}</span>
              </div>
            )}
          </div>

          {/* Due Date and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  name="dueDate"
                  onChange={handleChange}
                  value={taskData.dueDate}
                  min={new Date().toISOString().split("T")[0]}
                  className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                    errors.dueDate
                      ? "border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:ring-blue-500"
                  }`}
                />
              </div>
              {errors.dueDate && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.dueDate}</span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority <span className="text-red-500">*</span>
              </label>
              <select
                name="priority"
                onChange={handleChange}
                value={taskData.priority}
                className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.priority
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              >
                <option value="">Select priority...</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HEIGH">High</option>
              </select>
              {errors.priority && (
                <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errors.priority}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setShowCreateModal(false)}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loader}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center justify-center gap-2"
          >
            {loader ? (
              <>
                <div className="w-5 h-5 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                <span>Creating...</span>
              </>
            ) : (
              <>Create Task</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
