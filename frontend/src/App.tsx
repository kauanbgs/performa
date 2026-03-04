import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Home from "./pages/Home";
import Editor from "./pages/Editor";
import { ProjectProvider } from "./context/ProjectContext";
import ExportTemplate from "./components/canvas/exportTemplate";

function App() {
  return (
    <BrowserRouter>
      <ProjectProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/home" element={<Home />} />
          <Route path="/editor" element={<Editor />} />
          <Route path="/export-template" element={<ExportTemplate />} />
        </Routes>
      </ProjectProvider>
    </BrowserRouter>
  );
}

export default App;
