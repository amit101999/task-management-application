import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadActivities, setLoading, setError } from "../redux/activitySlice";

// simple hook to fetch activities by user id
export const UseFetchActivityByUserId = (id: string | undefined, page = 1, limit = 10, activityType = '') => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchActivities = async () => {
      if (!id) return;
      
      try {
        dispatch(setLoading(true));
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/activity/getActivity/${id}`,
          {
            params: { page, limit, activityType },
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token") || ""
              )}`,
            },
          }
        );
        const data = res.data;
        dispatch(loadActivities(data));
        dispatch(setLoading(false));
      } catch (error) {
        console.log("Error fetching user activities:", error);
        dispatch(setError("Failed to fetch user activities"));
        dispatch(setLoading(false));
      }
    };
    fetchActivities();
  }, [dispatch, id, page, limit, activityType]);
};

// simple hook to fetch all activities (for admin)
export const UseFetchAllActivities = (page = 1, limit = 20, activityType = '', userId = '', search = '') => {
  const dispatch = useDispatch();
  
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        dispatch(setLoading(true));
        const res = await axios.get(
          `${import.meta.env.VITE_BASE_URL}/api/activity/getAllActivities`,
          {
            params: { page, limit, activityType, userId, search },
            headers: {
              Authorization: `Bearer ${JSON.parse(
                localStorage.getItem("token") || ""
              )}`,
            },
          }
        );
        const data = res.data;
        dispatch(loadActivities(data));
        dispatch(setLoading(false));
      } catch (error) {
        console.log("Error fetching all activities:", error);
        dispatch(setError("Failed to fetch all activities"));
        dispatch(setLoading(false));
      }
    };
    fetchActivities();
  }, [dispatch, page, limit, activityType, userId, search]);
};
