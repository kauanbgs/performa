import { Navbar } from "../../components/layout/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";

export default function Ideias() {
  const token = localStorage.getItem("token") as string;
  const navigate = useNavigate();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const profile = await api.getProfile(token);
        const userId = profile.data.id;

        const response = await api.getProjects(token, userId);
        setProjects(response.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchData();
  }, [token]);

  const createProject = (title: string, content: any, mode: string) => {
    if (projects.length >= 3) {
      alert("Você atingiu o limite de 3 projetos.");
      return;
    }
    const defaultTitle = title || "Novo Projeto";
    api.postProject(token, { title: defaultTitle, content: content, mode: mode }).then((response: any) => {
      navigate(`/editor/${response.data.id}`);
    }).catch((err: any) => {
      const msg = err?.response?.data?.error;
      if (err?.response?.status === 403) {
        alert(msg || "Limite de projetos atingido.");
      } else {
        console.error("Erro ao criar projeto:", err);
      }
    });
  };
  return (
    <>
      <Navbar />
      <div className="flex flex-wrap items-center justify-center gap-5">
        <div className="flex flex-col items-center cursor-pointer gap-2">
          <button onClick={() => {window.open("/ult_rom.png", "_blank")}}>
          <img src="/ult_rom.png" alt="" className="w-50 rounded-xl border-2 border-gray-200 shadow-lg mt-10 cursor-pointer"/>
          </button>
          <button className="bg-black text-white w-full px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm font-medium hover:bg-gray-900 transition-all whitespace-nowrap font-secondary cursor-pointer" onClick={() => {createProject("Ultimo Romance", {
            title: "Ultimo Romance",
            artist: "Los Hermanos",
            itemTitle: "Último Romance",
            lyrics: "E ninguém dirá que é tarde demais\nQue é tão diferente assim",
            bgImage: "/ult_rom_bg.png",
            coverImage: "/ult_rom_cover.png",
            posterImage: "/transparente.jpg",
            profileImage: "/ult_rom.png",
            rating: 5,
            glassmorphism: true
          }, "spotify")}}>Copiar Projeto</button>
        </div>
        <div className="flex flex-col items-center cursor-pointer gap-2">
          <button onClick={() => {window.open("/marty_supreme.png", "_blank")}}>
          <img src="/marty_supreme.png" alt="" className="w-50 rounded-xl border-2 border-gray-200 shadow-lg mt-10 cursor-pointer"/>
          </button>
          <button className="bg-black text-white w-full px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm font-medium hover:bg-gray-900 transition-all whitespace-nowrap font-secondary cursor-pointer" onClick={() => {createProject("Marty Supreme", {
            title: "Marty Supreme",
            itemTitle: "Marty Supreme",
            bgImage: "/martybg.jpg",
            posterImage: "/martyposter.jpg",
            profileImage: "/euu.png",
            rating: 5,
            glassmorphism: true
          }, "letterboxd")}}>Copiar Projeto</button>
        </div>
        <div className="flex flex-col items-center cursor-pointer gap-2">
          <button onClick={() => {window.open("/cristiano_ronaldo.jpg", "_blank")}}>
          <img src="/cristiano_ronaldo.jpg" alt="" className="w-50 rounded-xl border-2 border-gray-200 shadow-lg mt-10 cursor-pointer"/>
          </button>
          <button className="bg-black text-white w-full px-5 py-2 sm:px-6 sm:py-2.5 rounded-full text-sm font-medium hover:bg-gray-900 transition-all whitespace-nowrap font-secondary cursor-pointer" onClick={() => {createProject("Papo com Cristiano", {
            title: "Papo com Cristiano",
            itemTitle: "Cristiano Ronaldo",
            profileImage: "/cristiano.jpg",
            glassmorphism: true,
            followers: "672M",
            posts: "4028",
            
          }, "instagram")}}>Copiar Projeto</button>
        </div>

      </div>
    </>
  );
}