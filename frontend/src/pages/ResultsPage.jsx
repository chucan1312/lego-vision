export default function ResultsPage({
  top10,
  onReset,
  onViewDetections,
  onSelectBuild,
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFD500]">
      {/* background pattern */}
      <StudPattern />
      <Decorations />

      {/* MAIN */}
      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {/* Header card */}
        <div className="mb-6 rounded-3xl bg-white shadow-[0_12px_0_#e6b800] ring-2 ring-black/10">
          <div className="px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="heading-font text-3xl font-extrabold text-black">
                  Top Build Matches 🧱
                </h1>
                <p className="mt-1 text-sm font-semibold text-black/60">
                  Based on the LEGO pieces we detected
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <ActionButton
                  color="#111827"
                  text="Start Over"
                  onClick={onReset}
                />
                <ActionButton
                  color="#00A3FF"
                  text="View Detected Pieces"
                  onClick={onViewDetections}
                />
              </div>
            </div>
          </div>

          <BrickStripe />
        </div>

        {/* RESULTS */}
        {top10.length === 0 ? (
          <div className="rounded-3xl bg-white p-8 text-center shadow-[0_12px_0_#e6b800] ring-2 ring-black/10">
            <div className="text-5xl">😕</div>
            <h2 className="heading-font mt-4 text-2xl font-extrabold text-black">
              No builds found
            </h2>
            <p className="mt-2 text-sm font-semibold text-black/60">
              Try another photo with more visible pieces
            </p>
          </div>
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {top10.map((b) => {
              const buildable = !b.missing || b.missing.length === 0;

              return (
                <div
                  key={b.id}
                  onClick={() => onSelectBuild(b)}
                  className="cursor-pointer rounded-3xl bg-white p-5 shadow-[0_12px_0_#e6b800] ring-2 ring-black/10 transition hover:-translate-y-[2px] hover:shadow-[0_14px_0_#e6b800]"
                >
                  {/* title */}
                  <h3 className="heading-font text-xl font-extrabold text-black">
                    {b.name}
                  </h3>

                  {/* completion */}
                  <div className="mt-2 rounded-2xl bg-[#FFF7CC] px-4 py-2 text-sm font-extrabold text-black ring-2 ring-black/10">
                    Completion:{" "}
                    <span className="text-[#E3000B]">
                      {b.completionPercent}%
                    </span>
                  </div>

                  {/* status */}
                  <div className="mt-3">
                    {buildable ? (
                      <div className="rounded-2xl bg-green-100 px-4 py-2 text-sm font-extrabold text-green-700 ring-2 ring-green-300">
                        Buildable ✅
                      </div>
                    ) : (
                      <div className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-extrabold text-red-700 ring-2 ring-red-300">
                        Missing:
                        <ul className="mt-2 list-disc space-y-1 pl-5 text-xs font-semibold text-red-700/90">
                          {b.missing.map((m, idx) => (
                            <li key={idx}>
                              {m.count}× {m.name}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* studs decoration */}
                  <div className="mt-4 flex gap-2">
                    <MiniStud color="#E3000B" />
                    <MiniStud color="#00A3FF" />
                    <MiniStud color="#00C853" />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

/* ----------------- Shared UI bits ----------------- */

function ActionButton({ text, color, onClick }) {
  return (
    <button
      onClick={onClick}
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

function Decorations() {
  return (
    <>
      <div className="pointer-events-none absolute left-10 top-32 h-4 w-4 rounded-full bg-white/60 ring-2 ring-black/10" />
      <div className="pointer-events-none absolute right-12 top-44 h-3 w-3 rounded-full bg-white/50 ring-2 ring-black/10" />
    </>
  );
}
