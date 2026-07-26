import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import { ProjectProvider } from "./context/ProjectContext";
import { ToastProvider } from "./context/ToastContext";
import ExportTemplate from "./components/canvas/exportTemplate";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
import NotFound from "./pages/404/404Page";
import Planos from "./pages/Planos";
import Ideias from "./pages/Ideias";

import { SpeedInsights } from '@vercel/speed-insights/react';
import { Analytics } from "@vercel/analytics/react"

function AppAnalytics() {
  const location = useLocation();
  // A rota de export é renderizada pelo Puppeteer só para gerar a imagem
  // de download; carregar analytics ali só atrasa o screenshot à toa.
  if (location.pathname === "/export-template") return null;

  return (
    <>
      <SpeedInsights />
      <Analytics />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ProjectProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/home" element={<Home />} />
            <Route path="/editor/:id" element={<Editor />} />
            <Route path="/export-template" element={<ExportTemplate />} />
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/planostestfordev" element={<Planos />} />
            <Route path="/ideias" element={<Ideias />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <AppAnalytics />
        </ProjectProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
