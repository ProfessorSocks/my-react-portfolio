import { Link } from "react-router-dom";
import "../App.css";
import Card from "../components/Card";
import Pill from "../components/Pill";
export default function Home() {
  return (
    <div className="app">
      <main className="container">
        {/* HERO */}
        <section className="hero">
          <div className="hero-left">
            <h1>Camille West</h1>
            <p className="subtitle">
              IT Support • Documentation • Hardware + Linux
            </p>
            <p className="lede">
              I build reliable systems, document fixes, and troubleshoot from
              symptoms → root cause → prevention. This site is my living lab
              notebook and portfolio.
            </p>

            <div className="cta-row">
              <a className="btn" href="#projects">
                View Projects
              </a>
              <a className="btn btn-ghost" href="#cases">
                See Case Logs
              </a>
              <a className="btn btn-ghost" href="#contact">
                Contact
              </a>
            </div>

            <div className="link-row">
              <a
                href="https://github.com/ProfessorSocks"
                target="_blank"
                rel="noreferrer"
              >
                Github project page
              </a>
              <span className="dot">•</span>
              <a
                href="https://www.linkedin.com/in/camille-west-646b49269"
                target="_blank"
                rel="noreferrer"
              >
                LinkedIn
              </a>
              <span className="dot">•</span>
              <a
                href="/my-react-portfolio/resume.pdf"
                target="_blank"
                rel="noreferrer"
              >
                Resume
              </a>
            </div>
          </div>

          <div className="hero-right">
            <div className="terminal">
              <div className="terminal-top">
                <span className="t-dot red" />
                <span className="t-dot yellow" />
                <span className="t-dot green" />
                <span className="terminal-title">case-log — last session</span>
              </div>
              <pre className="terminal-body">
                {`> issue: GitHub Pages branch not appearing
> symptom: deploy tool reports gh-pages exists
> checks: git branch -a, remotes, cache
> fix: clear stale refs + redeploy
> outcome: site published successfully`}
              </pre>
            </div>
          </div>
        </section>

        {/* SKILLS */}
        <section id="skills" className="section">
          <div className="section-head">
            <h2>Skills</h2>
            <p>Focused on practical troubleshooting and clean documentation.</p>
          </div>

          <div className="grid">
            <Card title="Operating Systems" meta="daily use">
              <div className="pill-row">
                <Pill>Windows 11</Pill>
                <Pill>Ubuntu / WSL</Pill>
                <Pill>Linux basics</Pill>
                <Pill>File permissions</Pill>
              </div>
            </Card>

            <Card title="Tools & Workflow" meta="repeatable">
              <div className="pill-row">
                <Pill>Git / GitHub</Pill>
                <Pill>VS Code</Pill>
                <Pill>PowerShell</Pill>
                <Pill>Bash</Pill>
                <Pill>Documentation</Pill>
              </div>
            </Card>

            <Card title="Hardware" meta="hands-on">
              <div className="pill-row">
                <Pill>PC building</Pill>
                <Pill>Drivers</Pill>
                <Pill>Component troubleshooting</Pill>
                <Pill>Cable / port checks</Pill>
              </div>
            </Card>
          </div>
        </section>

        {/* CASE LOGS */}
        <section id="cases" className="section">
          <div className="section-head">
            <h2>Case Logs</h2>
            <p>
              Ticket-style writeups: issue → environment → steps → root cause →
              fix → prevention.
            </p>
          </div>

          <div className="grid">
            <Card title="PowerShell blocked npm scripts" meta="Windows">
              <ul className="list">
                <li>
                  <b>Symptom:</b> “scripts are disabled” when running npm
                </li>
                <li>
                  <b>Fix:</b> Set-ExecutionPolicy for CurrentUser
                </li>
                <li>
                  <b>Outcome:</b> npm + React tooling worked normally
                </li>
              </ul>
            </Card>

            <Card title="Git + OneDrive indexing errors" meta="Windows">
              <ul className="list">
                <li>
                  <b>Symptom:</b> git failed indexing files in OneDrive path
                </li>
                <li>
                  <b>Fix:</b> move repo to local Dev folder outside OneDrive
                </li>
                <li>
                  <b>Outcome:</b> commits/pushes stabilized
                </li>
              </ul>
            </Card>

            <Card title="GitHub Pages gh-pages confusion" meta="Deployment">
              <ul className="list">
                <li>
                  <b>Symptom:</b> branch not visible / stale refs
                </li>
                <li>
                  <b>Fix:</b> clear stale refs/cache, rebuild, redeploy
                </li>
                <li>
                  <b>Outcome:</b> site published at GitHub Pages URL
                </li>
              </ul>
            </Card>
          </div>
        </section>

        {/* PROJECTS */}
        <section id="projects" className="section">
          <div className="section-head">
            <h2>Projects</h2>
            <p>Small, real projects with clean commits and documentation.</p>
          </div>

          <div className="grid">
            <Card title="Resume Website (React + Vite)" meta="live">
              <p>
                Portfolio site deployed to GitHub Pages. Built to showcase
                documentation and troubleshooting.
              </p>
              <div className="card-actions">
                <a
                  className="btn btn-small"
                  href="https://github.com/ProfessorSocks/my-react-portfolio"
                  target="_blank"
                  rel="noreferrer"
                >
                  Repo
                </a>
                <a
                  className="btn btn-small btn-ghost"
                  href="https://professorsocks.github.io/my-react-portfolio/"
                  target="_blank"
                  rel="noreferrer"
                >
                  Live
                </a>
              </div>
            </Card>

            <Card title="Linux Lab PC" meta="in progress">
              <p>
                Plan: install Linux, intentionally break/fix services, and
                document the fixes like real tickets.
              </p>
              <div className="card-actions">
                <a className="btn btn-small btn-ghost" href="#docs">
                  See runbooks
                </a>
              </div>
            </Card>
          </div>
        </section>

        {/* DOCS */}
        <section id="docs" className="section">
          <div className="section-head">
            <h2>Docs / Runbooks</h2>
            <p>Short, reusable instructions (what I’d hand to a teammate).</p>
          </div>

          <div className="grid">
            <Card title="Runbook: Set up Node + npm on Windows" meta="doc">
              <p>
                Install Node LTS → verify versions → fix PowerShell execution
                policy if needed.
              </p>
            </Card>

            <Card title="Runbook: Deploy Vite React to GitHub Pages" meta="doc">
              <p>
                Set Vite base path → build → deploy to gh-pages → select branch
                in Pages settings.
              </p>
            </Card>
          </div>
        </section>

        {/* CONTACT */}
        <section id="contact" className="section">
          <div className="section-head">
            <h2>Contact</h2>
            <p>Best way to reach me:</p>
          </div>

          <div className="contact-card">
            <p>
              Email:{" "}
              <a href="mailto:camillewest2002@gmail.com">
                camillewest2002@gmail.com
              </a>
            </p>
            <p>
              GitHub:{" "}
              <a
                href="https://github.com/ProfessorSocks"
                target="_blank"
                rel="noreferrer"
              >
                @ProfessorSocks
              </a>
            </p>
          </div>
        </section>

        <footer className="footer">
          <span>
            © {new Date().getFullYear()} Camille West — built with React + Vite
          </span>
        </footer>
      </main>
      <div>
        <p>
          Go to <Link to="/admin">Admin</Link>
        </p>
      </div>
    </div>
  );
}
