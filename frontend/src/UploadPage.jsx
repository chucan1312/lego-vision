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
      // analyze-image should return something like:
      // { inventory: { "3001": 2, "3003": 4 } }
      const analysis = await analyzeImage(file);

      const inventory = analysis.inventory || {};
      const matched = await matchBuilds(inventory);

      onResults(matched);
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
