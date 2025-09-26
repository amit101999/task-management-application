import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UsefetchTask } from '../../hooks/hookTask';
import { filterTaskByText, filterByStatus, filterProjectByName, clearFilter } from '../../redux/taskSlice';
import type { RootState } from '../../redux/store';
import { Search, Filter, CheckSquare, User, Calendar, Clock, CheckCircle, Circle, AlertCircle } from 'lucide-react';

const UpdatedTasksPage: React.FC = () => {
  const dispatch = useDispatch();
  const { filterTasks, loading, error, pagination } = useSelector((state: RootState) => state.tasks);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [projectId, setProjectId] = useState('');
  const [assignedUserId, setAssignedUserId] = useState('');

  // fetch tasks when filters change
  UsefetchTask(currentPage, 20, status, projectId, assignedUserId, search);

  // handle search
  const handleSearch = (value: string) => {
    setSearch(value);
    dispatch(filterTaskByText(value));
  };

  // handle status filter
  const handleStatusFilter = (value: string) => {
    setStatus(value);
    dispatch(filterByStatus(value));
  };

  // handle project filter
  const handleProjectFilter = (value: string) => {
    setProjectId(value);
    dispatch(filterProjectByName(value));
  };

  // handle user filter (removed unused function)

  // clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setProjectId('');
    setAssignedUserId('');
    dispatch(clearFilter());
  };

  // handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // get status icon
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'OPEN':
        return <Circle className="w-4 h-4 text-blue-500" />;
      case 'INPROGRESS':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'CLOSED':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      default:
        return <AlertCircle className="w-4 h-4 text-gray-500" />;
    }
  };

  // get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800';
      case 'LOW':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8 mx-auto mb-4"></div>
          <p>Loading tasks...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-2">
          <CheckSquare className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
        </div>
        <p className="text-gray-600">Manage and view all tasks</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Status Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={status}
                onChange={(e) => handleStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Status</option>
                <option value="OPEN">Open</option>
                <option value="INPROGRESS">In Progress</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
          </div>
          
          {/* Project Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={projectId}
                onChange={(e) => handleProjectFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Projects</option>
                {/* You can populate this with actual projects */}
                <option value="project1">Project 1</option>
                <option value="project2">Project 2</option>
              </select>
            </div>
          </div>
          
          {/* Clear Filters */}
          {(search || status || projectId || assignedUserId) && (
            <div>
              <button
                onClick={handleClearFilters}
                className="w-full px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Tasks Grid */}
      {filterTasks.length === 0 ? (
        <div className="text-center py-12">
          <CheckSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Tasks Found</h3>
          <p className="text-gray-600">
            {search || status || projectId || assignedUserId 
              ? 'Try adjusting your search criteria' 
              : 'No tasks have been created yet'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filterTasks.map((task) => (
              <div key={task.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 truncate pr-2">{task.title}</h3>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(task.taskStatus)}
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">{task.description}</p>
                
                <div className="space-y-2 mb-4">
                  {task.assignedTo && (
                    <div className="flex items-center text-sm text-gray-600">
                      <User className="w-4 h-4 mr-2" />
                      <span className="truncate">{task.assignedTo.name}</span>
                    </div>
                  )}
                  
                  {task.project && (
                    <div className="flex items-center text-sm text-gray-600">
                      <CheckSquare className="w-4 h-4 mr-2" />
                      <span className="truncate">{task.project.projectName}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2" />
                    <span>Due: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    Task ID: {task.id}
                  </span>
                  
                  <div className="flex space-x-2">
                    <button className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded hover:bg-blue-200 transition-colors">
                      View
                    </button>
                    <button className="px-3 py-1 text-xs bg-green-100 text-green-800 rounded hover:bg-green-200 transition-colors">
                      Edit
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Simple Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * 20) + 1} to {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} tasks
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                
                <span className="px-3 py-1 text-sm text-gray-600">
                  Page {pagination.page} of {pagination.totalPages}
                </span>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.totalPages}
                  className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default UpdatedTasksPage;
