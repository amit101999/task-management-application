import axios from "axios"
import { useEffect } from "react"
import { useDispatch } from "react-redux"
import { getAllTask } from "../redux/taskSlice"

export const UsefetchTask = () => {
        const disptach = useDispatch()
    useEffect(()=>{
       const loadTask = async () => {
            const task = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/task/getAllTask` , {withCredentials : true} )
            const data  = task.data.data
            console.log(data)
            disptach(getAllTask(data))
       }
       loadTask()
    },[])
}

export const UsefetchTaskByUserId = (id:string)=>{
    console.log("from task hook")
        const disptach = useDispatch()
    useEffect(()=>{
       const loadTask = async () => {
            const task = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/task/user/${id}` , {withCredentials : true} )
            const data  = task.data.data
            disptach(getAllTask(data))
       }
       loadTask()
    },[])
}
