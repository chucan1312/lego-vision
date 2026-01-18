const API_BASE = "http://localhost:8000/api";

export async function analyzeImage(file) {
  const form = new FormData();
  form.append("file", file);

  const res = await fetch(`${API_BASE}/analyze-image`, {
    method: "POST",
    body: form,
  });

  if (!res.ok) throw new Error("Analyze failed");
  return res.json();
}

export async function matchBuilds(inventory) {
  const res = await fetch(`${API_BASE}/match-builds`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ inventory }),
  });

  if (!res.ok) throw new Error("Match builds failed");
  return res.json();
}
