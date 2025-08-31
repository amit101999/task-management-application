import { useState } from 'react';
import { Search, Calendar, ChevronRight, Target, ArrowLeft } from 'lucide-react';
import Header from '../../sharedComponents/Member/Header';
import Sidebar from '../../sharedComponents/Member/Sidebar';
import ProjectTask from '../../sharedComponents/Member/Project';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';

const MemberProjects = () => {
  const [selectedProject, setSelectedProject] = useState(null);

  const { user } = useSelector((store: RootState) => store.user)
  const { filteredProjects } = useSelector((store: RootState) => store.projects);
  const tasks = user?.tasks

  const returnClosedTask = (project) => {
    const closedTask = project?.tasks?.filter((item) => item.taskStatus === "CLOSED")
    return closedTask
  }

  const getProjectTasks = (projectId: string) => {
    return tasks?.filter(task => task.id === projectId);
  };

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
                      onClick={() => setSelectedProject(project)}
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
                              <span className="whitespace-nowrap">Due: {project?.endDate.split("T")[0]}</span>
                            </div>

                            <div className="flex items-center text-xs sm:text-sm text-gray-600">
                              <Target className="w-3 h-3 sm:w-4 sm:h-4 mr-1 flex-shrink-0" />
                              <span className="whitespace-nowrap">{returnClosedTask(project).length}/{project?.tasks?.length} Task</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-800">{Math.round((returnClosedTask(project).length / project?.tasks?.length) * 100) || 0}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.round((returnClosedTask(project).length / project?.tasks?.length) * 100) || 0}%` }}
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
                    onClick={() => setSelectedProject(null)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors flex-shrink-0"
                  >
                    <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
                  </button>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">{selectedProject.projectName}</h3>
                    <p className="text-sm sm:text-base text-gray-600 line-clamp-2">{selectedProject.description}</p>
                  </div>
                </div>
                {/* Project Tasks */}
                <ProjectTask selectedProject={selectedProject} userId={user?.id} />
              </>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MemberProjects;