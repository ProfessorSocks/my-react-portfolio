import { useEffect, useState } from "react";
import Page from "../components/Page";
import { supabase } from "../lib/supabase";

const STACK_OPTIONS = [
  "Linux",
  "Windows",
  "Git",
  "Networking",
  "Hardware",
  "React",
];

export default function AdminProjects() {
  const [projects, setProjects] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    short_description: "",
    tech_stack: [],
    status: "In Progress",
    pinned: false,
    problem: "",
    solution: "",
    results: "",
    github_url: "",
    live_url: "",
  });
  const [updates, setUpdates] = useState({});
  const [newUpdate, setNewUpdate] = useState({
    title: "",
    body: "",
    tags: [],
  });
  async function loadUpdates(projectId) {
    const { data } = await supabase
      .from("project_updates")
      .select("*")
      .eq("project_id", projectId)
      .order("created_at", { ascending: false });

    setUpdates((prev) => ({
      ...prev,
      [projectId]: data || [],
    }));
  }

  useEffect(() => {
    loadProjects();
  }, []);

  async function loadProjects() {
    const { data } = await supabase
      .from("projects")
      .select("*")
      .order("pinned", { ascending: false });

    setProjects(data || []);
  }

  async function handleSubmit(e) {
    e.preventDefault();

    await supabase.from("projects").insert([
      {
        ...form,
        user_id: (await supabase.auth.getUser()).data.user.id,
      },
    ]);

    setForm({
      title: "",
      slug: "",
      short_description: "",
      tech_stack: [],
      status: "In Progress",
      pinned: false,
    });

    loadProjects();
  }

  return (
    <Page>
      <h1>Admin Projects</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-field">
          <label>Title</label>
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="admin-field">
          <label>Slug (URL-safe)</label>
          <input
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
          />
        </div>

        <div className="admin-field">
          <label>Short Description</label>
          <textarea
            value={form.short_description}
            onChange={(e) =>
              setForm({ ...form, short_description: e.target.value })
            }
          />
        </div>
        <div className="admin-field">
          <label>GitHub URL</label>
          <input
            value={form.github_url}
            onChange={(e) => setForm({ ...form, github_url: e.target.value })}
            placeholder="https://github.com/username/repo"
          />
        </div>
        <div className="admin-field">
          <label>Live Demo URL</label>
          <input
            value={form.live_url}
            onChange={(e) => setForm({ ...form, live_url: e.target.value })}
            placeholder="https://example.com"
          />
        </div>
        <div className="admin-field">
          <label>Problem</label>
          <textarea
            value={form.problem}
            onChange={(e) => setForm({ ...form, problem: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>Solution</label>
          <textarea
            value={form.solution}
            onChange={(e) => setForm({ ...form, solution: e.target.value })}
          />
        </div>
        <div className="admin-field">
          <label>Results</label>
          <textarea
            value={form.results}
            onChange={(e) => setForm({ ...form, results: e.target.value })}
          />
        </div>

        <div className="admin-field">
          <label>Tech Stack</label>
          <div className="tag-picker">
            {STACK_OPTIONS.map((tag) => (
              <button
                type="button"
                key={tag}
                className={`tag-pill ${
                  form.tech_stack.includes(tag) ? "active" : ""
                }`}
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    tech_stack: prev.tech_stack.includes(tag)
                      ? prev.tech_stack.filter((t) => t !== tag)
                      : [...prev.tech_stack, tag],
                  }))
                }
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-field">
          <label>Status</label>
          <select
            className="admin-input"
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
          >
            <option>In Progress</option>
            <option>Completed</option>
            <option>Planned</option>
          </select>
        </div>

        <div className="admin-field">
          <label>
            <input
              type="checkbox"
              checked={form.pinned}
              onChange={(e) => setForm({ ...form, pinned: e.target.checked })}
            />
            &nbsp;Pinned
          </label>
        </div>

        <button className="admin-button" type="submit">
          Add Project
        </button>
      </form>

      <h2 style={{ marginTop: 40 }}>Existing Projects</h2>

      {projects.map((p) => (
        <div key={p.id} className="project-admin-card">
          <div className="project-admin-header">
            <div className="project-admin-left">
              <span className="project-admin-title">
                {p.pinned ? "★ " : ""}
                {p.title}
              </span>
              <span className="project-admin-status">{p.status}</span>
            </div>

            <div className="project-admin-actions">
              <button
                className="admin-button"
                onClick={() => {
                  setEditingId(p.id);
                  setEditForm({ ...p });
                  loadUpdates(p.id);
                }}
              >
                Edit
              </button>

              <button
                className="admin-button danger"
                onClick={async () => {
                  await supabase.from("projects").delete().eq("id", p.id);
                  loadProjects();
                }}
              >
                Delete
              </button>
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div className="project-admin-tags">
            {(p.tech_stack || []).map((tag) => (
              <span key={tag} className="tag-pill active">
                {tag}
              </span>
            ))}
          </div>

          {/* 🔽 Inline Edit Expansion */}
          {editingId === p.id && editForm && (
            <div className="admin-edit-panel">
              <form
                className="admin-form"
                onSubmit={async (e) => {
                  e.preventDefault();

                  const { error } = await supabase
                    .from("projects")
                    .update({
                      title: editForm.title,
                      slug: editForm.slug,
                      short_description: editForm.short_description,
                      tech_stack: editForm.tech_stack,
                      status: editForm.status,
                      pinned: editForm.pinned,
                      problem: editForm.problem,
                      solution: editForm.solution,
                      results: editForm.results,
                      github_url: editForm.github_url,
                      live_url: editForm.live_url,
                    })
                    .eq("id", p.id);

                  if (!error) {
                    setEditingId(null);
                    setEditForm(null);
                    loadProjects();
                  } else {
                    alert("Update failed: " + error.message);
                  }
                }}
              >
                <div className="admin-field">
                  <label>Title</label>
                  <input
                    value={editForm.title}
                    onChange={(e) =>
                      setEditForm({ ...editForm, title: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Slug</label>
                  <input
                    value={editForm.slug}
                    onChange={(e) =>
                      setEditForm({ ...editForm, slug: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Short Description</label>
                  <textarea
                    value={editForm.short_description}
                    onChange={(e) =>
                      setEditForm({
                        ...editForm,
                        short_description: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>GitHub URL</label>
                  <input
                    value={editForm.github_url || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, github_url: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Live URL</label>
                  <input
                    value={editForm.live_url || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, live_url: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Tech Stack</label>
                  <div className="tag-picker">
                    {STACK_OPTIONS.map((tag) => (
                      <button
                        key={tag}
                        type="button"
                        className={`tag-pill ${
                          editForm.tech_stack?.includes(tag) ? "active" : ""
                        }`}
                        onClick={() =>
                          setEditForm((prev) => ({
                            ...prev,
                            tech_stack: prev.tech_stack?.includes(tag)
                              ? prev.tech_stack.filter((t) => t !== tag)
                              : [...(prev.tech_stack || []), tag],
                          }))
                        }
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="admin-field">
                  <label>Status</label>
                  <select
                    className="admin-input"
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                  >
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Planned</option>
                  </select>
                </div>

                <div className="admin-field">
                  <label>
                    <input
                      type="checkbox"
                      checked={editForm.pinned}
                      onChange={(e) =>
                        setEditForm({ ...editForm, pinned: e.target.checked })
                      }
                    />
                    &nbsp;Pinned
                  </label>
                </div>

                <div className="admin-field">
                  <label>Problem</label>
                  <textarea
                    value={editForm.problem || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, problem: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Solution</label>
                  <textarea
                    value={editForm.solution || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, solution: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Results</label>
                  <textarea
                    value={editForm.results || ""}
                    onChange={(e) =>
                      setEditForm({ ...editForm, results: e.target.value })
                    }
                  />
                </div>

                <div style={{ display: "flex", gap: 10 }}>
                  <button className="admin-button" type="submit">
                    Save Changes
                  </button>

                  <button
                    className="admin-button"
                    type="button"
                    onClick={() => {
                      setEditingId(p.id);
                      setEditForm({ ...p });
                      loadUpdates(p.id);
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
              <hr style={{ margin: "24px 0" }} />

              <h3>Project Updates</h3>

              <form
                className="admin-form"
                onSubmit={async (e) => {
                  e.preventDefault();

                  await supabase.from("project_updates").insert([
                    {
                      project_id: p.id,
                      user_id: (await supabase.auth.getUser()).data.user.id,
                      title: newUpdate.title,
                      body: newUpdate.body,
                      tags: newUpdate.tags,
                    },
                  ]);

                  setNewUpdate({ title: "", body: "", tags: [] });
                  loadUpdates(p.id);
                }}
              >
                <div className="admin-field">
                  <label>Update Title</label>
                  <input
                    value={newUpdate.title}
                    onChange={(e) =>
                      setNewUpdate({ ...newUpdate, title: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Details</label>
                  <textarea
                    value={newUpdate.body}
                    onChange={(e) =>
                      setNewUpdate({ ...newUpdate, body: e.target.value })
                    }
                  />
                </div>

                <div className="admin-field">
                  <label>Tags</label>
                  <div className="tag-picker">
                    {["Linux", "Docs", "Fix", "Debug", "Hardware"].map(
                      (tag) => (
                        <button
                          key={tag}
                          type="button"
                          className={`tag-pill ${
                            newUpdate.tags.includes(tag) ? "active" : ""
                          }`}
                          onClick={() =>
                            setNewUpdate((prev) => ({
                              ...prev,
                              tags: prev.tags.includes(tag)
                                ? prev.tags.filter((t) => t !== tag)
                                : [...prev.tags, tag],
                            }))
                          }
                        >
                          {tag}
                        </button>
                      ),
                    )}
                  </div>
                </div>

                <button className="admin-button" type="submit">
                  Add Update
                </button>
              </form>
            </div>
          )}
          <div className="project-updates-list">
            {(updates[p.id] || []).map((u) => (
              <div key={u.id} className="case-admin-card">
                <strong>{u.title}</strong>
                <p>{u.body}</p>

                <div className="project-admin-tags">
                  {(u.tags || []).map((tag) => (
                    <span key={tag} className="tag-pill active">
                      {tag}
                    </span>
                  ))}
                </div>

                <button
                  className="admin-button danger"
                  onClick={async () => {
                    await supabase
                      .from("project_updates")
                      .delete()
                      .eq("id", u.id);
                    loadUpdates(p.id);
                  }}
                >
                  Delete Update
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </Page>
  );
}
