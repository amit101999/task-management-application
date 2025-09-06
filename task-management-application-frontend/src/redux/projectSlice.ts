import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface projectType {
  projects: ProjectType[];
  selectedProjectId: ProjectType | null;
  filteredProjects: ProjectType[];
}

const intitalState: projectType = {
  projects: [],
  selectedProjectId: null,
  filteredProjects: [],
};

const projectSlice = createSlice({
  name: "project",
  initialState: intitalState,
  reducers: {
    addProject: (state, action: PayloadAction<ProjectType>) => {
      state.projects.push(action.payload);
      state.filteredProjects.push(action.payload);
    },

    getAllProject: (state, action: PayloadAction<ProjectType[]>) => {
      state.projects = action.payload;
      state.filteredProjects = action.payload; // Initialize filteredProjects with all projects
    },
    selectprojectById: (state, action: PayloadAction<string>) => {
      state.selectedProjectId =
        state?.projects.find((project) => project.id === action.payload) || null;
    },
    filterProjects: (state, action: PayloadAction<string>) => {
      if (action.payload === "ALL") {
        state.filteredProjects = state.projects;
      } else {
        state.filteredProjects = state.projects.filter(
          (project) => project.status === action.payload
        );
      }
    },
  },
});

export default projectSlice.reducer;
export const { addProject, getAllProject, selectprojectById, filterProjects } =
  projectSlice.actions;
