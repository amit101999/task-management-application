import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthType {
  users: UserType[];
  user: UserType | null;
  loading: boolean;
  error: string | null;
  filteredUser: UserType[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  searchQuery: string;
  departmentFilter: string;
}

const initialState: AuthType = {
  users: [],
  user: null,
  loading: false,
  error: null,
  filteredUser: [],
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0
  },
  searchQuery: '',
  departmentFilter: ''
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // load users with pagination data
    loadUser: (state, action: PayloadAction<{data: UserType[], pagination: any}>) => {
      state.users = action.payload.data;
      state.filteredUser = action.payload.data;
      state.pagination = action.payload.pagination;
    },
    
    loginStart(state) {
      state.user = null;
      state.loading = true;
      state.error = null;
    },
    
    loginSuccess(state, action: PayloadAction<UserType>) {
      state.user = action.payload;
      state.loading = false;
      state.error = null;
    },
    
    loginFailure(state, action: PayloadAction<string>) {
      state.error = action.payload;
      state.loading = false;
      state.user = null;
    },
    
    logoutUser: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.users = [];
      state.filteredUser = [];
      state.searchQuery = '';
      state.departmentFilter = '';
    },
    
    // simple search filter
    filterUser: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
      if (action.payload === '') {
        state.filteredUser = state.users;
      } else {
        state.filteredUser = state.users.filter((item) => 
          item.name.toLowerCase().includes(action.payload.toLowerCase()) ||
          item.email.toLowerCase().includes(action.payload.toLowerCase())
        );
      }
    },
    
    // simple department filter
    filterUserByDepartment: (state, action: PayloadAction<string>) => {
      state.departmentFilter = action.payload;
      if (action.payload === '') {
        state.filteredUser = state.users;
      } else {
        state.filteredUser = state.users.filter((item) => 
          item.department?.toLowerCase() === action.payload.toLowerCase()
        );
      }
    },
    
    clearFilter: (state) => {
      state.searchQuery = '';
      state.departmentFilter = '';
      state.filteredUser = state.users;
    },
    
    // set loading state
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    
    // set error
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
    }
  }
});

export const { 
  loginFailure, 
  loginStart, 
  loginSuccess, 
  logoutUser, 
  loadUser, 
  filterUser, 
  filterUserByDepartment, 
  clearFilter,
  setLoading,
  setError
} = userSlice.actions;

export default userSlice.reducer;
