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
  "React",
];

export default function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

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
                <div className="case-admin-title">{c.title}</div>
                <button
                  className="admin-button danger"
                  onClick={() => deleteCase(c.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Page>
  );
}
