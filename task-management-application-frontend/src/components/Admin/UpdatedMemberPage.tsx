import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { UsefetchUsers } from '../../hooks/hookUsers';
import { filterUser, filterUserByDepartment, clearFilter } from '../../redux/userSlice';
import type { RootState } from '../../redux/store';
import { Search, Filter, Users, Mail, Phone, Calendar, Building } from 'lucide-react';

const UpdatedMemberPage: React.FC = () => {
  const dispatch = useDispatch();
  const { filteredUser, loading, error, pagination, searchQuery, departmentFilter } = useSelector((state: RootState) => state.user);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('');

  // fetch users when page, search, or department changes
  UsefetchUsers(currentPage, 20, search, department);

  // handle search
  const handleSearch = (value: string) => {
    setSearch(value);
    dispatch(filterUser(value));
  };

  // handle department filter
  const handleDepartmentFilter = (value: string) => {
    setDepartment(value);
    dispatch(filterUserByDepartment(value));
  };

  // clear all filters
  const handleClearFilters = () => {
    setSearch('');
    setDepartment('');
    dispatch(clearFilter());
  };

  // handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="animate-spin border-4 border-blue-500 border-t-transparent rounded-full w-8 h-8 mx-auto mb-4"></div>
          <p>Loading users...</p>
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
          <Users className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Team Members</h1>
        </div>
        <p className="text-gray-600">Manage and view all team members</p>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search users by name or email..."
                value={search}
                onChange={(e) => handleSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Department Filter */}
          <div className="md:w-48">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <select
                value={department}
                onChange={(e) => handleDepartmentFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                <option value="">All Departments</option>
                <option value="DEVELOPER">Developer</option>
                <option value="DESIGNER">Designer</option>
                <option value="MANAGER">Manager</option>
                <option value="QA">QA</option>
                <option value="DEVOPS">DevOps</option>
                <option value="MARKETING">Marketing</option>
              </select>
            </div>
          </div>
          
          {/* Clear Filters */}
          {(search || department) && (
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Users Grid */}
      {filteredUser.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
          <p className="text-gray-600">
            {search || department 
              ? 'Try adjusting your search criteria' 
              : 'No users have been added yet'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUser.map((user) => (
              <div key={user.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start space-x-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                    {user.avatar ? (
                      <img src={user.avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      user.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{user.name}</h3>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        user.role === 'ADMIN' 
                          ? 'bg-red-100 text-red-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </div>
                    
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="w-4 h-4 mr-2" />
                        <span className="truncate">{user.email}</span>
                      </div>
                      
                      {user.phone && (
                        <div className="flex items-center text-sm text-gray-600">
                          <Phone className="w-4 h-4 mr-2" />
                          <span>{user.phone}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Building className="w-4 h-4 mr-2" />
                        <span>{user.department || 'No Department'}</span>
                      </div>
                      
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Joined {new Date(user.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                    
                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex space-x-4 text-sm text-gray-500">
                        <span>{user._count?.tasks || 0} Tasks</span>
                        <span>{user._count?.projects || 0} Projects</span>
                      </div>
                      
                      {user.lastLogin && (
                        <span className="text-xs text-gray-400">
                          Last active: {new Date(user.lastLogin).toLocaleDateString()}
                        </span>
                      )}
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
                Showing {((pagination.page - 1) * 20) + 1} to {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} users
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

export default UpdatedMemberPage;
