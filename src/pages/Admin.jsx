import { useState, useEffect } from "react";

function exportCases() {
  const blob = new Blob([JSON.stringify(cases, null, 2)], {
    type: "application/json",
  });

  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "cases.json";
  link.click();
}

export default function Admin() {
  const [password, setPassword] = useState("");
  const [isAuthed, setIsAuthed] = useState(
    localStorage.getItem("admin_authed") === "true"
  );
  const [error, setError] = useState("");

  const [cases, setCases] = useState([]);
  const [form, setForm] = useState({
    title: "",
    issue: "",
    environment: "",
    symptoms: "",
    rootCause: "",
    fix: "",
    notes: "",
  });

  useEffect(() => {
    const saved = localStorage.getItem("case_logs");
    if (saved) {
      setCases(JSON.parse(saved));
    }
  }, []);

  function handleLogin(e) {
    e.preventDefault();
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      localStorage.setItem("admin_authed", "true");
      setIsAuthed(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  }

  function handleLogout() {
    localStorage.removeItem("admin_authed");
    setIsAuthed(false);
  }

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newCase = {
      id: Date.now(),
      ...form,
      date: new Date().toISOString().split("T")[0],
    };

    const updated = [newCase, ...cases];
    setCases(updated);
    localStorage.setItem("case_logs", JSON.stringify(updated));

    setForm({
      title: "",
      issue: "",
      environment: "",
      symptoms: "",
      rootCause: "",
      fix: "",
      notes: "",
    });
  }

  if (!isAuthed) {
    return (
      <div style={{ padding: 24, maxWidth: 400 }}>
        <h1>Admin Login</h1>
        <form onSubmit={handleLogin}>
          <input
            type="password"
            placeholder="Enter admin password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <button type="submit">Login</button>
        </form>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </div>
    );
  }

  return (
    <div style={{ padding: 24, maxWidth: 800 }}>
      <h1>Admin Dashboard</h1>
      <button className="admin-button" onClick={handleLogout}>Log out</button>
      <button className="admin-button" onClick={exportCases}>Export Cases to JSON</button>

      <h2>Add New Case Log</h2>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 8 }}>
        <input name="title" placeholder="Title" value={form.title} onChange={handleChange} />
        <input name="issue" placeholder="Issue" value={form.issue} onChange={handleChange} />
        <input name="environment" placeholder="Environment" value={form.environment} onChange={handleChange} />
        <textarea name="symptoms" placeholder="Symptoms" value={form.symptoms} onChange={handleChange} />
        <textarea name="rootCause" placeholder="Root Cause" value={form.rootCause} onChange={handleChange} />
        <textarea name="fix" placeholder="Fix" value={form.fix} onChange={handleChange} />
        <textarea name="notes" placeholder="Notes" value={form.notes} onChange={handleChange} />
        <button className="admin-button" type="submit">Save Case</button>
      </form>

      <h2>Saved Case Logs</h2>
     {cases.map((c) => (
  <div key={c.id} style={{ border: "1px solid #444", padding: 12, marginTop: 12 }}>
    <strong>{c.title}</strong>
    <p><b>Issue:</b> {c.issue}</p>
    <p><b>Fix:</b> {c.fix}</p>
    <p><b>Date:</b> {c.date}</p>

    <button className="admin-button"
      onClick={() => {
        const updated = cases.filter((x) => x.id !== c.id);
        setCases(updated);
        localStorage.setItem("case_logs", JSON.stringify(updated));
      }}
    >
      Delete
    </button>
  </div>
))}

    </div>
  );
}

