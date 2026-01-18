const API_BASE = "http://localhost:8000";

export async function analyzeImage(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/api/analyze-image`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error("analyze-image failed");
  return res.json();
}

export async function matchBuilds(inventory) {
  const res = await fetch(`${API_BASE}/api/match-builds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inventory }),
  });

  if (!res.ok) throw new Error("match-builds failed");
  return res.json();
}

export function staticUrl(stepPath) {
  // stepPath example: "instructions_img/mini_car/step_01.png"
  return `${API_BASE}/static/${stepPath}`;
}
