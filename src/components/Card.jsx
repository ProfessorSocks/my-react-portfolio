export default function Card({ title, meta, children }) {
  return (
    <div className="card">
      <div className="card-head">
        <h3>{title}</h3>
        {meta && <span className="card-meta">{meta}</span>}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}
