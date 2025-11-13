import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import SideBar from "../../sharedComponents/Admin/SideBar";
import Header from "../../sharedComponents/Admin/Header";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";
import { socket } from "../../main";
import ActivityFeed from "./RecentTask";
import { useEffect, useState } from "react";
import axios from "axios";

type taskCountType = {
  totalTasks: number;
  openTasks: number;
  inProgressTasks: number;
  closedTasks: number;
};

type ProjectCountType = {
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
};

// Sample data for charts 

const weeklyProgressData = [
  { day: "Mon", completed: 12, inProgress: 8 },
  { day: "Tue", completed: 15, inProgress: 6 },
  { day: "Wed", completed: 18, inProgress: 9 },
  { day: "Thu", completed: 22, inProgress: 7 },
  { day: "Fri", completed: 25, inProgress: 5 },
  { day: "Sat", completed: 8, inProgress: 3 },
  { day: "Sun", completed: 6, inProgress: 2 },
];

const AdminDashboard = () => {
  socket.on("newTask", (task) => {
    console.log("New task assigned:", task);
    // Update state for notifications/activities
  });

  const { projects } = useSelector((store: RootState) => store.projects);
  const { tasks } = useSelector((store: RootState) => store.tasks);
  const { user } = useSelector((store: RootState) => store.user);

  const [projectCount, setProjectCount] = useState<ProjectCountType>({
    totalProjects: projects?.length,
    activeProjects: projects?.filter((p) => p.status === "ACTIVE").length,
    completedProjects: projects?.filter((p) => p.status === "COMPLETED").length,
  });
  const [taskCount, setTaskCount] = useState<taskCountType>({
    totalTasks: tasks?.length,
    openTasks: tasks?.filter((t) => t.taskStatus === "OPEN").length,
    inProgressTasks: tasks?.filter((t) => t.taskStatus === "INPROGRESS").length,
    closedTasks: tasks?.filter((t) => t.taskStatus === "CLOSED").length,
  });

  useEffect(() => {
    const fetchData = async () => {
      const [PC, TC] = await Promise.all([
        axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/project/get/getTotalProjectCount`
        ),
        axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/task/get/getTotaltaskCount`
        ),
      ]);
      setProjectCount((prev) => ({
        ...prev,
        totalProjects: PC.data.totalProjectCount,
      }));
      setTaskCount((prev) => ({
        ...prev,
        totalTasks: TC.data.totalTaskCount,
      }));
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const [PC, TC] = await Promise.all([
        axios.get(
          `${
            import.meta.env.VITE_BASE_URL
          }/api/project/get/getAllProjectCountByStatus`
        ),
        axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/task/get/taskcountbystatus`
        ),
      ]);
      console.log("task Count by status:", TC.data.data);
      setProjectCount((prev) => ({
        ...prev,
        activeProjects: PC.data.data[0]._count,
        completedProjects: PC.data.data[1]?._count,
      }));
      setTaskCount((prev) => ({
        ...prev,
        openTasks: TC.data.data[0]?._count,
        inProgressTasks: TC.data.data[2]?._count,
        closedTasks: TC.data.data[1]?._count,
      }));
    };

    fetchData();
  }, []);

  const taskStatusData = [
    { name: "Open", value: taskCount.openTasks, color: "#10b981" },
    {
      name: "In Progress",
      value: taskCount.inProgressTasks ? taskCount.inProgressTasks : 0,
      color: "#3b82f6",
    },
    { name: "completed", value: taskCount.closedTasks, color: "#f59e0b" },
    // { name: 'Blocked', value: 10, color: '#ef4444' }
  ];

  const overviewCards = [
    {
      title: "Total Projects",
      value: projectCount.totalProjects,
      change: "+12%",
      color: "bg-blue-50 border-blue-200",
    },
    {
      title: "Total Tasks",
      value: taskCount.totalTasks,
      change: "+8%",
      color: "bg-green-50 border-green-200",
    },
    {
      title: "Tasks In Progress",
      value: taskCount.inProgressTasks ? taskCount.inProgressTasks : 0,
      change: "+5%",
      color: "bg-yellow-50 border-yellow-200",
    },
    {
      title: "Completed Tasks",
      value: taskCount.closedTasks,
      change: "+23%",
      color: "bg-purple-50 border-purple-200",
    },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <SideBar />
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <Header />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-3 sm:p-4 md:p-6">
          {/* Welcome Message */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Hello, {user?.name}👋
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              Here's what's happening with your projects today.
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {overviewCards.map((card, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl border-2 ${card.color} p-4 md:p-6 transition-all hover:shadow-md`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">
                    {card.title}
                  </h3>
                  <span className="text-xs font-medium text-green-600 whitespace-nowrap">
                    {card.change}
                  </span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {/* Task Status Pie Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                Task Status Distribution
              </h3>
              <div className="h-48 sm:h-56 md:h-64">
                {taskCount.totalTasks === 0 && (
                  <span className="text-xl">No Task or Project Found</span>
                )}
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={taskStatusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {taskStatusData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-4 mt-4">
                {taskStatusData?.map((item, index) => (
                  <div key={index} className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2 flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-xs sm:text-sm text-gray-600 truncate">
                      {item.name} : {item.value}{" "}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Progress Bar Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">
                Weekly Progress
              </h3>
              <div className="h-48 sm:h-56 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar
                      dataKey="completed"
                      fill="#10b981"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="inProgress"
                      fill="#3b82f6"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    Completed
                  </span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-xs sm:text-sm text-gray-600">
                    In Progress
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <ActivityFeed />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
