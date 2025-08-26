import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowUp, FaVideo } from 'react-icons/fa';

const RecordedVideo = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const base64Data = location.state?.videoUrl || sessionStorage.getItem('recordedVideo');
  const videoUrl = base64Data;

  const handleRecordMore = () => {
    // Clean up the previous recording
    sessionStorage.removeItem('recordedVideo');
    // Navigate to home page
    navigate('/');
  };

  const handleDownload = () => {
    if (base64Data) {
      // Convert base64 to blob
      const byteString = atob(base64Data.split(',')[1]);
      const mimeString = base64Data.split(',')[0].split(':')[1].split(';')[0];
      const ab = new ArrayBuffer(byteString.length);
      const ia = new Uint8Array(ab);
      
      for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      
      const blob = new Blob([ab], { type: mimeString });
      const url = URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = url;
      link.download = 'screen-recording.webm';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
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
            <button
              onClick={handleRecordMore}
              className="flex items-center gap-2 bg-[#635bff] text-white px-4 py-2 rounded-lg hover:bg-[#4b45c6] transition"
            >
              <FaVideo /> Record More
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
