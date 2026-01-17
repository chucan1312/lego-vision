import { useEffect, useState } from "react";

export default function App() {
  const [backendStatus, setBackendStatus] = useState("Checking...");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // Test FastAPI health endpoint
  useEffect(() => {
    fetch("http://localhost:8000/api/health")
      .then((res) => res.json())
      .then((data) => setBackendStatus(data.status || "ok"))
      .catch(() => setBackendStatus("Backend not reachable ❌"));
  }, []);

  const handleFileChange = (e) => {
    setError(null);
    setUploadResult(null);
    setSelectedFile(e.target.files?.[0] || null);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select an image first.");
      return;
    }

    setLoading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await fetch("http://localhost:8000/api/analyze-image", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Upload failed: ${res.status}`);
      }

      const data = await res.json();
      setUploadResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "Arial" }}>
      <h1>🧱 LEGO Vision Demo</h1>

      <div style={{ padding: 16, border: "1px solid #ddd", borderRadius: 8 }}>
        <h2>Backend Status</h2>
        <p>
          FastAPI: <b>{backendStatus}</b>
        </p>
      </div>

      <div
        style={{
          marginTop: 20,
          padding: 16,
          border: "1px solid #ddd",
          borderRadius: 8,
        }}
      >
        <h2>Upload LEGO Pile Image</h2>

        <input type="file" accept="image/*" onChange={handleFileChange} />

        <div style={{ marginTop: 12 }}>
          <button onClick={handleUpload} disabled={loading}>
            {loading ? "Uploading..." : "Upload & Analyze"}
          </button>
        </div>

        {selectedFile && (
          <p style={{ marginTop: 10 }}>
            Selected: <b>{selectedFile.name}</b>
          </p>
        )}

        {error && (
          <p style={{ marginTop: 10, color: "red" }}>
            ❌ Error: {error}
          </p>
        )}

        {uploadResult && (
          <div style={{ marginTop: 16 }}>
            <h3>Result</h3>
            <pre
              style={{
                background: "#f6f6f6",
                padding: 12,
                borderRadius: 8,
                overflowX: "auto",
              }}
            >
              {JSON.stringify(uploadResult, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
}
