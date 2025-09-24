import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface projectType {
  projects: ProjectType[];
  selectedProjectId: ProjectType | null;
  filteredProjects: ProjectType[];
  loading: boolean;
  error: string | null;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchQuery: string;
  statusFilter: string;
}

const intitalState: projectType = {
  projects: [],
  selectedProjectId: null,
  filteredProjects: [],
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  searchQuery: '',
  statusFilter: ''
};

const projectSlice = createSlice({
  name: "project",
  initialState: intitalState,
  reducers: {
    // load projects with pagination data
    getAllProject: (state, action: PayloadAction<{data: ProjectType[], pagination: any}>) => {
      state.projects = action.payload.data;
      state.filteredProjects = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    
    addProject: (state, action: PayloadAction<ProjectType>) => {
      state.projects.unshift(action.payload);
      state.filteredProjects.unshift(action.payload);
    },
    
    selectprojectById: (state, action: PayloadAction<string>) => {
      state.selectedProjectId =
        state?.projects.find((project) => project.id === action.payload) ||
        null;
    },
    
    // simple status filter
    filterProjects: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      if (action.payload === "ALL" || action.payload === '') {
        state.filteredProjects = state.projects;
      } else {
        state.filteredProjects = state.projects.filter(
          (project) => project.status === action.payload
        );
      }
    },
    
    // simple search filter
    filterProjectsBySearch: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      if (action.payload === '') {
        state.filteredProjects = state.projects;
      } else {
        state.filteredProjects = state.projects.filter((project) =>
          project.projectName.toLowerCase().includes(action.payload.toLowerCase()) ||
          project.description.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
    
    // clear all filters
    clearFilters: (state) => {
      state.searchQuery = '';
      state.statusFilter = '';
      state.filteredProjects = state.projects;
    },
    
    // set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    },
    
    logoutUserProject: (state) => {
      state.projects = [];
      state.selectedProjectId = null;
      state.filteredProjects = [];
      state.searchQuery = '';
      state.statusFilter = '';
    },
  },
});

export default projectSlice.reducer;
export const {
  addProject,
  getAllProject,
  selectprojectById,
  logoutUserProject,
  filterProjects,
  filterProjectsBySearch,
  clearFilters,
  setLoading,
  setError
} = projectSlice.actions;
