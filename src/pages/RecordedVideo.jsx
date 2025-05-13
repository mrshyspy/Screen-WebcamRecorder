import React from 'react'
import { useLocation } from 'react-router-dom';

const RecordedVideo = () => {
  const location = useLocation();
  const videoUrl = location.state?.videoUrl;

  return (
    <div>
      {videoUrl ? (
        <video src={videoUrl} controls autoPlay />
      ) : (
        <p>No video found.</p>
      )}
    </div>
  );
};
export default RecordedVideo;