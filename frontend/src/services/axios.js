import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:5000/performa",
});

const sheets = {
  postLogin: (user) => api.post("/login", user),
  postCadastro: (user) => api.post("/user", user),
  getProfile: (token) => api.get("/profile", { headers: { Authorization: `Bearer ${token}` } }),
  getProjects: (token) => api.get("/project", { headers: { Authorization: `Bearer ${token}` } }),
  getProject: (token, id) => api.get(`/project/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
  postProject: (token, project) => api.post("/project", project, { headers: { Authorization: `Bearer ${token}` } }),
}

export default sheets;