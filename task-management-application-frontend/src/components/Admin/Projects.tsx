import { useEffect, useState } from "react";
import {
  FolderOpen,
  Users,
  Plus,
  Eye,
  Edit,
  Trash2,
  Calendar,
} from "lucide-react";
import SideBar from "../../sharedComponents/Admin/SideBar";
import Header from "../../sharedComponents/Admin/Header";
import CreateProject from "./CreateProject";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { Link } from "react-router";
import { useDispatch } from "react-redux";
import { filterProjects } from "../../redux/projectSlice";
import { UseFetchProject } from "../../hooks/hookProject";

const ProjectsPage = () => {
  
  UseFetchProject();

  const dispatch = useDispatch();
  const [activeFilter, setActiveFilter] = useState<
    "ALL" | "ACTIVE" | "COMPLETED" | "UPCOMING"
  >("ALL");
  const [showCreateModal, setShowCreateModal] = useState(false);
  //  const {projects} = useSelector((store : RootState ) => store.projects)
  const { filteredProjects } = useSelector(
    (store: RootState) => store.projects
  );

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-blue-100 text-blue-800";
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "UPCOMING":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  useEffect(() => {
    dispatch(filterProjects(activeFilter));
  }, [activeFilter]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Sidebar */}
      <SideBar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <Header />

        {/* Projects Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4 md:p-6">
          {/* Header with Create Button */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                Projects Overview
              </h2>
              <p className="text-sm sm:text-base text-gray-600 mt-1">
                Manage and track all your projects
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">Create New Project</span>
              <span className="sm:hidden">Create</span>
            </button>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-xl border border-gray-200 p-3 sm:p-4 mb-6">
            <div className="flex flex-wrap gap-2">
              {(["ALL", "ACTIVE", "COMPLETED", "UPCOMING"] as const).map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-colors ${
                      activeFilter === filter
                        ? "bg-blue-100 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100"
                    }`}
                  >
                    {filter}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Projects List */}
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {/* Desktop Table Header - Hidden on mobile */}
            <div className="hidden lg:block bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="grid grid-cols-12 gap-2 text-sm font-semibold text-gray-600">
                <div className="col-span-3">Project</div>
                <div className="col-span-1">Status</div>
                <div className="col-span-2 text-center">Due Date</div>
                <div className="col-span-2 text-center">Start Date</div>
                <div className="col-span-2 text-center">Members</div>
                <div className="col-span-1 text-center">Edit</div>
                <div className="col-span-1 text-center">delete</div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-gray-200">
              {filteredProjects?.map((project) => (
                <div
                  key={project.id}
                  className="p-3 sm:p-4 lg:px-6 lg:py-4 hover:bg-gray-50 transition-colors"
                >
                  {/* Desktop Layout */}
                  <div className="hidden lg:grid grid-cols-12 gap-2 items-center">
                    {/* Project Info */}
                    <div className="col-span-3">
                      <div className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FolderOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <Link
                            to={`/projects/${project.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            <h3 className="font-medium text-gray-900 truncate">
                              {project.projectName}
                            </h3>
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* Status */}
                    <div className="col-span-1">
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            project.status
                          )}`}
                        >
                          {project.status}
                        </span>
                      </div>
                    </div>

                    {/* Due Date */}
                    <div className="col-span-2 flex justify-center">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{project.endDate?.split("T")[0]}</span>
                      </div>
                    </div>

                    <div className="col-span-2 flex justify-center">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{project.startDate?.split("T")[0]}</span>
                      </div>
                    </div>

                    {/* Members */}
                    <div className="col-span-2  justify-center flex">
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        <span>{project._count?.users || 0} members</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="col-span-1 items-center justify-center flex">
                      <div className="flex items-center space-x-1">
                        <span className="t hover:underline hover:cursor-pointer">
                          Edit{" "}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Edit className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="col-span-1 items-center justify-center flex">
                      <div className="flex items-center ">
                        <span className="t hover:underline hover:cursor-pointer">
                          Delete{" "}
                        </span>
                        <button className="p-1 text-gray-400 hover:text-red-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Mobile/Tablet Layout */}
                  <div className="lg:hidden space-y-3">
                    {/* Project Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FolderOpen className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <Link
                            to={`/projects/${project.id}`}
                            className="text-blue-600 hover:underline"
                          >
                            <h3 className="font-medium text-gray-900 truncate">
                              {project.projectName}
                            </h3>
                          </Link>
                        </div>
                      </div>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ml-2 ${getStatusColor(
                          project.status
                        )}`}
                      >
                        {project.status}
                      </span>
                    </div>

                    {/* Project Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          Due: {project.endDate?.split("T")[0]}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate">
                          Start: {project.startDate?.split("T")[0]}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 text-gray-600">
                        <Users className="w-4 h-4 flex-shrink-0" />
                        <span>{project._count?.users || 0} members</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end items-center space-x-2 pt-2 border-t border-gray-100">
                      <button className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-green-600 transition-colors rounded-lg hover:bg-green-50">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {filteredProjects?.length === 0 && (
              <div className="text-center py-12 px-4">
                <FolderOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-sm sm:text-base">
                  No projects found matching your criteria
                </p>
              </div>
            )}
          </div>
        </main>
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <CreateProject setShowCreateModal={setShowCreateModal} />
      )}
    </div>
  );
};

export default ProjectsPage;
