import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Index from "./pages/Index.jsx";
import VideoEditor from "./pages/VideoEditor.jsx";

function App() {
  return (
    <Router>
      <Routes>
        <Route exact path="/" element={<Index />} />
        <Route path="/video-editor" element={<VideoEditor />} />
      </Routes>
    </Router>
  );
}

export default App;
