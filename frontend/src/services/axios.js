import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:3000/performa",
});

const sheets = {
  postLogin: (user) => api.post("/login", user),
}

export default sheets;