import { useMemo, useState } from "react";

export default function InstructionsPage({ build, onBack }) {
  const steps = build?.steps || [];
  const totalSteps = steps.length;

  // NEW: start with no step selected
  const [activeStep, setActiveStep] = useState(null);

  const stepSrc = useMemo(() => {
    if (activeStep === null) return null;
    const s = steps[activeStep];
    if (!s) return null;
    return `http://localhost:8000/static/${s}`;
  }, [steps, activeStep]);

  if (!build) return null;

  const currentStepNumber = activeStep === null ? 0 : activeStep + 1;

  // NEW: progress stays 0% until a step is selected
  const progressPercent =
    activeStep === null || totalSteps === 0
      ? 0
      : Math.round((currentStepNumber / totalSteps) * 100);

  function goPrev() {
    if (totalSteps === 0) return;
    if (activeStep === null) return; // nothing selected yet
    setActiveStep((s) => Math.max(0, s - 1));
  }

  function goNext() {
    if (totalSteps === 0) return;

    // NEW: if user hasn't selected a step yet, Next starts at step 1
    if (activeStep === null) {
      setActiveStep(0);
      return;
    }

    setActiveStep((s) => Math.min(totalSteps - 1, s + 1));
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#FFD500]">
      {/* Background */}
      <StudPattern />
      <Decorations />

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        {/* TOP HEADER CARD */}
        <div className="rounded-3xl bg-white shadow-[0_12px_0_#e6b800] ring-2 ring-black/10">
          <div className="px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="heading-font text-3xl font-extrabold text-black">
                  {build.name}
                </h1>
                <p className="mt-1 text-sm font-semibold text-black/60">
                  Follow the steps and build it brick-by-brick 🧱✨
                </p>
              </div>

              <button
                onClick={onBack}
                className="rounded-2xl bg-[#111827] px-5 py-3 text-sm font-extrabold text-white ring-2 ring-black/10 transition active:translate-y-[2px]"
              >
                ⬅ Back
              </button>
            </div>

            {/* Functional progress */}
            <div className="mt-4 rounded-2xl bg-[#FFF7CC] px-4 py-3 text-sm font-extrabold text-black ring-2 ring-black/10">
              <div className="flex items-center justify-between">
                <span>
                  Completion:{" "}
                  <span className="text-[#E3000B]">{progressPercent}%</span>
                </span>

                <span className="text-xs font-bold text-black/60">
                  {currentStepNumber} / {totalSteps || 0}
                </span>
              </div>

              <div className="mt-2 h-3 w-full overflow-hidden rounded-full bg-black/10">
                <div
                  className="h-full rounded-full bg-[#E3000B] transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          </div>

          <BrickStripe />
        </div>

        {/* BODY GRID */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[320px_1fr]">
          {/* LEFT: STEPS LIST (NO SHADOW) */}
          <div className="rounded-3xl bg-white ring-2 ring-black/10">
            <div className="px-5 py-5">
              <div className="flex items-center justify-between">
                <div className="heading-font text-xl font-extrabold text-black">
                  Steps
                </div>
                <div className="text-xs font-bold text-black/60">
                  {currentStepNumber} / {totalSteps || 0}
                </div>
              </div>

              <div className="mt-4 max-h-[70vh] space-y-2 overflow-auto pr-1">
                {steps.map((_, i) => {
                  const isActive = activeStep === i;

                  return (
                    <button
                      key={i}
                      onClick={() => setActiveStep(i)}
                      className={`w-full rounded-2xl px-4 py-3 text-left text-sm font-extrabold ring-2 ring-black/10 transition ${isActive
                        ? "bg-[#00A3FF] text-white"
                        : "bg-[#FFF7CC] text-black hover:-translate-y-[1px]"
                        }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>Step {i + 1}</span>

                        {isActive && (
                          <span className="rounded-full bg-white/25 px-3 py-1 text-[11px] font-extrabold">
                            You’re here ⭐
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* bottom studs */}
              <div className="mt-4 flex gap-2">
                <MiniStud color="#E3000B" />
                <MiniStud color="#00A3FF" />
                <MiniStud color="#00C853" />
                <MiniStud color="#FF7A00" />
              </div>
            </div>
          </div>

          {/* RIGHT: STEP VIEW */}
          <div className="rounded-3xl bg-white shadow-[0_12px_0_#e6b800] ring-2 ring-black/10">
            <div className="px-6 py-5">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="heading-font text-2xl font-extrabold text-black">
                    {activeStep === null ? "Starting Step" : `Step ${activeStep + 1}`}
                  </div>
                  <div className="text-sm font-semibold text-black/60">
                    {activeStep === null
                      ? "Pick a step to begin ✨"
                      : "Follow the picture — you got this 💪"}
                  </div>
                </div>

                {/* Prev / Next (NO SHADOW) */}
                <div className="flex gap-2">
                  <button
                    onClick={goPrev}
                    disabled={activeStep === null || activeStep === 0}
                    className={`rounded-2xl px-5 py-3 text-sm font-extrabold text-white ring-2 ring-black/10 transition active:translate-y-[2px] ${activeStep === null || activeStep === 0
                      ? "cursor-not-allowed bg-black/30"
                      : "bg-[#FF7A00]"
                      }`}
                  >
                    ⬅ Prev
                  </button>

                  <button
                    onClick={goNext}
                    disabled={totalSteps === 0}
                    className={`rounded-2xl px-5 py-3 text-sm font-extrabold text-white ring-2 ring-black/10 transition active:translate-y-[2px] ${totalSteps === 0 ? "cursor-not-allowed bg-black/30" : "bg-[#00C853]"
                      }`}
                  >
                    Next ➡
                  </button>
                </div>
              </div>

              {/* Step image */}
              <div className="mt-5 rounded-3xl bg-[#FFF7CC] p-4 ring-2 ring-black/10">
                <div className="overflow-hidden rounded-3xl bg-white shadow-[0_10px_0_#eaeaea] ring-2 ring-black/10">
                  {activeStep === null ? (
                    <div className="grid h-[420px] place-items-center text-center">
                      <div>
                        <div className="text-5xl">👆</div>
                        <div className="mt-3 text-lg font-extrabold text-black">
                          Choose a step to start!
                        </div>
                        <div className="mt-1 text-sm font-semibold text-black/60">
                          Click a step on the left — or press Next.
                        </div>
                      </div>
                    </div>
                  ) : stepSrc ? (
                    <img
                      src={stepSrc}
                      alt={`step-${activeStep}`}
                      className="max-h-[62vh] w-full object-contain"
                    />
                  ) : (
                    <div className="grid h-[420px] place-items-center text-center">
                      <div>
                        <div className="text-5xl">🧩</div>
                        <div className="mt-3 text-lg font-extrabold text-black">
                          Step image missing
                        </div>
                        <div className="mt-1 text-sm font-semibold text-black/60">
                          This step doesn’t have an image.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Tip */}
              <div className="mt-4 rounded-2xl bg-white px-4 py-3 text-sm font-extrabold text-black shadow-[0_8px_0_#eaeaea] ring-2 ring-black/10">
                ⭐ Tip: If a piece looks missing, check your pile again — it might
                be hiding!
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ----------------- Shared UI bits ----------------- */

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

function StudBrick({ className = "", color = "#111827", cols = 3, rows = 2 }) {
  return (
    <div
      className={`pointer-events-none absolute rounded-[26px] ring-2 ring-black/10 shadow-[0_14px_0_rgba(0,0,0,0.18)] ${className}`}
      style={{ backgroundColor: color }}
    >
      <div className="absolute left-3 right-3 top-1.5 h-2 rounded-full bg-white/15" />

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

      {/* Side bricks */}
      <StudBrick
        color="#00A3FF"
        className="-left-14 top-40 h-28 w-44 rotate-[-8deg]"
      />
      <StudBrick
        color="#00C853"
        className="-right-14 top-[46%] h-24 w-40 rotate-[8deg]"
      />
      <StudBrick
        color="#E3000B"
        className="-right-12 bottom-24 h-24 w-40 rotate-[-10deg]"
      />
    </>
  );
}
