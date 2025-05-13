import React from "react";

const VideoUpload = ({ onVideoUpload }) => {
  return (
    <div className="p-4 border rounded bg-gray-100 dark:bg-gray-800">
      <label className="block mb-2 font-semibold">Upload Video:</label>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => onVideoUpload(e.target.files[0])}
        className="w-full p-2 border rounded"
      />
    </div>
  );
};

export default VideoUpload;
