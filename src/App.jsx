import React from "react";
import Home from "./pages/home";
import RecordedVideo from "./pages/RecordedVideo";
// import VideoEditorPage from './pages/VideoEditorPage';
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Signin from "./pages/Signin";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
                <Route path="/Signin" element={<Signin />} />


        <Route path="/RecordedVideo" element={<RecordedVideo />} />
        {/* <Route path="/VideoEditorPage" element={<VideoEditorPage />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
