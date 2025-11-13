import { useState } from 'react';
import { Search, Calendar, ChevronRight, Target, ArrowLeft } from 'lucide-react';
import Header from '../../sharedComponents/Member/Header';
import Sidebar from '../../sharedComponents/Member/Sidebar';
import ProjectTask from '../../sharedComponents/Member/Project';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import axios from 'axios';

const MemberProjects = () => {
  const [selectedProject, setSelectedProject] = useState<ProjectType | null>(null);
  const [projectProgress, setProjectProgress] = useState<Record<string, number>>({});
  const [loadingProject, setLoadingProject] = useState(false);

  const { user } = useSelector((store: RootState) => store.user)
  const { filteredProjects } = useSelector((store: RootState) => store.projects);

  // Optimized: Only fetch progress when needed (lazy loading)
  // Removed sequential fetching for all projects on mount

  // Fetch progress for a single project when needed
  const fetchProjectProgress = async (projectId: string) => {
    if (projectProgress[projectId] !== undefined || !user?.id) {
      return projectProgress[projectId] || 0;
    }

    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/project/getProject/${projectId}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") || ""
            )}`,
          },
        }
      );
      
      const tasks = res.data.data.tasks.filter(
        (item: any) => item.assignedTo?.id === user.id
      );
      
      const closedTasks = tasks.filter(
        (item: any) => item.taskStatus === "CLOSED"
      );
      
      const progress = tasks.length ? (closedTasks.length / tasks.length) * 100 : 0;
      setProjectProgress(prev => ({ ...prev, [projectId]: progress }));
      return progress;
    } catch (error) {
      console.error(`Error fetching progress for project ${projectId}:`, error);
      setProjectProgress(prev => ({ ...prev, [projectId]: 0 }));
      return 0;
    }
  };

  const getProjectProgress = (projectId: string) => {
    return projectProgress[projectId] || 0;
  }

  // Handle project click with loading state
  const handleProjectClick = async (project: ProjectType) => {
    setLoadingProject(true);
    setSelectedProject(project);
    // Fetch progress in background
    await fetchProjectProgress(project.id);
    setLoadingProject(false);
  };

  // const getProjectTasks = (projectId: string) => {
  //   return tasks?.filter(task => task.id === projectId);
  // };

  const getProjectStatusBadge = (status: string) => {
    const baseClasses = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case 'COMPLETED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'ACTIVE':
        return `${baseClasses} bg-blue-100 text-blue-800`;
      case 'UPCOMING':
        return `${baseClasses} bg-gray-100 text-gray-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <Header />

        {/* Page Content */}
        <main className="p-4 sm:p-6">
          <div className="space-y-4 sm:space-y-6">
            {!selectedProject ? (
              <>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">My Projects</h3>

                  <div className="relative w-full sm:w-auto">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search projects..."
                      className="w-full sm:w-auto pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none text-sm sm:text-base"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:gap-6 grid-cols-1 ">
                  {filteredProjects?.map((project) => (
                    <div
                      key={project.id}
                      className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => handleProjectClick(project)}
                    >
                      <div className="flex items-start justify-between mb-3 sm:mb-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="text-base sm:text-lg font-medium text-gray-800 truncate pr-2">{project.projectName}</h4>
                            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 flex-shrink-0" />
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 mb-3 line-clamp-2">{project.description}</p>

                          <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                            <span className={getProjectStatusBadge(project.status)}>
                              {project.status}
                            </span>

                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                              <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                              <span className="whitespace-nowrap">Due: {project?.endDate?.split("T")[0]}</span>
                            </div>

                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                              <span className="whitespace-nowrap">{project?._count?.tasks ?? 0} Task</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-800">{getProjectProgress(project.id).toFixed(1)}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${getProjectProgress(project.id)}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between mt-3 sm:mt-4">
                        <button className="text-blue-600 hover:text-blue-800 text-xs sm:text-sm font-medium">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Project Details Header */}
                <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <button
                    onClick={() => {
                      setSelectedProject(null);
                      setLoadingProject(false);
                    }}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{selectedProject?.projectName}</h3>
                    <p className="text-sm sm:text-base text-gray-600 line-clamp-2">{selectedProject?.description}</p>
                  </div>
                </div>
                {/* Project Tasks with Loading State */}
                {loadingProject ? (
                  <div className="flex items-center justify-center py-12">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading project details...</p>
                    </div>
                  </div>
                ) : (
                  <ProjectTask selectedProject={selectedProject} userId={user?.id} />
                )}
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MemberProjects;