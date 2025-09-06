import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getAllProject } from "../redux/projectSlice"
import axios from "axios"

export const UseFetchProject = () => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetechProjects = async () => {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/project/getAllProject`, { withCredentials: true })
      const data = res.data.data
      console.log(data)
      dispatch(getAllProject(data))
    }
    fetechProjects()
  }, [])

}


export const UseFetchProjectByUserId = (id : string) => {
  const dispatch = useDispatch()
  useEffect(() => {
    const fetechProjects = async () => {
      const res = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/project/user/${id}`, { withCredentials: true })
      const data = res.data.data
      dispatch(getAllProject(data))
    }
    fetechProjects()
  }, [])

}