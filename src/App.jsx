import React from "react";
import Home from "./pages/home";
import RecordedVideo from "./pages/RecordedVideo";
// import VideoEditorPage from './pages/VideoEditorPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Portfolio from "./pages/portfolio";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Portfolio" element={<Portfolio />} />
        <Route path="/RecordedVideo" element={<RecordedVideo />} />
        {/* <Route path="/VideoEditorPage" element={<VideoEditorPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
