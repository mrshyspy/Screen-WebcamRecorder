import React from 'react';
import { useLocation } from 'react-router-dom';
import { FaDownload, FaArrowUp } from 'react-icons/fa';

const RecordedVideo = () => {
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;

  const handleDownload = () => {
    if (videoUrl) {
      const link = document.createElement('a');
      link.href = videoUrl;
      link.download = 'recorded_video.mp4';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      {videoUrl ? (
        <div className="w-full  max-w-3xl bg-white rounded-xl shadow-lg p-6 flex flex-col items-center space-y-4">
          <video
            src={videoUrl}
            controls
            autoPlay
            className="w-full rounded-lg shadow-md"
          />
          <div className="flex gap-4">
            <button
              onClick={handleDownload}
              className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
            >
              <FaDownload /> Download
            </button>
            {/* <button
              onClick={scrollToTop}
              className="flex items-center gap-2 bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
            >
              <FaArrowUp /> Back to Top
            </button> */}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-lg">No video found.</p>
      )}
    </div>
  );
};

export default RecordedVideo;
