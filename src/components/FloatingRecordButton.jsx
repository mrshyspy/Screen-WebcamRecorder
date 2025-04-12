import React from 'react';
import { FaVideo } from 'react-icons/fa';

const FloatingRecordButton = () => {
  return (
    <div className="fixed bottom-6 left-6 z-50 group">
      <button className="flex items-center bg-[#635bff] text-white px-4 py-2 rounded-full shadow-lg transition-all duration-300 ease-in-out overflow-hidden w-12 group-hover:w-48">
        <FaVideo className="w-5 h-5 mr-0 group-hover:mr-2 transition-all duration-300" />
        <span className="whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          Record a video
        </span>
      </button>
    </div>
  );
};

export default FloatingRecordButton;
