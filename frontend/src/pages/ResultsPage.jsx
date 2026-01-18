export default function ResultsPage({
    top10,
    onReset,
    onViewDetections,
    onSelectBuild,
  }) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Top Builds</h2>
  
        <div style={{ display: "flex", gap: 10, marginBottom: 15 }}>
          <button onClick={onReset}>Start Over</button>
          <button onClick={onViewDetections}>View Detected Pieces</button>
        </div>
  
        {top10.length === 0 && <p>No builds found.</p>}
  
        <div style={{ marginTop: 10 }}>
          {top10.map((b) => (
            <div
              key={b.id}
              style={{
                border: "1px solid #ddd",
                padding: 12,
                marginBottom: 10,
                cursor: "pointer",
              }}
              onClick={() => onSelectBuild(b)}
            >
              <h3 style={{ margin: 0 }}>{b.name}</h3>
              <p style={{ margin: "6px 0" }}>
                Completion: <b>{b.completionPercent}%</b>
              </p>
  
              {b.missing?.length > 0 ? (
                <p style={{ margin: 0 }}>
                  Missing:{" "}
                  {b.missing.map((m) => `${m.count}x ${m.name}`).join(", ")}
                </p>
              ) : (
                <p style={{ margin: 0, color: "green" }}>Buildable ✅</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  