### Case Log Storage Architecture

Case logs are stored in browser localStorage under the key `case_logs` as JSON.
The Admin panel writes structured incident records (title, environment, symptoms,
root cause, fix, notes, date) to localStorage.

The public Case Logs page reads the same data and renders it in a read-only
incident report format.

This simulates a real IT ticketing system architecture:
Admin UI → Persistent Storage → Public Knowledge Base

Current storage: localStorage (client-side)
Future upgrade path: Cloud database with authenticated API
