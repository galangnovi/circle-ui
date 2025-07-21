import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:3000/api/v1", // tanpa slash akhir
    withCredentials: true, // 🔥 wajib agar cookie token dikirim/diterima
})