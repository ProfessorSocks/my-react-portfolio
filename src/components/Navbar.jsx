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
          <Link to="/">Home</Link>
          <Link to="/cases">Learning Logs</Link>
          <Link to="/projects">Projects</Link>
          <Link to="/contact">Contact</Link>
          <Link to="/admin">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
