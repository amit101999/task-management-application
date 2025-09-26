import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UseFetchActivityByUserId, UseFetchAllActivities } from '../../hooks/hookActivity';
import { filterActivitiesBySearch, filterActivitiesByType, filterActivitiesByUser, clearFilters } from '../../redux/activitySlice';
import type { RootState } from '../../redux/store';
import { Search, Filter, Activity, User, Clock, Calendar, CheckCircle, AlertCircle, PlusCircle, Edit, Trash2 } from 'lucide-react';

interface UpdatedActivityFeedProps {
  userId?: string;
  isAdmin?: boolean;
}

const UpdatedActivityFeed: React.FC<UpdatedActivityFeedProps> = ({ userId, isAdmin = false }) => {
  const dispatch = useDispatch();
  const { filteredActivities, loading, error, pagination, searchQuery, activityTypeFilter, userFilter } = useSelector((state: RootState) => state.activities);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [activityType, setActivityType] = useState('');
  const [selectedUserId, setSelectedUserId] = useState('');

  // fetch activities when filters change
  if (isAdmin) {
    UseFetchAllActivities(currentPage, 20, activityType, selectedUserId, search);
  } else if (userId) {
    UseFetchActivityByUserId(userId, currentPage, 10, activityType);
  }

  // handle search
  const handleSearch = (value: string) => {
    setSearch(value);
    dispatch(filterActivitiesBySearch(value));
  };

  // handle activity type filter
  const handleActivityTypeFilter = (value: string) => {
    setActivityType(value);
    dispatch(filterActivitiesByType(value));
  };

  // handle user filter
  const handleUserFilter = (value: string) => {
    setSelectedUserId(value);
    dispatch(filterActivitiesByUser(value));
  };

  // clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setActivityType('');
    setSelectedUserId('');
    dispatch(clearFilters());
  };

  // handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // get activity type icon
  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case 'Task Status Updated':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'New Task Added':
        return <PlusCircle className="w-4 h-4 text-blue-500" />;
      case 'Task Edited':
        return <Edit className="w-4 h-4 text-yellow-500" />;
      case 'Task Deleted':
        return <Trash2 className="w-4 h-4 text-red-500" />;
      case 'Project Created':
        return <PlusCircle className="w-4 h-4 text-purple-500" />;
      case 'Project Updated':
        return <Edit className="w-4 h-4 text-orange-500" />;
      default:
        return <Activity className="w-4 h-4 text-gray-500" />;
    }
  };

  // get activity type color
  const getActivityTypeColor = (type: string) => {
    switch (type) {
      case 'Task Status Updated':
        return 'bg-green-100 text-green-800';
      case 'New Task Added':
        return 'bg-blue-100 text-blue-800';
      case 'Task Edited':
        return 'bg-yellow-100 text-yellow-800';
      case 'Task Deleted':
        return 'bg-red-100 text-red-800';
      case 'Project Created':
        return 'bg-purple-100 text-purple-800';
      case 'Project Updated':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // format timestamp
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      return 'Just now';
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8 mx-auto mb-4"></div>
          <p>Loading activities...</p>
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
          <Activity className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Activity Feed</h1>
        </div>
        <p className="text-gray-600">Recent activities and updates</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="lg:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search activities..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Activity Type Filter */}
          <div>
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={activityType}
                onChange={(e) => handleActivityTypeFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Types</option>
                <option value="Task Status Updated">Task Status Updated</option>
                <option value="New Task Added">New Task Added</option>
                <option value="Task Edited">Task Edited</option>
                <option value="Task Deleted">Task Deleted</option>
                <option value="Project Created">Project Created</option>
                <option value="Project Updated">Project Updated</option>
              </select>
            </div>
          </div>
          
          {/* Clear Filters */}
          {(search || activityType || selectedUserId) && (
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

      {/* Activities List */}
      {filteredActivities.length === 0 ? (
        <div className="text-center py-12">
          <Activity className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Activities Found</h3>
          <p className="text-gray-600">
            {search || activityType || selectedUserId 
              ? 'Try adjusting your search criteria' 
              : 'No activities have been recorded yet'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {filteredActivities.map((activity) => (
              <div key={activity.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  {/* Activity Icon */}
                  <div className="flex-shrink-0">
                    {getActivityTypeIcon(activity.activityType)}
                  </div>
                  
                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        {activity.user && (
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <User className="w-4 h-4 text-blue-600" />
                            </div>
                            <span className="text-sm font-medium text-gray-900">{activity.user.name}</span>
                          </div>
                        )}
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActivityTypeColor(activity.activityType)}`}>
                          {activity.activityType}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-xs text-gray-500">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{formatTimestamp(activity.createdAt)}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-700 mb-2">{activity.description}</p>
                    
                    <div className="flex items-center text-xs text-gray-500">
                      <Calendar className="w-3 h-3 mr-1" />
                      <span>{new Date(activity.createdAt).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Simple Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-600">
                Showing {((pagination.page - 1) * 20) + 1} to {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} activities
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

export default UpdatedActivityFeed;
