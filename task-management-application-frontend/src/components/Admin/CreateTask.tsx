import axios from "axios";
import { Calendar, ChevronDown, FileText, X } from "lucide-react";
import { useState } from "react";
import { addTask } from "../../redux/taskSlice";
import { useDispatch } from "react-redux";

interface propType {
  setShowCreateModal: (string: boolean) => void;
  users: UserType[];
  projects: ProjectType[];
}
const CreateTask = ({ setShowCreateModal, users, projects }: propType) => {
  const [loader, setLoader] = useState<boolean>(false);
  const disptach = useDispatch();
  // hook to create new task;
  const [taskData, setTaskData] = useState({
    title: "",
    description: "",
    dueDate: "",
    assignedUser: "",
    status: "OPEN",
    projectName: "",
    priority: "Medium",
    userEmail: "",
  });
  const handleChange = (e: any) => {
    setTaskData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    setLoader(true);
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
    setLoader(false);
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
              Task Title
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="title"
                value={taskData.title}
                onChange={handleChange}
                placeholder="Enter task title..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={taskData.description}
              onChange={handleChange}
              rows={3}
              placeholder="Enter task description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* Project Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project
            </label>
            <div className="relative">
              <select
                name="projectName"
                value={taskData.projectName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
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
          </div>

          {/* Assign Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assign To
            </label>
            <div className="space-y-2 max-h-40 overflow-y-auto">
              {users.map((member) => (
                <label
                  key={member.id}
                  className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer"
                >
                  <input
                    name="assignedUser"
                    value={member.id}
                    type="radio"
                    onChange={(e) => {
                      console.log(member.email);
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
          </div>

          {/* Due Date and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Due Date
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="date"
                  name="dueDate"
                  onChange={handleChange}
                  value={taskData.dueDate}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Priority
              </label>
              <select
                name="priority"
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select priority...</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {loader ? (
              <>
                <div className="w-6 h-6 animate-spin rounded-full border-4 border-white border-t-transparent"></div>{" "}
              </>
            ) : (
              <> Create Task</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateTask;
