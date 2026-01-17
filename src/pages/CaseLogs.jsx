import { useEffect, useState } from "react";




export default function CaseLogs() {
  const [cases, setCases] = useState([]);

  useEffect(() => {
  fetch(`${import.meta.env.BASE_URL}data/cases.json`)
    .then((res) => res.json())
    .then((data) => setCases(data))
    .catch(() => setCases([]));
}, []);

  return (
    <div style={{ padding: 24, maxWidth: 900 }}>
      <h1>Case Logs</h1>
      <p>Real troubleshooting cases, documented like IT tickets.</p>

      {cases.length === 0 && <p>No cases logged yet.</p>}

      {cases.map((c) => (
  <div
    key={c.id}
    style={{
      border: "1px solid #2a2f3a",
      padding: 16,
      marginTop: 16,
      borderRadius: 10,
      background: "#0b0f14",
      boxShadow: "0 0 0 1px rgba(126,231,135,0.05)",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between" }}>
      <h2 style={{ margin: 0 }}>{c.title}</h2>
      <span style={{ color: "#7ee787" }}>{c.date}</span>
    </div>

    <p><b>Environment:</b> {c.environment}</p>
    <p><b>Issue:</b> {c.issue}</p>
    <p><b>Symptoms:</b> {c.symptoms}</p>
    <p><b>Root Cause:</b> {c.rootCause}</p>
    <p><b>Fix:</b> {c.fix}</p>
    <p><b>Notes:</b> {c.notes}</p>
  </div>
))}
</div>
  );
}
