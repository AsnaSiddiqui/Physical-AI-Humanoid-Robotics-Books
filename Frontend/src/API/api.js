import axios from "axios";

const api = axios.create({
    baseURL:"https://physical-ai-humanoid-robotics-books-production.up.railway.app"
})

export default api