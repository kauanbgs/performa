import { Navbar } from "../../components/layout/Navbar";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/axios";
import { useRequireAuth } from "../../hooks/useRequireAuth";
import { useToast } from "../../context/ToastContext";
import SpotifyCanvas from "../../components/canvas/spotifyCanvas";
import LetterboxdCanvas from "../../components/canvas/letterboxdCanvas";
import WhatsappCanvas from "../../components/canvas/whatsappCanvas";
import InstagramCanvas from "../../components/canvas/instagramCanvas";
import SpotifyWrappedCanvas from "../../components/canvas/spotifyWrappedCanvas";
import NotesCanvas from "../../components/canvas/notesCanvas";
import TweetCanvas from "../../components/canvas/tweetCanvas";
import { type Mode, CANVAS_DIMENSIONS, MODE_LABELS, MODE_STYLES } from "../../constants/modes";

interface Idea {
  title: string;
  description: string;
  mode: Mode;
  content: any;
}

const IDEAS: Idea[] = [
  {
    title: "Nota de Esclarecimento",
    description: "O comunicado no app Notas, postado às 3 da manhã. Clássico.",
    mode: "notes",
    content: {
      title: "Nota de Esclarecimento",
      itemTitle: "Comunicado",
      artist: "12 de março de 2026 às 03:14",
      lyrics:
        "Venho por meio desta esclarecer o ocorrido.\n\nNão foi minha intenção que as coisas tomassem essa proporção, e assumo total responsabilidade pelo que aconteceu.\n\nSeguirei refletindo com calma e carinho.",
      glassmorphism: true,
    },
  },
  {
    title: "Tweet das 3 da Manhã",
    description: "Print de tweet no modo escuro, com selo azul e contadores.",
    mode: "tweet",
    content: {
      title: "Tweet das 3 da Manhã",
      itemTitle: "Kauan Plaza",
      artist: "@kauanbgs",
      lyrics: "eu não deveria estar postando isso às 3 da manhã mas enfim",
      profileImage: "/euu.png",
      glassmorphism: true,
      rating: 5,
      followers: 2400,
      likes: 18300,
      posts: 128,
    },
  },
  {
    title: "Último Romance",
    description: "Card de música com letra em destaque sobre glassmorphism.",
    mode: "spotify",
    content: {
      title: "Último Romance",
      artist: "Los Hermanos",
      itemTitle: "Último Romance",
      lyrics: "aquele trecho que você repete até decorar.",
      bgImage: "/ult_rom_bg.png",
      coverImage: "/ult_rom_cover.png",
      posterImage: "/transparente.jpg",
      profileImage: "/ult_rom.png",
      rating: 5,
      glassmorphism: true,
      glassColor: "#ffffff",
    },
  },
  {
    title: "Marty Supreme",
    description: "Resenha de filme estilo Letterboxd, com pôster e nota em estrelas.",
    mode: "letterboxd",
    content: {
      title: "Marty Supreme",
      itemTitle: "Marty Supreme",
      bgImage: "/martybg.jpg",
      posterImage: "/martyposter.jpg",
      profileImage: "/euu.png",
      rating: 5,
      glassmorphism: true,
    },
  },
  {
    title: "Direct do Ídolo",
    description: "Print de perfil e DM do Instagram pra flexar aquele follow.",
    mode: "instagram",
    content: {
      title: "Direct do Ídolo",
      itemTitle: "Cristiano Ronaldo",
      profileImage: "/cristiano.jpg",
      glassmorphism: true,
      followers: "672M",
      posts: "4028",
    },
  },
  {
    title: "Resumo do Ano",
    description: "Wrapped com top artistas, top músicas e tempo ouvido no ano.",
    mode: "spotifyWrapped",
    content: {
      title: "Meu Resumo\ndo Ano",
      coverImage: "/beatles.jpg",
      date: "Dez 2026",
      artist: "The Beatles",
      artist2: "Pink Floyd",
      artist3: "Queen",
      artist4: "Led Zeppelin",
      artist5: "Nirvana",
      itemTitle: "Here Comes the Sun",
      song2: "Bohemian Rhapsody",
      song3: "Come As You Are",
      song4: "Stairway to Heaven",
      song5: "Wish You Were Here",
      followers: "3240",
    },
  },
  {
    title: "Combinando o Rolê",
    description: "Conversa de WhatsApp pra recriar aquele papo marcando o encontro.",
    mode: "whatsapp",
    content: {
      title: "Combinando o Rolê",
      itemTitle: "Grupo da Firma",
      bgImage: "/wppback.jpg",
      messages: [
        { text: "gente, alguém topa sair hoje?", type: "received", time: "18:02" },
        { text: "eu topo, que horas?", type: "sent", time: "18:03" },
        { text: "lá pelas 20h, no lugar de sempre", type: "received", time: "18:04" },
        { text: "fechou, chamo o resto da galera", type: "sent", time: "18:05" },
      ],
    },
  },
  {
    title: "Crush Oficial",
    description: "Print de DM engraçado com aquele crush, do jeito que rende no feed.",
    mode: "instagram",
    content: {
      title: "Crush Oficial",
      itemTitle: "crush.oficial",
      followers: "1.284",
      posts: "87",
      messages: [
        { text: "vi que você curtiu minha história 👀", type: "received" },
        { text: "eu?? nunca 😳", type: "sent" },
        { text: "as provas dizem outra coisa", type: "received" },
      ],
    },
  },
  {
    title: "Trilha da Madrugada",
    description: "Card minimalista pra aquela música que ficou marcada num momento.",
    mode: "spotify",
    content: {
      title: "Trilha da Madrugada",
      artist: "playlist pessoal",
      itemTitle: "sua trilha da madrugada",
      lyrics: "3 da manhã e essa música ainda faz sentido.",
      bgImage: "/fundoLogin.png",
      coverImage: "/transparente.jpg",
      posterImage: "/transparente.jpg",
      rating: 5,
      glassmorphism: true,
      glassColor: "#000000",
    },
  },
  {
    title: "Resenha Relâmpago",
    description: "Formato rápido de crítica pra qualquer filme que você acabou de ver.",
    mode: "letterboxd",
    content: {
      title: "Resenha Relâmpago",
      itemTitle: "aquele filme de ontem",
      bgImage: "/fundoLogin.png",
      posterImage: "/transparente.jpg",
      profileImage: "/transparente.jpg",
      rating: 4,
      glassmorphism: true,
    },
  },
  {
    title: "Top 5 do Mês",
    description: "Wrapped mensal com os artistas e faixas que mais bombaram pra você.",
    mode: "spotifyWrapped",
    content: {
      title: "Meu Top 5\ndo Mês",
      coverImage: "/transparente.jpg",
      date: "Nov 2026",
      artist: "Anitta",
      artist2: "Taylor Swift",
      artist3: "Billie Eilish",
      artist4: "The Weeknd",
      artist5: "Dua Lipa",
      itemTitle: "Envolver",
      song2: "Cruel Summer",
      song3: "Ocean Eyes",
      song4: "Blinding Lights",
      song5: "Levitating",
      followers: "540",
    },
  },
  {
    title: "Recado da Mãe",
    description: "Aquele clássico print de conversa com a mãe que todo mundo entende.",
    mode: "whatsapp",
    content: {
      title: "Recado da Mãe",
      itemTitle: "Mãe ❤️",
      bgImage: "/wppback.jpg",
      messages: [
        { text: "filho, já almoçou?", type: "received", time: "12:31" },
        { text: "ainda não mãe kkkj", type: "sent", time: "12:40" },
        { text: "vc vive de ar?? come direito", type: "received", time: "12:41" },
        { text: "tá bom mãe 😅", type: "sent", time: "12:42" },
      ],
    },
  },
];

function TemplatePreview({ mode, content }: { mode: Mode; content: any }) {
  const [cw, ch] = CANVAS_DIMENSIONS[mode];
  const boxW = 240;
  const boxH = 320;
  const scale = Math.min(boxW / cw, boxH / ch);

  return (
    <div className="w-60 h-80 rounded-2xl overflow-hidden bg-gray-50 flex items-center justify-center border border-gray-100">
      {/* flex-center porque nem todo canvas ocupa a altura declarada — o
          tweet tem altura automática e ficaria colado no topo da caixa. */}
      <div
        className="shrink-0 origin-center flex items-center justify-center"
        style={{ width: cw, height: ch, transform: `scale(${scale})` }}
      >
        {mode === "spotify" && (
          <SpotifyCanvas content={content} handleBlur={() => {}} />
        )}
        {mode === "letterboxd" && (
          <LetterboxdCanvas content={content} handleBlur={() => {}} />
        )}
        {mode === "whatsapp" && (
          <WhatsappCanvas content={content} handleBlur={() => {}} />
        )}
        {mode === "instagram" && (
          <InstagramCanvas content={content} handleBlur={() => {}} />
        )}
        {mode === "spotifyWrapped" && (
          <SpotifyWrappedCanvas content={content} handleBlur={() => {}} />
        )}
        {mode === "notes" && <NotesCanvas content={content} handleBlur={() => {}} />}
        {mode === "tweet" && <TweetCanvas content={content} handleBlur={() => {}} />}
      </div>
    </div>
  );
}

export default function Ideias() {
  const token = useRequireAuth();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    if (!token) return;
    const fetchData = async () => {
      try {
        const profile = await api.getProfile(token);
        const userId = profile.data.id;

        const response = await api.getProjects(token, userId);
        setProjects(response.data);
      } catch (err) {
        console.error(err);
        showToast("Não foi possível carregar seus projetos.");
      }
    };
    fetchData();
  }, [token, showToast]);

  const createProject = (title: string, content: any, mode: string) => {
    if (projects.length >= 3) {
      showToast("Você atingiu o limite de 3 projetos.");
      return;
    }
    const defaultTitle = title || "Novo Projeto";
    api
      .postProject(token, { title: defaultTitle, content: content, mode: mode })
      .then((response: any) => {
        navigate(`/editor/${response.data.id}`);
      })
      .catch((err: any) => {
        console.error("Erro ao criar projeto:", err);
        const msg = err?.response?.data?.error;
        showToast(msg || "Não foi possível criar o projeto. Tente novamente.");
      });
  };

  return (
    <div className="min-h-screen bg-[#fdfbf9]">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white border border-gray-200 shadow-sm text-xs font-medium tracking-wide text-gray-600 font-secondary mb-4">
            banco de ideias
          </span>
          <h1 className="text-4xl md:text-5xl font-primary text-gray-900 mb-4">
            Comece com uma{" "}
            <span className="text-pink-500 italic font-medium">ideia pronta</span>
          </h1>
          <p className="text-gray-500 font-secondary max-w-xl mx-auto text-lg">
            Escolha um template abaixo, copie pro seu editor e deixe do seu
            jeito em segundos.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {IDEAS.map((idea) => (
            <div
              key={idea.title}
              className="flex flex-col items-center gap-4 p-5 rounded-3xl border border-gray-100 bg-white hover:shadow-[0_20px_40px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300"
            >
              <TemplatePreview mode={idea.mode} content={idea.content} />

              <span
                className={`text-[11px] font-medium px-3 py-1 rounded-full font-secondary ${MODE_STYLES[idea.mode]}`}
              >
                {MODE_LABELS[idea.mode]}
              </span>

              <div className="text-center">
                <h3 className="text-lg font-primary text-gray-900 font-medium mb-1">
                  {idea.title}
                </h3>
                <p className="text-xs text-gray-500 font-secondary leading-relaxed">
                  {idea.description}
                </p>
              </div>

              <button
                className="w-full bg-black text-white px-5 py-2.5 rounded-full text-sm font-medium hover:bg-gray-800 transition-all font-secondary cursor-pointer"
                onClick={() =>
                  createProject(idea.title, idea.content, idea.mode)
                }
              >
                Usar este template
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
