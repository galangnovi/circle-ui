import axios from "axios";

export const api = axios.create({
    baseURL: "https://circle-api-22.up.railway.app/api/v1", 
    withCredentials: true, 
})