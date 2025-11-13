import axios from "axios";
import { Calendar, FileText, X, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProject } from "../../redux/projectSlice";

interface propType {
  setShowCreateModal: (string: boolean) => void;
}

interface ValidationErrors {
  projectName?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
}

const CreateProject = ({ setShowCreateModal }: propType) => {
  const [projectDetail, setProjectDetail] = useState({
    projectName: "",
    description: "",
    endDate: "",
    startDate: "",
  });

  const [loader, setLoader] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setProjectDetail((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ValidationErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    // Validate project name
    if (!projectDetail.projectName.trim()) {
      newErrors.projectName = "Project name is required";
    } else if (projectDetail.projectName.trim().length < 3) {
      newErrors.projectName = "Project name must be at least 3 characters";
    }

    // Validate description
    if (!projectDetail.description.trim()) {
      newErrors.description = "Description is required";
    } else if (projectDetail.description.trim().length < 10) {
      newErrors.description = "Description must be at least 10 characters";
    }

    // Validate start date
    if (!projectDetail.startDate) {
      newErrors.startDate = "Start date is required";
    }

    // Validate end date
    if (!projectDetail.endDate) {
      newErrors.endDate = "End date is required";
    } else if (projectDetail.startDate && projectDetail.endDate) {
      // Check if end date is after start date
      const startDate = new Date(projectDetail.startDate);
      const endDate = new Date(projectDetail.endDate);
      if (endDate <= startDate) {
        newErrors.endDate = "End date must be after start date";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (): Promise<void> => {
    // Validate form before submitting
    if (!validateForm()) {
      return;
    }

    setLoader(true);
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/project/createProject`,
        projectDetail,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") || ""
            )}`,
          },
        }
      );
      const data = response.data.data;
      dispatch(addProject(data));
      setLoader(false);
      setShowCreateModal(false);
      // Reset form
      setProjectDetail({
        projectName: "",
        description: "",
        endDate: "",
        startDate: "",
      });
      setErrors({});
    } catch (err) {
      setLoader(false);
      console.log("Error in creating project", err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full mx-4">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Create New Project
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
          {/* Project Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Project Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="projectName"
                value={projectDetail.projectName}
                onChange={handleChange}
                placeholder="Enter project name..."
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.projectName
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {errors.projectName && (
              <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.projectName}</span>
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
              value={projectDetail.description}
              onChange={handleChange}
              cols={30}
              rows={3}
              placeholder="Enter project description..."
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

          {/* start date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                name="startDate"
                value={projectDetail.startDate}
                onChange={handleChange}
                min={new Date().toISOString().split("T")[0]}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.startDate
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {errors.startDate && (
              <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.startDate}</span>
              </div>
            )}
          </div>
          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                name="endDate"
                value={projectDetail.endDate}
                onChange={handleChange}
                min={projectDetail.startDate || new Date().toISOString().split("T")[0]}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:border-transparent ${
                  errors.endDate
                    ? "border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:ring-blue-500"
                }`}
              />
            </div>
            {errors.endDate && (
              <div className="mt-1 flex items-center gap-1 text-sm text-red-600">
                <AlertCircle className="w-4 h-4" />
                <span>{errors.endDate}</span>
              </div>
            )}
          </div>

          {/* Priority */}
          {/* <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Priority
                </label>
                <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Select priority...</option>
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                </select>
              </div> */}
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
              <>Create Project</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
