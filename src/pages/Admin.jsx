import { useState, useEffect } from "react";
import { supabase } from "../lib/supabase";
import Page from "../components/Page";

const TAG_OPTIONS = [
  "Linux",
  "Windows",
  "Git",
  "Networking",
  "Hardware",
  "Deployment",
  "Security",
  "PowerShell",
  "Python",
  "Javascript",
  "React",
];

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);

  const [form, setForm] = useState({
    title: "",
    environment: "",
    issue: "",
    symptoms: "",
    rootCause: "",
    fix: "",
    notes: "",
    tags: [],
  });

  const [cases, setCases] = useState([]);

  async function loadCases() {
    const { data } = await supabase
      .from("case_logs")
      .select("*")
      .order("created_at", { ascending: false });

    setCases(data || []);
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      if (data.session) loadCases(); // ← ADD THIS
    });

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        if (session) loadCases(); // ← ADD THIS
      },
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) setError(error.message);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const { error } = await supabase.from("case_logs").insert([
      {
        title: form.title,
        environment: form.environment,
        issue: form.issue,
        symptoms: form.symptoms,
        root_cause: form.rootCause,
        fix: form.fix,
        notes: form.notes,
        tags: form.tags, // <-- NEW
        user_id: session.user.id,
      },
    ]);

    if (error) {
      alert("Error saving case: " + error.message);
    } else {
      alert("Case saved!");
      setForm({
        title: "",
        environment: "",
        issue: "",
        symptoms: "",
        rootCause: "",
        fix: "",
        notes: "",
      });
      loadCases(); // ← ADD THIS
    }
  }

  if (!session) {
    return (
      <Page>
        <div style={{ padding: 24, maxWidth: 400 }}>
          <h1>Admin Login</h1>
          <form onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <br />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <br />
            <button className="admin-button" type="submit">
              Log in
            </button>
          </form>
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      </Page>
    );
  }
  async function deleteCase(id) {
    const { error } = await supabase.from("case_logs").delete().eq("id", id);

    if (error) {
      alert("Delete failed: " + error.message);
    } else {
      loadCases(); // refresh list
    }
  }

  return (
    <Page>
      <div className="admin-wrap">
        <div className="admin-header">
          <h1>Admin Dashboard</h1>
          <div className="admin-user">
            <span>Logged in as: {session.user.email}</span>
            <button className="admin-button" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </div>

        <div className="admin-panel">
          <h2>Add New Case Log</h2>

          <form className="admin-form" onSubmit={handleSubmit}>
            <div className="admin-field">
              <label>Title</label>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div className="admin-field">
              <label>Environment</label>
              <input
                value={form.environment}
                onChange={(e) =>
                  setForm({ ...form, environment: e.target.value })
                }
              />
            </div>

            <div className="admin-field">
              <label>Issue</label>
              <textarea
                value={form.issue}
                onChange={(e) => setForm({ ...form, issue: e.target.value })}
              />
            </div>

            <div className="admin-field">
              <label>Symptoms</label>
              <textarea
                value={form.symptoms}
                onChange={(e) => setForm({ ...form, symptoms: e.target.value })}
              />
            </div>

            <div className="admin-field">
              <label>Root Cause</label>
              <textarea
                value={form.rootCause}
                onChange={(e) =>
                  setForm({ ...form, rootCause: e.target.value })
                }
              />
            </div>

            <div className="admin-field">
              <label>Fix</label>
              <textarea
                value={form.fix}
                onChange={(e) => setForm({ ...form, fix: e.target.value })}
              />
            </div>

            <div className="admin-field">
              <label>Notes</label>
              <textarea
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </div>
            <div className="admin-field">
              <label>Tags</label>
              <div className="tag-picker">
                {TAG_OPTIONS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    className={`tag-pill ${form.tags.includes(tag) ? "active" : ""}`}
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        tags: prev.tags.includes(tag)
                          ? prev.tags.filter((t) => t !== tag)
                          : [...prev.tags, tag],
                      }));
                    }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            <button className="admin-button" type="submit">
              Save Case Log
            </button>
          </form>
        </div>

        <div className="admin-panel">
          <h2>Existing Case Logs</h2>

          <div className="admin-case-list">
            {cases.map((c) => (
              <div key={c.id} className="case-admin-card">
                <div className="case-admin-header">
                  <div className="case-admin-title">{c.title}</div>

                  <div className="case-admin-actions">
                    <button
                      className="admin-button"
                      onClick={() => {
                        setEditingId(c.id);
                        setEditForm({
                          title: c.title,
                          environment: c.environment,
                          issue: c.issue,
                          symptoms: c.symptoms,
                          rootCause: c.root_cause,
                          fix: c.fix,
                          notes: c.notes,
                          tags: c.tags || [],
                        });
                      }}
                    >
                      Edit
                    </button>

                    <button
                      className="admin-button danger"
                      onClick={() => deleteCase(c.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {editingId === c.id && (
                  <div className="admin-edit-panel">
                    {/* Edit form will go here next */}
                    <form
                      className="admin-form"
                      onSubmit={async (e) => {
                        e.preventDefault();

                        const { error } = await supabase
                          .from("case_logs")
                          .update({
                            title: editForm.title,
                            environment: editForm.environment,
                            issue: editForm.issue,
                            symptoms: editForm.symptoms,
                            root_cause: editForm.rootCause,
                            fix: editForm.fix,
                            notes: editForm.notes,
                            tags: editForm.tags,
                          })
                          .eq("id", c.id);

                        if (!error) {
                          setEditingId(null);
                          setEditForm(null);
                          loadCases();
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
                        <label>Environment</label>
                        <input
                          value={editForm.environment}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              environment: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="admin-field">
                        <label>Issue</label>
                        <textarea
                          value={editForm.issue}
                          onChange={(e) =>
                            setEditForm({ ...editForm, issue: e.target.value })
                          }
                        />
                      </div>

                      <div className="admin-field">
                        <label>Symptoms</label>
                        <textarea
                          value={editForm.symptoms}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              symptoms: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="admin-field">
                        <label>Root Cause</label>
                        <textarea
                          value={editForm.rootCause}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              rootCause: e.target.value,
                            })
                          }
                        />
                      </div>

                      <div className="admin-field">
                        <label>Fix</label>
                        <textarea
                          value={editForm.fix}
                          onChange={(e) =>
                            setEditForm({ ...editForm, fix: e.target.value })
                          }
                        />
                      </div>

                      <div className="admin-field">
                        <label>Notes</label>
                        <textarea
                          value={editForm.notes}
                          onChange={(e) =>
                            setEditForm({ ...editForm, notes: e.target.value })
                          }
                        />
                      </div>

                      <div className="admin-field">
                        <label>Tags</label>
                        <div className="tag-picker">
                          {TAG_OPTIONS.map((tag) => (
                            <button
                              key={tag}
                              type="button"
                              className={`tag-pill ${
                                editForm.tags.includes(tag) ? "active" : ""
                              }`}
                              onClick={() =>
                                setEditForm((prev) => ({
                                  ...prev,
                                  tags: prev.tags.includes(tag)
                                    ? prev.tags.filter((t) => t !== tag)
                                    : [...prev.tags, tag],
                                }))
                              }
                            >
                              {tag}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: "flex", gap: 10 }}>
                        <button className="admin-button" type="submit">
                          Save Changes
                        </button>
                        <button
                          className="admin-button"
                          type="button"
                          onClick={() => {
                            setEditingId(null);
                            setEditForm(null);
                          }}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}
