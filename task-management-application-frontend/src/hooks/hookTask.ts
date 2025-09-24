import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllTask, setLoading, setError } from "../redux/taskSlice";

// simple hook to fetch all tasks with pagination and filters
export const UsefetchTask = (page = 1, limit = 20, status = '', projectId = '', assignedUserId = '', search = '') => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const loadTask = async () => {
      try {
        dispatch(setLoading(true));
        const task = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/task/getAllTask`,
          {
            params: { page, limit, status, projectId, assignedUserId, search },
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token") || ""
              )}`,
            },
          }
        );
        const data = task.data;
        dispatch(getAllTask(data));
        dispatch(setLoading(false));
      } catch (error) {
        console.log("Error fetching tasks:", error);
        dispatch(setError("Failed to fetch tasks"));
        dispatch(setLoading(false));
      }
    };
    loadTask();
  }, [dispatch, page, limit, status, projectId, assignedUserId, search]);
};

// simple hook to fetch tasks by user id
export const UsefetchTaskByUserId = (id: string | undefined, page = 1, limit = 20, status = '') => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const loadTask = async () => {
      if (!id) return;
      
      try {
        dispatch(setLoading(true));
        const task = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/task/user/${id}`,
          {
            params: { page, limit, status },
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token") || ""
              )}`,
            },
          }
        );
        const data = task.data;
        dispatch(getAllTask(data));
        dispatch(setLoading(false));
      } catch (error) {
        console.log("Error fetching user tasks:", error);
        dispatch(setError("Failed to fetch user tasks"));
        dispatch(setLoading(false));
      }
    };
    loadTask();
  }, [dispatch, id, page, limit, status]);
};
