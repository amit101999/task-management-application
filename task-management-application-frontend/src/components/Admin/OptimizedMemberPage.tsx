import React, { useState, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useFetchUsers } from '../../hooks/hookUsers';
import { setSearchQuery, setDepartmentFilter, clearFilters } from '../../redux/userSlice';
import type { RootState } from '../../redux/store';
import { Search, Filter, Users, Mail, Phone, Calendar, Building } from 'lucide-react';

// User Card Component with memoization
const UserCard = React.memo(({ user }: { user: UserType }) => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
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
));

UserCard.displayName = 'UserCard';

// Search and Filter Component
const SearchAndFilter = () => {
  const dispatch = useDispatch();
  const { searchQuery, departmentFilter } = useSelector((state: RootState) => state.user);
  
  const departments = useMemo(() => [
    'DEVELOPER', 'DESIGNER', 'MANAGER', 'QA', 'DEVOPS', 'MARKETING'
  ], []);

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchQuery}
              onChange={(e) => dispatch(setSearchQuery(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        {/* Department Filter */}
        <div className="md:w-48">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <select
              value={departmentFilter}
              onChange={(e) => dispatch(setDepartmentFilter(e.target.value))}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        
        {/* Clear Filters */}
        {(searchQuery || departmentFilter) && (
          <button
            onClick={() => dispatch(clearFilters())}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};

// Pagination Component
const Pagination = ({ pagination, onPageChange }: { 
  pagination: { page: number; totalPages: number; total: number }; 
  onPageChange: (page: number) => void;
}) => {
  const pages = useMemo(() => {
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;
    const pages = [];
    
    // Show first page
    if (currentPage > 3) {
      pages.push(1);
      if (currentPage > 4) pages.push('...');
    }
    
    // Show pages around current page
    for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + 2); i++) {
      pages.push(i);
    }
    
    // Show last page
    if (currentPage < totalPages - 2) {
      if (currentPage < totalPages - 3) pages.push('...');
      pages.push(totalPages);
    }
    
    return pages;
  }, [pagination]);

  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-sm text-gray-600">
        Showing {((pagination.page - 1) * 20) + 1} to {Math.min(pagination.page * 20, pagination.total)} of {pagination.total} users
      </div>
      
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(pagination.page - 1)}
          disabled={pagination.page === 1}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        {pages.map((page, index) => (
          <button
            key={index}
            onClick={() => typeof page === 'number' && onPageChange(page)}
            disabled={page === '...'}
            className={`px-3 py-1 text-sm border rounded-lg ${
              page === pagination.page
                ? 'bg-blue-500 text-white border-blue-500'
                : page === '...'
                ? 'border-transparent cursor-default'
                : 'border-gray-300 hover:bg-gray-50'
            }`}
          >
            {page}
          </button>
        ))}
        
        <button
          onClick={() => onPageChange(pagination.page + 1)}
          disabled={pagination.page === pagination.totalPages}
          className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
    </div>
  );
};

// Loading Skeleton Component
const UserSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 animate-pulse">
    <div className="flex items-start space-x-3">
      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-3 bg-gray-200 rounded w-2/3"></div>
      </div>
    </div>
  </div>
);

// Main Component
const OptimizedMemberPage: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { filteredUser, loading, error, pagination, searchQuery, departmentFilter } = useSelector((state: RootState) => state.user);
  
  // Fetch users with current filters
  useFetchUsers({
    page: currentPage,
    limit: 20,
    search: searchQuery,
    department: departmentFilter
  });

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-500 text-lg font-semibold mb-2">Error Loading Users</div>
          <div className="text-gray-600">{error}</div>
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
      <SearchAndFilter />

      {/* Users Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, index) => (
            <UserSkeleton key={index} />
          ))}
        </div>
      ) : filteredUser.length === 0 ? (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Users Found</h3>
          <p className="text-gray-600">
            {searchQuery || departmentFilter 
              ? 'Try adjusting your search criteria' 
              : 'No users have been added yet'
            }
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredUser.map((user) => (
              <UserCard key={user.id} user={user} />
            ))}
          </div>
          
          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Pagination pagination={pagination} onPageChange={handlePageChange} />
          )}
        </>
      )}
    </div>
  );
};

export default OptimizedMemberPage;
