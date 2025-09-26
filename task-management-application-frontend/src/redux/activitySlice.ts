import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface ActivityType {
  id: string;
  description: string;
  activityType: string;
  createdAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    department?: string;
  };
}

interface ActivityState {
  activities: ActivityType[];
  filteredActivities: ActivityType[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchQuery: string;
  activityTypeFilter: string;
  userFilter: string;
}

const initialState: ActivityState = {
  activities: [],
  filteredActivities: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  searchQuery: '',
  activityTypeFilter: '',
  userFilter: ''
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    // load activities with pagination data
    loadActivities: (state, action: PayloadAction<{data: ActivityType[], pagination: any}>) => {
      state.activities = action.payload.data;
      state.filteredActivities = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    
    // add new activity
    addActivity: (state, action: PayloadAction<ActivityType>) => {
      state.activities.unshift(action.payload);
      state.filteredActivities.unshift(action.payload);
    },
    
    // simple search filter
    filterActivitiesBySearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      if (action.payload === '') {
        state.filteredActivities = state.activities;
      } else {
        state.filteredActivities = state.activities.filter((activity) =>
          activity.description.toLowerCase().includes(action.payload.toLowerCase()) ||
          activity.activityType.toLowerCase().includes(action.payload.toLowerCase()) ||
          activity.user?.name.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
    
    // simple activity type filter
    filterActivitiesByType: (state, action: PayloadAction<string>) => {
      state.activityTypeFilter = action.payload;
      if (action.payload === '') {
        state.filteredActivities = state.activities;
      } else {
        state.filteredActivities = state.activities.filter((activity) =>
          activity.activityType === action.payload
        );
      }
    },
    
    // simple user filter
    filterActivitiesByUser: (state, action: PayloadAction<string>) => {
      state.userFilter = action.payload;
      if (action.payload === '') {
        state.filteredActivities = state.activities;
      } else {
        state.filteredActivities = state.activities.filter((activity) =>
          activity.user?.id === action.payload
        );
      }
    },
    
    // clear all filters
    clearFilters: (state) => {
      state.searchQuery = '';
      state.activityTypeFilter = '';
      state.userFilter = '';
      state.filteredActivities = state.activities;
    },
    
    // set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    // logout user
    logoutUserActivity: (state) => {
      state.activities = [];
      state.filteredActivities = [];
      state.searchQuery = '';
      state.activityTypeFilter = '';
      state.userFilter = '';
    },
  },
});

export const {
  loadActivities,
  addActivity,
  filterActivitiesBySearch,
  filterActivitiesByType,
  filterActivitiesByUser,
  clearFilters,
  setLoading,
  setError,
  logoutUserActivity
} = activitySlice.actions;

export default activitySlice.reducer;
