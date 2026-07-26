import axios from "axios";

export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://performa-i6sk.onrender.com/performa";

const api = axios.create({
    baseURL: API_BASE_URL,
});

// Sessão expirada/inválida: limpa o token e manda pro login em vez de deixar
// cada página tratar (ou ignorar) o 401 por conta própria.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && window.location.pathname !== "/login") {
      localStorage.removeItem("token");
      window.location.assign("/login");
    }
    return Promise.reject(error);
  }
);

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
