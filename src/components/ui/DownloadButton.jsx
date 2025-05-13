import React from "react";

const Button = ({ videoUrl }) => {
  if (!videoUrl) return null;

  return (
    <a
      href={videoUrl}
      download
      className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Download Converted Video
    </a>
  );
};

export default Button;
