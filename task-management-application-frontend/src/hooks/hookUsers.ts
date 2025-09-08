import axios from "axios";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { loadUser } from "../redux/userSlice";

export const UsefetchUsers = () => {
  const disptach = useDispatch();
  useEffect(() => {
    const loadUsers = async () => {
      const user = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/user/getAllUsers`,
        {
          headers: {
            Authorization: `Bearer ${JSON.parse(
              localStorage.getItem("token") || ""
            )}`,
          },
        }
      );
      const data = user.data.data;
      disptach(loadUser(data));
    };
    loadUsers();
  }, []);
};
