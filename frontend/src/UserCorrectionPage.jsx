import { useState } from "react";
import { applyCorrections } from "./api";

export default function UserCorrectionPage({ detections, onDone, onBack }) {
  const [items, setItems] = useState(detections || []);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  function updateCorrected(id, newValue) {
    setItems((prev) =>
      prev.map((d) =>
        d.id === id ? { ...d, correctedId: newValue || null } : d
      )
    );
  }

  async function handleSubmit() {
    setLoading(true);
    setMsg("");

    try {
      const result = await applyCorrections(items);
      onDone(result); // result includes {inventory, top10}
    } catch (err) {
      setMsg(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>User Correction</h2>
      <button onClick={onBack}>⬅ Back</button>

      <p style={{ marginTop: 10 }}>
        Edit wrong piece IDs and submit to recalculate completion.
      </p>

      {items.map((d) => (
        <div
          key={d.id}
          style={{
            border: "1px solid #ddd",
            padding: 10,
            marginBottom: 8,
          }}
        >
          <div>
            <b>Detection:</b> {d.id}
          </div>
          <div>
            <b>Predicted:</b> {d.predictedId}
          </div>

          <div style={{ marginTop: 6 }}>
            <label>
              Corrected ID:{" "}
              <input
                placeholder="leave blank if correct"
                value={d.correctedId || ""}
                onChange={(e) => updateCorrected(d.id, e.target.value)}
              />
            </label>
          </div>
        </div>
      ))}

      <button onClick={handleSubmit} disabled={loading} style={{ marginTop: 10 }}>
        {loading ? "Submitting..." : "Submit Corrections"}
      </button>

      {msg && <p style={{ color: "red" }}>{msg}</p>}
    </div>
  );
}
