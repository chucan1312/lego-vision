import { useMemo, useState } from "react";
import { analyzeImage, matchBuilds } from "../api";

export default function UploadPage({ onDone }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const previewUrl = useMemo(() => {
    if (!file) return null;
    return URL.createObjectURL(file);
  }, [file]);

  async function handleAnalyze() {
    if (!file) return;
    setLoading(true);
    setMsg("");

    try {
      const analysis = await analyzeImage(file);

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

  function clearFile() {
    setFile(null);
    setMsg("");
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFD500]">
      {/* Subtle stud pattern */}
      <StudPattern />

      {/* Cute background decorations */}
      <Decorations />

      {/* HEADER */}
      <header className="relative z-10">
        <div className="mx-auto max-w-6xl px-6 pt-6">
          <div className="rounded-[28px] bg-white shadow-[0_12px_0_#e6b800] ring-2 ring-black/10">
            <div className="flex flex-col gap-4 px-5 py-1 sm:flex-row sm:items-center sm:justify-between">
              {/* Left brand */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  {/* NEW: Full logo image replaces the red L square */}
                  <img
                    src="/lego-vision-logo.png"
                    alt="LEGO Vision Logo"
                    className="h-30 w-auto select-none object-contain"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Right nav */}
              <div className="flex flex-wrap items-center gap-2">
                <NavPill text="Home" color="#00A3FF" />
                <NavPill text="How it works" color="#00C853" />
                <NavPill text="About" color="#E3000B" />
              </div>

            </div>

            {/* LEGO stripe under header */}
            <BrickStripe />

            {/* Fun mini studs row */}
            <div className="flex items-center justify-center gap-2 px-5 py-3">
              <MiniStud color="#E3000B" />
              <MiniStud color="#00A3FF" />
              <MiniStud color="#00C853" />
              <MiniStud color="#FF7A00" />
              <MiniStud color="#111827" />
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="relative z-10 mx-auto flex min-h-[calc(100vh-240px)] max-w-6xl items-center px-6 py-10">
        <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-2 lg:items-stretch">
          {/* LEFT HERO */}
          <section className="flex h-full flex-col justify-between rounded-3xl bg-white/75 p-6 shadow-[0_12px_0_#e6b800] ring-2 ring-black/10 backdrop-blur">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-[#FFF7CC] px-4 py-2 text-sm font-extrabold text-black ring-2 ring-black/10">
                  <span className="text-lg">🧱</span>
                  Build ideas from your pile!
                </div>

                {/* Cute “minifig badge” */}
                <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-extrabold text-black shadow-[0_6px_0_#eaeaea] ring-2 ring-black/10">
                  <span className="text-lg">🧑‍🚀</span>
                  Minifig Approved
                </div>
              </div>

              <h1 className="heading-font mt-4 text-4xl font-extrabold leading-tight text-black sm:text-5xl">
                Turn your LEGO pile into
                <span className="block text-[#E3000B]">buildable ideas.</span>
              </h1>

              <p className="mt-4 max-w-xl text-base font-semibold text-black/75 sm:text-lg">
                Upload a photo of your LEGO pieces and we’ll detect what you have —
                then suggest builds you can make right now.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <FeatureBrick color="#00A3FF" text="📸 1 photo" />
                <FeatureBrick color="#00C853" text="🧠 AI detection" />
                <FeatureBrick color="#E3000B" text="🎯 Build matches" />
              </div>

              {/* little playful callout */}
              <div className="mt-5 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-black shadow-[0_8px_0_#eaeaea] ring-2 ring-black/10">
                ⭐ Pro tip: spread pieces out like a “LEGO buffet” for best results!
              </div>
            </div>

            {/* Decorative mini bricks */}
            <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-6">
              {["#ff3b30", "#34c759", "#007aff", "#ff9500", "#af52de", "#111827"].map(
                (c, i) => (
                  <div
                    key={i}
                    className="relative h-12 rounded-2xl shadow-[0_7px_0_rgba(0,0,0,0.12)] transition hover:-translate-y-[2px] hover:shadow-[0_9px_0_rgba(0,0,0,0.14)]"
                    style={{ backgroundColor: c }}
                  >
                    <div className="absolute left-3 top-3 h-3 w-3 rounded-full bg-white/40" />
                    <div className="absolute right-3 top-3 h-3 w-3 rounded-full bg-white/40" />
                  </div>
                )
              )}
            </div>
          </section>

          {/* RIGHT UPLOAD */}
          <section className="flex h-full flex-col justify-between rounded-3xl bg-white p-6 shadow-[0_12px_0_#e6b800] ring-2 ring-black/10">
            <div>
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="heading-font text-2xl font-extrabold text-black">
                    Upload your LEGO pile
                  </h2>
                  <p className="mt-1 text-sm font-semibold text-black/60">
                    Bright lighting + flat surface = best results 🌞
                  </p>
                </div>

                <div className="rounded-2xl bg-[#E3000B] px-3 py-2 text-xs font-extrabold text-white shadow-[0_6px_0_#b30000] ring-2 ring-black/10">
                  NEW!
                </div>
              </div>

              {/* Upload box */}
              <div className="mt-5 rounded-3xl border-2 border-dashed border-black/25 bg-[#FFF7CC] p-5 transition hover:bg-[#FFF2A8]">
                <label className="block cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                  />

                  <div className="flex flex-col items-center justify-center gap-3 text-center">
                    <div className="grid h-14 w-14 place-items-center rounded-2xl bg-white shadow-[0_8px_0_#eaeaea] ring-2 ring-black/10 transition hover:rotate-[-2deg] hover:scale-[1.03]">
                      <span className="text-2xl">📷</span>
                    </div>

                    <div className="text-base font-extrabold text-black">
                      {file ? "Ready to scan! 😄" : "Click to choose a photo"}
                    </div>

                    <div className="text-sm font-semibold text-black/60">
                      {file ? (
                        <span className="inline-flex flex-wrap items-center justify-center gap-2">
                          <span className="rounded-full bg-black/10 px-3 py-1">
                            {file.name}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              clearFile();
                            }}
                            className="rounded-full bg-black px-3 py-1 text-xs font-extrabold text-white shadow-[0_5px_0_#000000] transition active:translate-y-[2px] active:shadow-[0_3px_0_#000000]"
                          >
                            Remove
                          </button>
                        </span>
                      ) : (
                        "PNG / JPG / HEIC supported"
                      )}
                    </div>
                  </div>
                </label>

                {/* Preview */}
                {previewUrl && (
                  <div className="mt-5 overflow-hidden rounded-3xl bg-white shadow-[0_10px_0_#eaeaea] ring-2 ring-black/10">
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="h-52 w-full object-cover"
                    />
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {loading && (
                <div className="mt-4 rounded-2xl bg-[#FFF7CC] p-3 ring-2 ring-black/10">
                  <div className="h-3 w-full overflow-hidden rounded-full bg-black/10">
                    <div className="h-full w-2/3 animate-pulse rounded-full bg-[#E3000B]" />
                  </div>
                  <div className="mt-2 text-xs font-bold text-black/60">
                    Scanning pieces… matching builds… almost there!
                  </div>
                </div>
              )}
            </div>

            {/* Action row */}
            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button
                disabled={!file || loading}
                onClick={handleAnalyze}
                className={`w-full rounded-2xl px-5 py-4 text-base font-extrabold shadow-[0_10px_0_#000000] transition active:translate-y-[3px] active:shadow-[0_7px_0_#000000] sm:w-auto ${!file || loading
                  ? "cursor-not-allowed bg-black/40 text-white/80"
                  : "bg-black text-white hover:scale-[1.02] hover:-translate-y-[1px]"
                  }`}
              >
                {loading ? (
                  <span className="inline-flex items-center gap-3">
                    <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Scanning...
                  </span>
                ) : (
                  "Scan my LEGO!"
                )}
              </button>

              <div className="text-sm font-semibold text-black/60">
                Tip: spread pieces out for better detection 🧱
              </div>
            </div>

            {/* Error */}
            {msg && (
              <div className="mt-4 rounded-2xl border-2 border-[#E3000B] bg-red-50 p-4">
                <div className="heading-font text-lg font-extrabold text-[#E3000B]">
                  Oops!
                </div>
                <div className="mt-1 text-sm font-semibold text-[#E3000B]/80">
                  {msg}
                </div>
              </div>
            )}
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 mt-auto">
        <div className="mx-auto max-w-6xl px-6 pb-10">
          <div className="rounded-[28px] bg-white shadow-[0_12px_0_#e6b800] ring-2 ring-black/10">
            <div className="px-6 py-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="heading-font text-lg font-extrabold text-black">
                    LEGO Vision 🧱✨
                  </div>
                  <div className="text-sm font-semibold text-black/60">
                    Built for fun. Built for building.
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <FooterPill text="Made with ❤️" />
                  <FooterPill text="React + Tailwind" />
                  <FooterPill text="Computer Vision" />
                </div>
              </div>

              {/* footer links */}
              <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-extrabold text-black/70">
                <button className="rounded-full bg-[#FFF7CC] px-4 py-2 shadow-[0_6px_0_#eaeaea] ring-2 ring-black/10 transition hover:-translate-y-[1px]">
                  FAQ
                </button>
                <button className="rounded-full bg-[#FFF7CC] px-4 py-2 shadow-[0_6px_0_#eaeaea] ring-2 ring-black/10 transition hover:-translate-y-[1px]">
                  Contact
                </button>
                <button className="rounded-full bg-[#FFF7CC] px-4 py-2 shadow-[0_6px_0_#eaeaea] ring-2 ring-black/10 transition hover:-translate-y-[1px]">
                  Credits
                </button>
              </div>
            </div>

            <BrickStripe />
          </div>

          <div className="mt-4 text-center text-xs font-bold text-black/50">
            © {new Date().getFullYear()} LEGO Vision • Not affiliated with LEGO
            Group
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ----------------- UI Pieces ----------------- */

function NavPill({ text, color = "#ff00d0" }) {
  return (
    <button
      type="button"
      className="relative rounded-2xl px-6 py-3 text-sm font-extrabold text-white
                 shadow-[0_10px_0_rgba(0,0,0,0.25)] ring-2 ring-black/10
                 transition hover:-translate-y-[1px] hover:shadow-[0_12px_0_rgba(0,0,0,0.22)]
                 active:translate-y-[2px] active:shadow-[0_7px_0_rgba(0,0,0,0.25)]"
      style={{ backgroundColor: color }}
    >
      {/* studs */}
      <span className="absolute left-4 top-2 h-3 w-3 rounded-full bg-white/35 ring-1 ring-black/10" />
      <span className="absolute right-4 top-2 h-3 w-3 rounded-full bg-white/35 ring-1 ring-black/10" />

      {text}
    </button>
  );
}


function FooterPill({ text }) {
  return (
    <span className="rounded-2xl bg-[#FFF7CC] px-4 py-2 text-xs font-extrabold text-black shadow-[0_6px_0_#eaeaea] ring-2 ring-black/10">
      {text}
    </span>
  );
}

function FeatureBrick({ color, text }) {
  return (
    <div
      className="relative rounded-2xl px-4 py-3 text-sm font-extrabold text-white shadow-[0_8px_0_rgba(0,0,0,0.18)] ring-2 ring-black/10 transition hover:-translate-y-[1px]"
      style={{ backgroundColor: color }}
    >
      <div className="absolute left-3 top-2 h-2 w-2 rounded-full bg-white/35" />
      <div className="absolute right-3 top-2 h-2 w-2 rounded-full bg-white/35" />
      {text}
    </div>
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

/* ----------------- Decorations (UPDATED) ----------------- */

function StudBrick({ className = "", color = "#111827", cols = 3, rows = 2 }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-[26px] ring-2 ring-black/10 shadow-[0_14px_0_rgba(0,0,0,0.18)] ${className}`}
      style={{ backgroundColor: color }}
    >
      {/* top highlight strip */}
      <div className="absolute left-3 right-3 top-1.5 h-2 rounded-full bg-white/15" />

      {/* aligned studs grid (2 rows) */}
      <div
        className="absolute left-1/2 top-4 -translate-x-1/2"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${cols}, 16px)`,
          gridTemplateRows: `repeat(${rows}, 16px)`,
          columnGap: "10px",
          rowGap: "10px",
        }}
      >
        {Array.from({ length: cols * rows }).map((_, i) => (
          <span
            key={i}
            className="h-4 w-4 rounded-full bg-white/35 ring-1 ring-black/10"
          />
        ))}
      </div>
    </div>
  );
}

function Decorations() {
  return (
    <>
      {/* Floating studs */}
      <div className="pointer-events-none absolute left-6 top-28 h-4 w-4 animate-[floaty_3.2s_ease-in-out_infinite] rounded-full bg-white/60 ring-2 ring-black/10" />
      <div className="pointer-events-none absolute left-16 top-44 h-3 w-3 animate-[floaty_2.7s_ease-in-out_infinite] rounded-full bg-white/50 ring-2 ring-black/10" />
      <div className="pointer-events-none absolute right-10 top-36 h-4 w-4 animate-[floaty_3.4s_ease-in-out_infinite] rounded-full bg-white/60 ring-2 ring-black/10" />
      <div className="pointer-events-none absolute right-24 top-56 h-3 w-3 animate-[floaty_2.9s_ease-in-out_infinite] rounded-full bg-white/50 ring-2 ring-black/10" />

      {/* Existing side bricks (kept) */}
      <StudBrick
        color="#00A3FF"
        className="-left-14 top-40 h-28 w-44 rotate-[-8deg]"
      />
      <StudBrick
        color="#00ff80"
        className="-right-14 top-40 h-28 w-44 rotate-[20deg]"
      />
      <StudBrick
        color="#FF7A00"
        className="-left-10 top-[52%] h-24 w-36 rotate-[10deg]"
      />
      <StudBrick
        color="#00C853"
        className="-right-14 top-[46%] h-24 w-40 rotate-[8deg]"
      />
      <StudBrick
        color="#E3000B"
        className="-right-12 bottom-24 h-24 w-40 rotate-[-10deg]"
      />
      <StudBrick
        color="#5300e3"
        className="-left-12 bottom-24 h-24 w-40 rotate-[-10deg]"
      />

      {/* NEW: more bricks at the END of the page (bottom/footer area) */}
      {/* (left empty because you said you will add later) */}
    </>
  );
}
