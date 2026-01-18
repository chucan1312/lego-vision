import { useState } from "react";
import UploadPage from "./pages/UploadPage";
import ResultsPage from "./pages/ResultsPage";
import DetectViewPage from "./pages/DetectViewPage";
import InstructionsPage from "./pages/InstructionsPage";

export default function App() {
  const [imageUrl, setImageUrl] = useState("");
  const [detections, setDetections] = useState([]);
  const [top10, setTop10] = useState([]);
  const [selectedBuild, setSelectedBuild] = useState(null);

  // Page routing (simple state-based)
  const [page, setPage] = useState("upload"); 
  // upload -> results -> detectview -> instructions

  function resetAll() {
    setImageUrl("");
    setDetections([]);
    setTop10([]);
    setSelectedBuild(null);
    setPage("upload");
  }

  if (page === "upload") {
    return (
      <UploadPage
        onDone={({ imageUrl, detections, matched }) => {
          setImageUrl(imageUrl);
          setDetections(detections);
          setTop10(matched.top10 || []);
          setPage("results");
        }}
      />
    );
  }

  if (page === "results") {
    return (
      <ResultsPage
        top10={top10}
        onReset={resetAll}
        onViewDetections={() => setPage("detectview")}
        onSelectBuild={(b) => {
          setSelectedBuild(b);
          setPage("instructions");
        }}
      />
    );
  }

  if (page === "detectview") {
    return (
      <DetectViewPage
        imageUrl={imageUrl}
        detections={detections}
        onBack={() => setPage("results")}
      />
    );
  }

  if (page === "instructions") {
    return (
      <InstructionsPage
        build={selectedBuild}
        onBack={() => setPage("results")}
      />
    );
  }

  return null;
}
