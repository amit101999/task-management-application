import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser, setLoading, setError } from "../redux/userSlice";

// simple hook to fetch users with pagination
export const UsefetchUsers = (page = 1, limit = 20, search = '', department = '') => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const loadUsers = async () => {
      try {
        dispatch(setLoading(true));
        const user = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/user/getAllUsers`,
          {
            params: { page, limit, search, department },
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token") || ""
              )}`,
            },
          }
        );
        const data = user.data;
        dispatch(loadUser(data));
        dispatch(setLoading(false));
      } catch (error) {
        console.log("Error fetching users:", error);
        dispatch(setError("Failed to fetch users"));
        dispatch(setLoading(false));
      }
    };
    loadUsers();
  }, [dispatch, page, limit, search, department]);
};

// simple hook to fetch single user by id
export const UsefetchUserById = (userId: string | undefined) => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const loadUserById = async () => {
      if (!userId) return;
      
      try {
        dispatch(setLoading(true));
        const user = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/user/getUser/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token") || ""
              )}`,
            },
          }
        );
        const data = user.data.data;
        // you can add a setUser action if needed
        dispatch(setLoading(false));
      } catch (error) {
        console.log("Error fetching user:", error);
        dispatch(setError("Failed to fetch user"));
        dispatch(setLoading(false));
      }
    };
    loadUserById();
  }, [dispatch, userId]);
};
