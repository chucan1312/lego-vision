import { useMemo, useState } from "react";

export default function DetectViewPage({ imageUrl, detections, onBack }) {
  const [activeLabel, setActiveLabel] = useState(null);

  // Count labels for sidebar
  const counts = useMemo(() => {
    const map = {};
    for (const d of detections || []) {
      const label = d.label || "unknown";
      map[label] = (map[label] || 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [detections]);

  return (
    <div style={{ padding: 20 }}>
      <button onClick={onBack}>⬅ Back</button>
      <h2 style={{ marginTop: 10 }}>Detected Pieces</h2>

      <div style={{ display: "flex", gap: 20, marginTop: 10 }}>
        {/* LEFT: sidebar */}
        <div style={{ width: 260 }}>
          <button onClick={() => setActiveLabel(null)}>
            Show All ({detections.length})
          </button>

          <div style={{ marginTop: 10 }}>
            {counts.map(([label, count]) => (
              <div
                key={label}
                onClick={() => setActiveLabel(label)}
                style={{
                  padding: 10,
                  marginBottom: 8,
                  border: "1px solid #ddd",
                  cursor: "pointer",
                  background: activeLabel === label ? "#f2f2f2" : "white",
                }}
              >
                <b>{label}</b> : {count}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: image + overlay */}
        <div style={{ position: "relative", flex: 1 }}>
          <img
            src={imageUrl}
            alt="uploaded"
            style={{ width: "100%", display: "block" }}
          />

          {(detections || []).map((d) => {
            const isActive = !activeLabel || d.label === activeLabel;

            return (
              <div
                key={d.id}
                title={`${d.label} (${d.confidence})`}
                style={{
                  position: "absolute",
                  left: d.bbox.x,
                  top: d.bbox.y,
                  width: d.bbox.w,
                  height: d.bbox.h,
                  border: "2px solid red",
                  opacity: isActive ? 1 : 0.1, // fade effect
                  transition: "opacity 0.2s ease",
                  pointerEvents: "none",
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
