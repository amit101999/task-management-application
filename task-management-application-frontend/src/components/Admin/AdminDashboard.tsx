import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import SideBar from '../../sharedComponents/Admin/SideBar';
import Header from '../../sharedComponents/Admin/Header';
import { UsefetchTask } from '../../hooks/hookTask';
import { UseFetchProject } from '../../hooks/hookProject';
import { useSelector } from 'react-redux';
import type { RootState } from '../../redux/store';
import { UsefetchUsers } from '../../hooks/hookUsers';
import { socket } from '../../main';
import ActivityFeed from './RecentTask';

// Sample data for charts

const weeklyProgressData = [
  { day: 'Mon', completed: 12, inProgress: 8 },
  { day: 'Tue', completed: 15, inProgress: 6 },
  { day: 'Wed', completed: 18, inProgress: 9 },
  { day: 'Thu', completed: 22, inProgress: 7 },
  { day: 'Fri', completed: 25, inProgress: 5 },
  { day: 'Sat', completed: 8, inProgress: 3 },
  { day: 'Sun', completed: 6, inProgress: 2 }
];

const AdminDashboard = () => {

  socket.on("newTask", (task) => {
    console.log("New task assigned:", task);
    // Update state for notifications/activities
  });

  // fetching all users in redux
  UsefetchTask()
  UseFetchProject()
  UsefetchUsers()



  const { projects } = useSelector((store: RootState) => store.projects);
  const { tasks } = useSelector((store: RootState) => store.tasks);
  const { user } = useSelector((store: RootState) => store.user);


  const openTasks = tasks.filter(task => task.taskStatus === 'OPEN');
  const inProgressTasks = tasks.filter(task => task.taskStatus === 'INPROGRESS');
  const closedTasks = tasks.filter(task => task.taskStatus === 'CLOSED');

  const taskStatusData = [
    { name: 'Open', value: openTasks.length, color: '#10b981' },
    { name: 'In Progress', value: inProgressTasks.length, color: '#3b82f6' },
    { name: 'completed', value: closedTasks.length, color: '#f59e0b' },
    // { name: 'Blocked', value: 10, color: '#ef4444' }
  ];


  const overviewCards = [
    { title: 'Total Projects', value: projects.length, change: '+12%', color: 'bg-blue-50 border-blue-200' },
    { title: 'Total Tasks', value: tasks.length, change: '+8%', color: 'bg-green-50 border-green-200' },
    { title: 'Tasks In Progress', value: inProgressTasks.length, change: '+5%', color: 'bg-yellow-50 border-yellow-200' },
    { title: 'Completed Tasks', value: closedTasks.length, change: '+23%', color: 'bg-purple-50 border-purple-200' }
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
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Hello, {user?.name}👋</h2>
            <p className="text-sm sm:text-base text-gray-600">Here's what's happening with your projects today.</p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
            {overviewCards.map((card, index) => (
              <div key={index} className={`bg-white rounded-xl border-2 ${card.color} p-4 md:p-6 transition-all hover:shadow-md`}>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs sm:text-sm font-medium text-gray-600 truncate pr-2">{card.title}</h3>
                  <span className="text-xs font-medium text-green-600 whitespace-nowrap">{card.change}</span>
                </div>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 md:gap-6">
            {/* Task Status Pie Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Task Status Distribution</h3>
              <div className="h-48 sm:h-56 md:h-64">
                {tasks?.length === 0 && <span className='text-xl'>No Task or Project Found</span>}
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
                    <div className="w-3 h-3 rounded-full mr-2 flex-shrink-0" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs sm:text-sm text-gray-600 truncate">{item.name} : {item.value} </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Weekly Progress Bar Chart */}
            <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
              <h3 className="text-base md:text-lg font-semibold text-gray-900 mb-4">Weekly Progress</h3>
              <div className="h-48 sm:h-56 md:h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyProgressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                    <YAxis tick={{ fontSize: 10 }} />
                    <Tooltip />
                    <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="inProgress" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center justify-center flex-wrap gap-4 md:gap-6 mt-4">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                  <span className="text-xs sm:text-sm text-gray-600">Completed</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <span className="text-xs sm:text-sm text-gray-600">In Progress</span>
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