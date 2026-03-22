import axios from "axios";

const api = axios.create({
    baseURL: "https://performa-i6sk.onrender.com/performa",
});

const sheets = {
  postLogin: (user: any) => api.post("/login", user),
  postCadastro: (user: any) => api.post("/user", user),
  getProfile: (token: string) => api.get("/profile", { headers: { Authorization: `Bearer ${token}` } }),
  getProjects: (token: string, id: string) => api.get(`/projects/user/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
  getProject: (token: string, id: string) => api.get(`/project/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
  postProject: (token: string, project: any) => api.post("/project", project, { headers: { Authorization: `Bearer ${token}` } }),
  updateProject: (token: string, id: string, project: any) => api.put(`/project/${id}`, project, { headers: { Authorization: `Bearer ${token}` } }),
  deleteProject: (token: string, id: string) => api.delete(`/project/${id}`, { headers: { Authorization: `Bearer ${token}` } }),
}

export default sheets;
