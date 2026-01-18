import { useEffect, useMemo, useRef, useState } from "react";
import parts from "../../../data/labels/parts.json"; // adjust path if needed

export default function DetectViewPage({ imageUrl, detections, onBack }) {
  const imgRef = useRef(null);

  const [activeLabel, setActiveLabel] = useState(null);
  const [imgSize, setImgSize] = useState({
    naturalW: 1,
    naturalH: 1,
    displayW: 1,
    displayH: 1,
  });

  function updateSizes() {
    const img = imgRef.current;
    if (!img) return;

    setImgSize({
      naturalW: img.naturalWidth || 1,
      naturalH: img.naturalHeight || 1,
      displayW: img.clientWidth || 1,
      displayH: img.clientHeight || 1,
    });
  }

  useEffect(() => {
    window.addEventListener("resize", updateSizes);
    return () => window.removeEventListener("resize", updateSizes);
  }, []);

  const scale = useMemo(() => {
    return {
      sx: imgSize.displayW / imgSize.naturalW,
      sy: imgSize.displayH / imgSize.naturalH,
    };
  }, [imgSize]);

  // helper: convert id -> name
  function labelToName(label) {
    const key = String(label);
    return parts?.[key]?.name || key;
  }

  const counts = useMemo(() => {
    const map = {};
    for (const d of detections || []) {
      const label = String(d.label || "unknown");
      map[label] = (map[label] || 0) + 1;
    }
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [detections]);

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <button
          onClick={onBack}
          className="rounded-lg bg-white px-4 py-2 text-sm font-medium shadow hover:bg-gray-100"
        >
          ⬅ Back
        </button>

        <div className="text-sm text-gray-600">
          Total detections:{" "}
          <span className="font-semibold">{detections.length}</span>
        </div>
      </div>

      <h2 className="mb-4 text-xl font-bold">Detected Pieces</h2>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[280px_1fr]">
        {/* Sidebar */}
        <div className="rounded-xl bg-white p-3 shadow">
          <button
            onClick={() => setActiveLabel(null)}
            className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
              activeLabel === null
                ? "bg-gray-900 text-white"
                : "bg-gray-100 hover:bg-gray-200"
            }`}
          >
            Show All ({detections.length})
          </button>

          <div className="mt-3 max-h-[70vh] space-y-2 overflow-auto pr-1">
            {counts.map(([label, count]) => (
              <button
                key={label}
                onClick={() => setActiveLabel(label)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm transition ${
                  activeLabel === label
                    ? "bg-blue-600 text-white"
                    : "bg-white hover:bg-gray-100"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold">
                    {labelToName(label)}
                    <span className="ml-2 text-xs opacity-70">({label})</span>
                  </span>

                  <span className="rounded-full bg-gray-200 px-2 py-0.5 text-xs text-gray-700">
                    {count}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Image + overlay */}
        <div className="rounded-xl bg-white p-3 shadow">
          <div className="relative inline-block w-full">
            <img
              ref={imgRef}
              src={imageUrl}
              alt="uploaded"
              className="max-h-[80vh] w-auto max-w-full rounded-lg"
              onLoad={updateSizes}
            />

            {(detections || []).map((d) => {
              const isActive = !activeLabel || String(d.label) === String(activeLabel);

              const x = d.bbox.x * scale.sx;
              const y = d.bbox.y * scale.sy;
              const w = d.bbox.w * scale.sx;
              const h = d.bbox.h * scale.sy;

              return (
                <div
                  key={d.id}
                  className="absolute rounded-md border-2 border-red-500"
                  style={{
                    left: x,
                    top: y,
                    width: w,
                    height: h,
                    opacity: isActive ? 0.95 : 0.08,
                    transition: "opacity 180ms ease",
                    pointerEvents: "none",
                  }}
                  title={`${labelToName(d.label)} (${d.label})`}
                />
              );
            })}
          </div>

          <div className="mt-3 text-xs text-gray-500">
            Tip: click a piece type on the left to highlight only those boxes.
          </div>
        </div>
      </div>
    </div>
  );
}
