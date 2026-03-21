import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/performa",
});

const sheets = {
  postLogin: (user) => api.post("/login", user),
  postCadastro: (user) => api.post("/user", user),
  getProfile: (token) => api.get("/profile", { headers: { Authorization: `Bearer ${token}` } }),

}

export default sheets;