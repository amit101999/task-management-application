import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllProject } from "../redux/projectSlice";
import axios from "axios";

export const UseFetchProject = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetechProjects = async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/project/getAllProject`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") || ""
            )}`,
          },
        }
      );
      const data = res.data.data;
      console.log(data);
      dispatch(getAllProject(data));
    };
    fetechProjects();
  }, []);
};

export const UseFetchProjectByUserId = (id: string | undefined) => {
  const dispatch = useDispatch();
  useEffect(() => {
    const fetechProjects = async () => {
      if (!id) return;
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/project/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") || ""
            )}`,
          },
        }
      );
      const data = res.data.data;
      dispatch(getAllProject(data));
    };
    fetechProjects();
  }, [id]);
};
