import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import { ProjectProvider } from "./context/ProjectContext";
import ExportTemplate from "./components/canvas/exportTemplate";
import Login from "./pages/Login";
import Cadastro from "./pages/Cadastro";
function App() {
  return (
    <BrowserRouter>
      <ProjectProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/editor/:id" element={<Editor />} />
          <Route path="/export-template" element={<ExportTemplate />} />
          <Route path="/login" element={<Login />} />
          <Route path="/cadastro" element={<Cadastro />} />
        </Routes>
      </ProjectProvider>
    </BrowserRouter>
  );
}

export default App;
