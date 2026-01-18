import { useState } from "react";
import { analyzeImage, matchBuilds } from "./api";

export default function UploadPage({ onResults }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleAnalyze() {
    if (!file) return;

    setLoading(true);
    setMsg("");

    try {
      const analysis = await analyzeImage(file);

      const inventory = analysis.inventory || {};
      const matched = await matchBuilds(inventory);

      // If backend doesn't return detections yet, use demo detections
      const detections =
        analysis.detections ||
        Object.entries(inventory).flatMap(([partId, count]) =>
          Array.from({ length: count }).map((_, i) => ({
            id: `${partId}_${i}`,
            predictedId: partId,
            correctedId: null,
          }))
        );

      onResults({
        ...matched,
        detections,
      });
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload LEGO Image</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <div style={{ marginTop: 10 }}>
        <button onClick={handleAnalyze} disabled={!file || loading}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {msg && <p style={{ color: "red" }}>{msg}</p>}
    </div>
  );
}
