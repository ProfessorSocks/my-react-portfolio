import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Page from "../components/Page";
import { supabase } from "../lib/supabase";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [q, setQ] = useState("");
  const [tag, setTag] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("projects")
        .select("*")
        .order("pinned", { ascending: false })
        .order("updated_at", { ascending: false });

      setProjects(data || []);
    })();
  }, []);

  const allTags = useMemo(() => {
    const set = new Set();
    projects.forEach((p) => (p.tech_stack || []).forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [projects]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return projects.filter((p) => {
      const matchesQ =
        !s ||
        (p.title || "").toLowerCase().includes(s) ||
        (p.short_description || "").toLowerCase().includes(s) ||
        (p.problem || "").toLowerCase().includes(s) ||
        (p.solution || "").toLowerCase().includes(s) ||
        (p.results || "").toLowerCase().includes(s) ||
        (p.tech_stack || []).some((t) => t.toLowerCase().includes(s));

      const matchesTag = !tag || (p.tech_stack || []).includes(tag);
      return matchesQ && matchesTag;
    });
  }, [projects, q, tag]);

  return (
    <Page>
      <div className="projects-head">
        <h1>Projects</h1>
        <p className="muted">
          Terminal-style index of labs, builds, and documented work. Click any
          project for the full page + updates.
        </p>

        <div className="projects-controls">
          <input
            className="admin-input"
            placeholder="Search projects (Linux, Git, Raspberry Pi, docs...)"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />

          <select
            className="admin-input"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          >
            <option value="">Filter by tag</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="terminal-list">
        {filtered.map((p) => (
          <Link key={p.id} to={`/projects/${p.slug}`} className="terminal-row">
            <span className="terminal-bullet">{p.pinned ? "★" : ">"}</span>
            <span className="terminal-title">{p.title}</span>
            <span className="terminal-meta">{p.status}</span>
          </Link>
        ))}
        {filtered.length === 0 && (
          <div className="muted" style={{ padding: 12 }}>
            No matching projects.
          </div>
        )}
      </div>
    </Page>
  );
}
