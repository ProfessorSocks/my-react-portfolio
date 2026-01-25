import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Page from "../components/Page";
import { supabase } from "../lib/supabase";

export default function ProjectDetail() {
  const { slug } = useParams();
  const [project, setProject] = useState(null);
  const [updates, setUpdates] = useState([]);

  useEffect(() => {
    (async () => {
      const { data: p } = await supabase
        .from("projects")
        .select("*")
        .eq("slug", slug)
        .single();

      setProject(p);

      if (p?.id) {
        const { data: u } = await supabase
          .from("project_updates")
          .select("*")
          .eq("project_id", p.id)
          .order("created_at", { ascending: false });

        setUpdates(u || []);
      }
    })();
  }, [slug]);

  if (!project)
    return (
      <Page>
        <p style={{ padding: 24 }}>Loading…</p>
      </Page>
    );

  return (
    <Page>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1 style={{ marginBottom: 6 }}>{project.title}</h1>
          <div className="muted">{project.short_description}</div>
          <div className="case-tags" style={{ marginTop: 10 }}>
            {(project.tech_stack || []).map((t) => (
              <span key={t} className="tag-pill active">
                {t}
              </span>
            ))}
          </div>
        </div>
        <div className="muted" style={{ fontFamily: "monospace" }}>
          {project.pinned ? "★ pinned" : ""} {project.status}
        </div>
      </div>

      <div className="grid" style={{ marginTop: 18 }}>
        <div className="card">
          <div className="card-head">
            <h3>Problem</h3>
            <span className="card-meta">context</span>
          </div>
          <div className="card-body">{project.problem || "—"}</div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Solution</h3>
            <span className="card-meta">approach</span>
          </div>
          <div className="card-body">{project.solution || "—"}</div>
        </div>

        <div className="card">
          <div className="card-head">
            <h3>Results</h3>
            <span className="card-meta">outcome</span>
          </div>
          <div className="card-body">{project.results || "—"}</div>
        </div>
      </div>

      <div
        style={{ marginTop: 18, display: "flex", gap: 10, flexWrap: "wrap" }}
      >
        {project.github_url && (
          <a
            className="admin-button"
            href={project.github_url}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        )}
        {project.live_url && (
          <a
            className="admin-button"
            href={project.live_url}
            target="_blank"
            rel="noreferrer"
          >
            Live Demo
          </a>
        )}
      </div>

      <div style={{ marginTop: 26 }}>
        <h2>Updates</h2>
        <p className="muted">
          Progress log entries (mini case logs) for this project.
        </p>

        <div className="terminal-list" style={{ marginTop: 10 }}>
          {updates.map((u) => (
            <div
              key={u.id}
              className="terminal-row"
              style={{ cursor: "default" }}
            >
              <span className="terminal-bullet">+</span>
              <span className="terminal-title">{u.title}</span>
              <span className="terminal-meta">
                {new Date(u.created_at).toLocaleDateString()}
              </span>
            </div>
          ))}
          {updates.length === 0 && (
            <div className="muted" style={{ padding: 12 }}>
              No updates yet.
            </div>
          )}
        </div>
      </div>
    </Page>
  );
}
