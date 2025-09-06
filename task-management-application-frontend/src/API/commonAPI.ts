import axios from "axios"

export const fetchData = async(url : string)  =>{
    const res = await axios.get(url ,  {withCredentials : true} )
    const data = res.data
    return data
}