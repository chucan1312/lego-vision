export default function InstructionsPage({ build, onBack }) {
    if (!build) return null;
  
    return (
      <div style={{ padding: 20 }}>
        <button onClick={onBack}>⬅ Back</button>
        <h2 style={{ marginTop: 10 }}>{build.name}</h2>
  
        <p>
          Completion: <b>{build.completionPercent}%</b>
        </p>
  
        <div style={{ marginTop: 10 }}>
          {(build.steps || []).map((s, i) => (
            <div key={i} style={{ marginBottom: 15 }}>
              <div style={{ marginBottom: 6 }}>Step {i + 1}</div>
              <img
                src={`http://localhost:8000/static/${s}`}
                alt={`step-${i}`}
                style={{ maxWidth: "100%", border: "1px solid #ccc" }}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }
  