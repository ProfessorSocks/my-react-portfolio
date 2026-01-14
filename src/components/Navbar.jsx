import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="nav">
      <div className="nav-inner">
        <div className="brand">
          <span className="brand-dot" />
          <span className="brand-text">ProfessorSocks</span>
        </div>

        <nav className="nav-links">
          <a href="#skills">Skills</a>
          <Link to="/cases">Case Logs</Link>
          <a href="#projects">Projects</a>
          <a href="#docs">Docs</a>
          <a href="#contact">Contact</a>
        </nav>
      </div>
    </header>
  );
}
