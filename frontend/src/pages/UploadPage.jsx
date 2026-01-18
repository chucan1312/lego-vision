import { useState } from "react";
import { analyzeImage, matchBuilds } from "../api";

export default function UploadPage({ onDone }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setMsg("");

    try {
      const analysis = await analyzeImage(file);

      // Build inventory from detections (count labels)
      const inventory = {};
      for (const d of analysis.detections || []) {
        const label = d.label || "unknown";
        inventory[label] = (inventory[label] || 0) + 1;
      }

      const matched = await matchBuilds(inventory);

      onDone({
        imageUrl: analysis.imageUrl,
        detections: analysis.detections || [],
        matched,
      });
    } catch (e) {
      setMsg(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>Upload LEGO Pile</h2>

      <input
        type="file"
        accept="image/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <div style={{ marginTop: 10 }}>
        <button disabled={!file || loading} onClick={handleAnalyze}>
          {loading ? "Analyzing..." : "Analyze"}
        </button>
      </div>

      {msg && <p style={{ color: "red" }}>{msg}</p>}
    </div>
  );
}
