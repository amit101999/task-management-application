import React from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Sidebar from '../../sharedComponents/Member/Sidebar';
import Header from '../../sharedComponents/Member/Header';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { UsefetchTaskByUserId } from '../../hooks/hookTask';
import { UseFetchProjectByUserId } from '../../hooks/hookProject';
import RecentTasksTable from './RecenTasksTable';
// Types
interface ProjectData {
  name: string;
  value: number;
  color: string;
}

interface TaskData {
  name: string;
  value: number;
  color: string;
}

// interface RecentTask {
//   id: number;
//   taskName: string;
//   projectName: string;
//   status: 'Open' | 'In Progress' | 'Completed';
//   dueDate: string;
// }

// Sample data
// const recentTasks: RecentTask[] = [
//   { id: 1, taskName: 'Design Homepage Layout', projectName: 'Website Redesign', status: 'In Progress', dueDate: '2024-08-20' },
//   { id: 2, taskName: 'Setup Database Schema', projectName: 'E-commerce Platform', status: 'Completed', dueDate: '2024-08-15' },
//   { id: 3, taskName: 'User Authentication API', projectName: 'Mobile App', status: 'Open', dueDate: '2024-08-25' },
//   { id: 4, taskName: 'Testing Payment Gateway', projectName: 'E-commerce Platform', status: 'In Progress', dueDate: '2024-08-18' },
//   { id: 5, taskName: 'Create Admin Panel', projectName: 'CRM System', status: 'Open', dueDate: '2024-08-30' },
//   { id: 6, taskName: 'Optimize Performance', projectName: 'Website Redesign', status: 'Completed', dueDate: '2024-08-12' },
//   { id: 7, taskName: 'Implement Search Feature', projectName: 'Mobile App', status: 'In Progress', dueDate: '2024-08-22' }
// ];

// Components
const WelcomeSection = ({ openProject, openTask }: { openProject: ProjectType[] | undefined, openTask: Task[] | undefined }) => {
  return (
    <div className="bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 text-white mb-4 sm:mb-6 lg:mb-8 shadow-lg mx-3 sm:mx-0">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        <div className="min-w-0 flex-1">
          <h1 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-bold mb-2">Welcome back</h1>
          <p className="text-sm sm:text-base lg:text-lg text-purple-100">
            You have <span className="font-semibold">{openProject?.length} projects active</span> and <span className="font-semibold">{openTask?.length} tasks in progress</span>
          </p>
        </div>
        <div className="w-full lg:w-auto">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 sm:p-4">
            <div className="text-xs sm:text-sm text-purple-100">Today's Focus</div>
            <div className="text-lg sm:text-xl font-semibold">{openTask?.length} Tasks Due</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProjectsChart = ({ projects, activeProject, completedProject, upcompingProject }: any) => {
  console.log(projects?.legth)
  const projectsData: ProjectData[] = [
    { name: 'All Projects', value: projects?.length ?? 0, color: '#8B5CF6' },
    { name: 'Active', value: activeProject?.length ?? 0, color: '#10B981' },
    { name: 'Completed', value: completedProject?.length ?? 0, color: '#3B82F6' },
    { name: 'Upcoming', value: upcompingProject?.length ?? 0, color: '#F59E0B' }
  ];

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Projects Overview</h2>
      <div className="h-60 sm:h-72 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={projectsData} margin={{ top: 20, right: 10, left: 10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              fontSize={12}
              tick={{ fontSize: 11 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis fontSize={12} />
            <Tooltip />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {projectsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-4 sm:mt-6">
        {projectsData.map((item, index) => (
          <div key={index} className="text-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mx-auto mb-1 sm:mb-2" style={{ backgroundColor: item.color }}></div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">{item.name}</div>
            <div className="text-sm sm:text-lg font-bold text-gray-800">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const TasksChart = ({ openTask, closedTask, inprogresTask }: any) => {

  const tasksData: TaskData[] = [
    { name: 'Open', value: openTask?.length || 0, color: '#3B82F6' },
    { name: 'In Progress', value: inprogresTask?.length || 0, color: '#F59E0B' },
    { name: 'Closed', value: closedTask?.length || 0, color: '#10B981' }
  ];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? 'start' : 'end'}
        dominantBaseline="central"
        className="text-xs sm:text-sm font-semibold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg">
      <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">Tasks Status</h2>
      <div className="h-60 sm:h-72 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={tasksData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {tasksData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-3 gap-2 sm:gap-4 mt-4 sm:mt-6">
        {tasksData.map((item, index) => (
          <div key={index} className="text-center">
            <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full mx-auto mb-1 sm:mb-2" style={{ backgroundColor: item.color }}></div>
            <div className="text-xs sm:text-sm text-gray-600 truncate">{item.name}</div>
            <div className="text-sm sm:text-lg font-bold text-gray-800">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};


// Main Dashboard Component
const MemberDashboard: React.FC = () => {

  const { user } = useSelector((state: RootState) => state.user)
  const { filterTasks } = useSelector((state: RootState) => state.tasks)
  const { filteredProjects } = useSelector((state: RootState) => state.projects)
  UsefetchTaskByUserId(user?.id)
  UseFetchProjectByUserId(user?.id)
  const tasks = filterTasks
  const projects = filteredProjects
  console.log(tasks)
  const openTask = tasks?.filter((item) => item.taskStatus === "OPEN")
  const inprogresTask = tasks?.filter((item) => item.taskStatus === "INPROGRESS")
  const closedTask = tasks?.filter((item) => item.taskStatus === "CLOSED")

  const activeProject = projects?.filter((item) => item.status === "ACTIVE")
  const completedProject = projects?.filter((item) => item.status === "COMPLETED")
  const upcompingProject = projects?.filter((item) => item.status === "UPCOMING")
  // console.log(activeProject)

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col lg:flex-row">
      {/* Sidebar */}
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <Header />

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <WelcomeSection openProject={activeProject} openTask={openTask} />

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-4 sm:mb-6 lg:mb-8">
            <ProjectsChart projects={projects} activeProject={activeProject} completedProject={completedProject} upcompingProject={upcompingProject} />
            <TasksChart tasks={tasks} openTask={openTask} closedTask={closedTask} inprogresTask={inprogresTask} />
          </div>

          <RecentTasksTable />
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;