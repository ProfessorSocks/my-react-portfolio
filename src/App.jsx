import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import CaseLogs from "./pages/CaseLogs";
import Admin from "./pages/Admin";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Docs from "./pages/Docs";
import Contact from "./pages/Contact";
import Bottom from "./components/Bottom";
import ScrollToTop from "./components/ScrollToTop";
import TerminalBackground from "./components/TerminalBackground";

function Pill({ children }) {
  return <span className="pill">{children}</span>;
}

function Card({ title, children, meta }) {
  return (
    <div className="card">
      <div className="card-head">
        <h3>{title}</h3>
        {meta ? <span className="card-meta">{meta}</span> : null}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

export default function App() {
  return (
    <>
      <TerminalBackground />
      <Navbar />
      <ScrollToTop />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cases" element={<CaseLogs />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/projects/:slug" element={<ProjectDetail />} />
        <Route path="/docs" element={<Docs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      {/* <Bottom /> */}
    </>
  );
}
