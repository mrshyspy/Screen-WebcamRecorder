import React from "react";

const FormatOptions = ({ selectedFormat, onFormatChange }) => {
  const formats = ["mp4", "webm", "avi"];

  return (
    <div className="p-4 border rounded bg-gray-100 dark:bg-gray-800">
      <label className="block mb-2 font-semibold">Choose Format:</label>
      <select
        value={selectedFormat}
        onChange={(e) => onFormatChange(e.target.value)}
        className="w-full p-2 border rounded"
      >
        {formats.map((format) => (
          <option key={format} value={format}>
            {format.toUpperCase()}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormatOptions;
