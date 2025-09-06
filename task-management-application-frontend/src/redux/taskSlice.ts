import { createSlice, type PayloadAction } from "@reduxjs/toolkit";


type taskType = {
  filterTasks: Task[];
  tasks: Task[];
  selectedTask: Task | null;
}

const intialState : taskType = {
  filterTasks: [],
  tasks: [],
  selectedTask: null,
};

const taskSlice = createSlice({
  name: "task",
  initialState: intialState,
  reducers: {
    getAllTask: (state, action: PayloadAction<Task[]>) => {
      state.filterTasks = action.payload;
      state.tasks = action.payload;
    },
    addTask: (state, action: PayloadAction<Task>) => {
      state.filterTasks.push(action.payload);
      state.tasks.push(action.payload);
    },
    filterProjectByName: (state, action: PayloadAction<string>) => {
      state.filterTasks = state.tasks.filter((tasks) =>
        tasks?.project?.projectName.toLowerCase().includes(action.payload)
      );
    },
    filterByName: (state, action: PayloadAction<string>) => {
      state.filterTasks = state.tasks.filter((tasks) =>
        tasks?.assignedTo?.name.toLowerCase().includes(action.payload)
      );
    },
    filterByStatus: (state, action: PayloadAction<string>) => {
      state.filterTasks = state.tasks.filter((tasks) =>
        tasks?.taskStatus.includes(action.payload)
      );
    },
    filterTaskByText : (state, action: PayloadAction<string>) => {
      state.filterTasks = state.tasks.filter((tasks) =>
        tasks?.title.toLowerCase().includes(action.payload)
      );
    },
   updateTaskStatus: (state, action: PayloadAction<{ id: string; status: "OPEN" | "INPROGRESS" | "CLOSED" }>) => {
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
  state.tasks = state.filterTasks
},
    clearFilter: (state) => {
      state.filterTasks = state.tasks;
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
  updateTaskStatus ,
  filterTaskByText
} = taskSlice.actions;
export default taskSlice.reducer;
