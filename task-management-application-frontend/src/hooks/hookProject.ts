import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllProject, setLoading, setError } from "../redux/projectSlice";
import axios from "axios";

// simple hook to fetch all projects with pagination and filters
export const UseFetchProject = (page = 1, limit = 20, status = '', search = '') => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/project/getAllProject`,
          {
            params: { page, limit, status, search },
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token") || ""
              )}`,
            },
          }
        );
        const data = res.data;
        dispatch(getAllProject(data));
        dispatch(setLoading(false));
      } catch (error) {
        console.log("Error fetching projects:", error);
        dispatch(setError("Failed to fetch projects"));
        dispatch(setLoading(false));
      }
    };
    fetchProjects();
  }, [dispatch, page, limit, status, search]);
};

// simple hook to fetch projects by user id
export const UseFetchProjectByUserId = (id: string | undefined, page = 1, limit = 20, status = '') => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchProjects = async () => {
      if (!id) return;
      
      try {
        dispatch(setLoading(true));
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/project/user/${id}`,
          {
            params: { page, limit, status },
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token") || ""
              )}`,
            },
          }
        );
        const data = res.data;
        dispatch(getAllProject(data));
        dispatch(setLoading(false));
      } catch (error) {
        console.log("Error fetching user projects:", error);
        dispatch(setError("Failed to fetch user projects"));
        dispatch(setLoading(false));
      }
    };
    fetchProjects();
  }, [dispatch, id, page, limit, status]);
};
