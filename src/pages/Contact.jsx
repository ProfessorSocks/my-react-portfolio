import { Routes, Route } from "react-router-dom";
import Card from "../components/Card";
import Pill from "../components/Pill";
import Page from "../components/Page";

export default function Contact() {
  return (
    <Page>
      <h1>Contact</h1>
      <p className="contact-sub">
        The fastest way to reach me is by email. I’m also available on GitHub
        and LinkedIn.
      </p>

      <div className="contact-grid">
        <a className="contact-card" href="mailto:camillewtech@gmail.com">
          <span className="contact-label">Email</span>
          <span className="contact-value">camillewtech@gmail.com</span>
          <span className="contact-hint">Opens your mail app</span>
        </a>

        <a className="contact-card" href="tel:+17026083254">
          <span className="contact-label">Phone</span>
          <span className="contact-value">+1 (702) 608-3254</span>
          <span className="contact-hint">Opens your dialer</span>
        </a>

        <a
          className="contact-card"
          href="https://www.linkedin.com/in/camille-west-646b49269"
          target="_blank"
          rel="noreferrer"
        >
          <span className="contact-label">LinkedIn</span>
          <span className="contact-value">linkedin.com/in/camille-west</span>
          <span className="contact-hint">Opens in new tab</span>
        </a>

        <a
          className="contact-card"
          href="https://github.com/ProfessorSocks"
          target="_blank"
          rel="noreferrer"
        >
          <span className="contact-label">GitHub</span>
          <span className="contact-value">@ProfessorSocks</span>
          <span className="contact-hint">View repositories</span>
        </a>
      </div>
      <div className="about-panel">
        <h2>About Me</h2>
        <p>
          I’m an IT-focused builder and documenter with hands-on experience in
          troubleshooting, Linux, hardware, and system setup. I enjoy turning
          problems into clear case logs, root-cause analyses, and repeatable
          fixes.
        </p>
        <p>
          This site acts as both a portfolio and a living knowledge base —
          showing how I think, how I debug, and how I communicate technical work
          clearly.
        </p>
        <p>
          Currently studying, building labs, and seeking opportunities in IT
          support, systems, and technical documentation.
        </p>
      </div>
    </Page>
  );
}
