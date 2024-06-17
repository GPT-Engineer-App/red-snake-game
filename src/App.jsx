import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import VideoEditor from "./pages/VideoEditor.jsx";
import PdfUpload from "./pages/PdfUpload.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/video-editor" element={<VideoEditor />} />
        <Route path="/pdf-upload" element={<PdfUpload />} />
      </Routes>
    </Router>
  );
}

export default App;