import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import Page from "../components/Page";

export default function CaseLogs() {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCases() {
      const { data, error } = await supabase
        .from("case_logs")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error loading cases:", error.message);
      } else {
        setCases(data || []);
      }
      setLoading(false);
    }

    loadCases();
  }, []);

  if (loading) return <p style={{ padding: 24 }}>Loading case logs...</p>;

  return (
    <Page>
      <div style={{ padding: 24, maxWidth: 900 }}>
        <h1>Case Logs</h1>

        {cases.length === 0 && <p>No cases logged yet.</p>}

        <div className="case-grid">
          {cases.map((c) => (
            <div key={c.id} className="case-card">
              <h2>{c.title}</h2>
              <p>
                <b>Environment:</b> {c.environment}
              </p>
              <p>
                <b>Issue:</b> {c.issue}
              </p>
              <p>
                <b>Symptoms:</b> {c.symptoms}
              </p>
              <p>
                <b>Root Cause:</b> {c.root_cause}
              </p>
              <p>
                <b>Fix:</b> {c.fix}
              </p>
              <p>
                <b>Notes:</b> {c.notes}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Page>
  );
}
