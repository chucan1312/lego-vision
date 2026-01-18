import { useState } from "react";
import UploadPage from "./UploadPage";
import ResultsPage from "./ResultsPage";

export default function App() {
  const [top10, setTop10] = useState([]);
  const [selectedBuild, setSelectedBuild] = useState(null);

  if (selectedBuild) {
    return (
      <div style={{ padding: 20 }}>
        <button onClick={() => setSelectedBuild(null)}>⬅ Back</button>
        <h2>{selectedBuild.name}</h2>

        <div style={{ marginTop: 10 }}>
          {(selectedBuild.steps || []).map((s, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
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

  if (top10.length > 0) {
    return (
      <ResultsPage
        top10={top10}
        onSelectBuild={(b) => setSelectedBuild(b)}
        onReset={() => setTop10([])}
      />
    );
  }

  return <UploadPage onResults={(data) => setTop10(data.top10 || [])} />;
}
