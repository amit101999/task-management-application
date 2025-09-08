import axios from "axios";
import { Calendar, FileText, X } from "lucide-react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addProject } from "../../redux/projectSlice";

interface propType {
  setShowCreateModal: (string: boolean) => void;
}
const CreateProject = ({ setShowCreateModal }: propType) => {
  const [projectDetail, setProjectDetail] = useState({
    projectName: "",
    description: "",
    endDate: "",
    startDate: "",
  });

  const [loader, setLoader] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e: any) => {
    setProjectDetail((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (): Promise<void> => {
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
      console.log(data);
      dispatch(addProject(data));
      setLoader(false);
    } catch (err) {
      setLoader(false);
      console.log("Error in creating project", err);
    }
    setShowCreateModal(false);
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
              Project Name
            </label>
            <div className="relative">
              <FileText className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                name="projectName"
                value={projectDetail.projectName}
                onChange={handleChange}
                placeholder="Enter project name..."
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
              value={projectDetail.description}
              onChange={handleChange}
              cols={30}
              rows={3}
              placeholder="Enter project description..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
          </div>

          {/* start date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                name="startDate"
                value={projectDetail.startDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="date"
                name="endDate"
                value={projectDetail.endDate}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
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
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            {loader ? (
              <>
                <div className="w-6 h-6 animate-spin rounded-full border-4 border-white border-t-transparent"></div>{" "}
              </>
            ) : (
              <> Create Project</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateProject;
