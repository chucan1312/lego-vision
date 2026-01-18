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

  const total = detections?.length || 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFD500]">
      {/* background */}
      <StudPattern />
      <Decorations />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {/* HEADER CARD */}
        <div className="mb-6 rounded-3xl bg-white shadow-[0_12px_0_#e6b800] ring-2 ring-black/10">
          <div className="px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="heading-font text-3xl font-extrabold text-black">
                  Detected Pieces 🔍🧱
                </h1>
                <p className="mt-1 text-sm font-semibold text-black/60">
                  Click a piece type to highlight only those boxes
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <ActionButton
                  color="#111827"
                  text="⬅ Back"
                  onClick={onBack}
                />
                <div className="rounded-2xl bg-[#FFF7CC] px-4 py-3 text-sm font-extrabold text-black ring-2 ring-black/10">
                  Total detections:{" "}
                  <span className="text-[#E3000B]">{total}</span>
                </div>
              </div>
            </div>
          </div>

          <BrickStripe />
        </div>

        {/* MAIN GRID */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* SIDEBAR */}
          <aside className="rounded-3xl bg-white p-4 shadow-[0_12px_0_#e6b800] ring-2 ring-black/10">
            <div className="mb-3 flex items-center justify-between">
              <div className="heading-font text-lg font-extrabold text-black">
                Piece Types
              </div>

              <div className="flex gap-2">
                <MiniStud color="#E3000B" />
                <MiniStud color="#00A3FF" />
                <MiniStud color="#00C853" />
              </div>
            </div>

            {/* Show All */}
            <button
              onClick={() => setActiveLabel(null)}
              type="button"
              className={`relative w-full rounded-2xl px-4 py-3 text-left text-sm font-extrabold shadow-[0_10px_0_rgba(0,0,0,0.18)] ring-2 ring-black/10 transition active:translate-y-[2px] active:shadow-[0_7px_0_rgba(0,0,0,0.18)] ${activeLabel === null
                  ? "bg-[#111827] text-white"
                  : "bg-[#FFF7CC] text-black hover:-translate-y-[1px]"
                }`}
            >
              <span className="absolute left-4 top-2 h-3 w-3 rounded-full bg-white/35 ring-1 ring-black/10" />
              <span className="absolute right-4 top-2 h-3 w-3 rounded-full bg-white/35 ring-1 ring-black/10" />

              Show All{" "}
              <span className="ml-2 text-xs font-black opacity-80">
                ({total})
              </span>
            </button>

            {/* list */}
            <div className="mt-4 max-h-[68vh] space-y-2 overflow-auto pr-1">
              {counts.map(([label, count], idx) => {
                const isActive = activeLabel === label;

                // fun rotating colors for pills
                const colors = ["#00A3FF", "#00C853", "#E3000B", "#FF7A00", "#AF52DE"];
                const c = colors[idx % colors.length];

                return (
                  <button
                    key={label}
                    onClick={() => setActiveLabel(label)}
                    type="button"
                    className={`relative w-full rounded-2xl px-4 py-3 text-left text-sm font-extrabold ring-2 ring-black/10 transition active:translate-y-[2px] ${isActive
                        ? "text-white shadow-[0_10px_0_rgba(0,0,0,0.25)]"
                        : "bg-white text-black shadow-[0_8px_0_rgba(0,0,0,0.12)] hover:-translate-y-[1px]"
                      }`}
                    style={{
                      backgroundColor: isActive ? c : "white",
                    }}
                  >
                    {/* studs */}
                    <span
                      className={`absolute left-4 top-2 h-3 w-3 rounded-full ring-1 ring-black/10 ${isActive ? "bg-white/35" : "bg-black/10"
                        }`}
                    />
                    <span
                      className={`absolute right-4 top-2 h-3 w-3 rounded-full ring-1 ring-black/10 ${isActive ? "bg-white/35" : "bg-black/10"
                        }`}
                    />

                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="truncate">
                          {labelToName(label)}
                        </div>
                        <div
                          className={`mt-1 text-xs font-bold ${isActive ? "text-white/80" : "text-black/40"
                            }`}
                        >
                          ID: {label}
                        </div>
                      </div>

                      <span
                        className={`shrink-0 rounded-full px-2 py-1 text-xs font-black ring-2 ring-black/10 ${isActive
                            ? "bg-white/20 text-white"
                            : "bg-[#FFF7CC] text-black"
                          }`}
                      >
                        {count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 rounded-2xl bg-[#FFF7CC] px-4 py-3 text-xs font-extrabold text-black ring-2 ring-black/10">
              ⭐ Tip: pick a piece type to spotlight only those boxes!
            </div>
          </aside>

          {/* IMAGE VIEW */}
          <section className="rounded-3xl bg-white p-4 shadow-[0_12px_0_#e6b800] ring-2 ring-black/10">
            <div className="mb-3 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <div className="heading-font text-lg font-extrabold text-black">
                  Your Uploaded Photo 📸
                </div>
                <div className="text-sm font-semibold text-black/60">
                  Boxes are drawn on detected LEGO pieces
                </div>
              </div>

              <div className="flex items-center gap-2">
                <MiniStud color="#E3000B" />
                <MiniStud color="#00A3FF" />
                <MiniStud color="#00C853" />
                <MiniStud color="#FF7A00" />
                <MiniStud color="#111827" />
              </div>
            </div>

            <div className="rounded-3xl bg-[#FFF7CC] p-4 ring-2 ring-black/10">
              <div className="relative inline-block w-full overflow-hidden rounded-3xl bg-white shadow-[0_10px_0_#eaeaea] ring-2 ring-black/10">
                <img
                  ref={imgRef}
                  src={imageUrl}
                  alt="uploaded"
                  className="max-h-[78vh] w-auto max-w-full"
                  onLoad={updateSizes}
                />

                {(detections || []).map((d) => {
                  const isActive =
                    !activeLabel || String(d.label) === String(activeLabel);

                  const x = d.bbox.x * scale.sx;
                  const y = d.bbox.y * scale.sy;
                  const w = d.bbox.w * scale.sx;
                  const h = d.bbox.h * scale.sy;

                  return (
                    <div
                      key={d.id}
                      className="absolute rounded-md border-2 border-[#E3000B]"
                      style={{
                        left: x,
                        top: y,
                        width: w,
                        height: h,
                        opacity: isActive ? 0.95 : 0.08,
                        transition: "opacity 180ms ease",
                        pointerEvents: "none",
                        boxShadow: isActive
                          ? "0 0 0 2px rgba(255,255,255,0.55)"
                          : "none",
                      }}
                      title={`${labelToName(d.label)} (${d.label})`}
                    />
                  );
                })}
              </div>

              <div className="mt-3 text-xs font-bold text-black/55">
                Tip: click a piece type on the left to highlight only those boxes.
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

/* ----------------- Shared LEGO UI bits ----------------- */

function ActionButton({ text, color, onClick }) {
  return (
    <button
      onClick={onClick}
      type="button"
      className="relative rounded-2xl px-5 py-3 text-sm font-extrabold text-white
                 shadow-[0_10px_0_rgba(0,0,0,0.25)] ring-2 ring-black/10
                 transition hover:-translate-y-[1px] hover:shadow-[0_12px_0_rgba(0,0,0,0.22)]
                 active:translate-y-[2px] active:shadow-[0_7px_0_rgba(0,0,0,0.25)]"
      style={{ backgroundColor: color }}
    >
      <span className="absolute left-4 top-2 h-3 w-3 rounded-full bg-white/35 ring-1 ring-black/10" />
      <span className="absolute right-4 top-2 h-3 w-3 rounded-full bg-white/35 ring-1 ring-black/10" />
      {text}
    </button>
  );
}

function MiniStud({ color }) {
  return (
    <span
      className="h-3 w-3 rounded-full ring-2 ring-black/10"
      style={{ backgroundColor: color }}
    />
  );
}

function BrickStripe() {
  return (
    <div className="flex h-3 w-full overflow-hidden rounded-b-[28px]">
      <div className="w-1/3 bg-[#E3000B]" />
      <div className="w-1/3 bg-[#00A3FF]" />
      <div className="w-1/3 bg-[#00C853]" />
    </div>
  );
}

function StudPattern() {
  return (
    <div
      className="pointer-events-none absolute inset-0 opacity-[0.18]"
      style={{
        backgroundImage:
          "radial-gradient(circle at 10px 10px, rgba(255,255,255,0.75) 3px, transparent 4px)",
        backgroundSize: "34px 34px",
      }}
    />
  );
}

/* keep decorations simple like ResultsPage */
function Decorations() {
  return (
    <>
      <div className="pointer-events-none absolute left-10 top-32 h-4 w-4 rounded-full bg-white/60 ring-2 ring-black/10" />
      <div className="pointer-events-none absolute right-12 top-44 h-3 w-3 rounded-full bg-white/50 ring-2 ring-black/10" />
    </>
  );
}
