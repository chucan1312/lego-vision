export default function ResultsPage({
    top10,
    onSelectBuild,
    onReset,
    onOpenCorrection,
  }) {
    return (
      <div style={{ padding: 20 }}>
        <h2>Top 10 Builds</h2>
  
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onReset}>Start Over</button>
          <button onClick={onOpenCorrection}>Correct Pieces</button>
        </div>
  
        <div style={{ marginTop: 20 }}>
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
  
              {b.missing?.length > 0 && (
                <p style={{ margin: 0 }}>
                  Missing:{" "}
                  {b.missing.map((m) => `${m.count}x ${m.name}`).join(", ")}
                </p>
              )}
  
              {b.missing?.length === 0 && (
                <p style={{ margin: 0, color: "green" }}>Buildable ✅</p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
  