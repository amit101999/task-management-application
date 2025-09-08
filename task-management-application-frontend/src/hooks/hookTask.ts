import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { getAllTask } from "../redux/taskSlice";

export const UsefetchTask = () => {
  const disptach = useDispatch();
  useEffect(() => {
    const loadTask = async () => {
      const task = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/task/getAllTask`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") || ""
            )}`,
          },
        }
      );
      const data = task.data.data;
      console.log(data);
      disptach(getAllTask(data));
    };
    loadTask();
  }, []);
};

export const UsefetchTaskByUserId = (id: string | undefined) => {
  console.log("from task hook");
  const disptach = useDispatch();
  useEffect(() => {
    const loadTask = async () => {
      if (!id) return;
      const task = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/task/user/${id}`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") || ""
            )}`,
          },
        }
      );
      const data = task.data.data;
      disptach(getAllTask(data));
    };
    loadTask();
  }, [id]);
};
