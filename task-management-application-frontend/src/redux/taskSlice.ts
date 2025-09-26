import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type taskType = {
  filterTasks: Task[];
  tasks: Task[];
  selectedTask: Task | null;
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
  projectFilter: string;
  userFilter: string;
};

const intialState: taskType = {
  filterTasks: [],
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  searchQuery: '',
  statusFilter: '',
  projectFilter: '',
  userFilter: ''
};

const taskSlice = createSlice({
  name: "task",
  initialState: intialState,
  reducers: {
    // load tasks with pagination data
    getAllTask: (state, action: PayloadAction<{data: Task[], pagination: any}>) => {
      state.tasks = action.payload.data;
      state.filterTasks = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    
    addTask: (state, action: PayloadAction<Task>) => {
      state.tasks.unshift(action.payload);
      state.filterTasks.unshift(action.payload);
    },
    
    // simple search filter
    filterTaskByText: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      if (action.payload === '') {
        state.filterTasks = state.tasks;
      } else {
        state.filterTasks = state.tasks.filter((task) =>
          task.title.toLowerCase().includes(action.payload.toLowerCase()) ||
          task.description.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
    
    // simple status filter
    filterByStatus: (state, action: PayloadAction<string>) => {
      state.statusFilter = action.payload;
      if (action.payload === '') {
        state.filterTasks = state.tasks;
      } else {
        state.filterTasks = state.tasks.filter((task) =>
          task.taskStatus === action.payload
        );
      }
    },
    
    // simple project filter
    filterProjectByName: (state, action: PayloadAction<string>) => {
      state.projectFilter = action.payload;
      if (action.payload === '') {
        state.filterTasks = state.tasks;
      } else {
        state.filterTasks = state.tasks.filter((task) =>
          task.project?.projectName.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
    
    // simple user filter
    filterByName: (state, action: PayloadAction<string>) => {
      state.userFilter = action.payload;
      if (action.payload === '') {
        state.filterTasks = state.tasks;
      } else {
        state.filterTasks = state.tasks.filter((task) =>
          task.assignedTo?.name.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
    
    // update task status
    updateTaskStatus: (
      state,
      action: PayloadAction<{
        id: string;
        status: "OPEN" | "INPROGRESS" | "CLOSED";
      }>
    ) => {
      state.tasks = state.tasks.map((task) =>
        task.id === action.payload.id
          ? { ...task, taskStatus: action.payload.status }
          : task
      );

      state.filterTasks = state.filterTasks.map((task) => {
        if (task.id === action.payload.id) {
          return { ...task, taskStatus: action.payload.status };
        }
        return task;
      });
    },
    
    // clear all filters
    clearFilter: (state) => {
      state.searchQuery = '';
      state.statusFilter = '';
      state.projectFilter = '';
      state.userFilter = '';
      state.filterTasks = state.tasks;
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
    logoutUserTask: (state) => {
      state.filterTasks = [];
      state.tasks = [];
      state.selectedTask = null;
      state.searchQuery = '';
      state.statusFilter = '';
      state.projectFilter = '';
      state.userFilter = '';
    },
  },
});

export const {
  addTask,
  getAllTask,
  filterProjectByName,
  clearFilter,
  filterByName,
  filterByStatus,
  updateTaskStatus,
  filterTaskByText,
  logoutUserTask,
  setLoading,
  setError
} = taskSlice.actions;

export default taskSlice.reducer;
