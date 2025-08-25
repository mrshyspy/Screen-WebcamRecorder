// src/components/Recorder/RecorderControls.jsx
import { FaPlay, FaStop, FaPause, FaRedo } from "react-icons/fa";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";

const RecorderControls = ({
  isRecording,
  isPaused,
  formatTime,
  recordingTime,
  startRecording,
  stopRecording,
  togglePause,
  deleteRecording,
}) => {
  return (
    <div className="absolute left-1/2 bottom-0 mb-4 -translate-x-1/2 flex flex-wrap justify-center gap-3 sm:gap-4 px-2 sm:px-6">
      {!isRecording ? (
        <button
          onClick={startRecording}
          className="flex items-center bg-white text-green-600 font-semibold px-3 py-2 md:px-5 md:py-3 rounded-full shadow-lg hover:bg-green-50"
        >
          <FaPlay className="mr-2" /> Start Recording
        </button>
      ) : (
        <div className="flex items-center gap-3 bg-gray-800 bg-opacity-90 text-white px-4 py-2 rounded-full shadow-xl">
          <button onClick={stopRecording} className="bg-red-600 p-2 rounded-full">
            <FaStop />
          </button>
          <button onClick={togglePause} className="p-2">
            {isPaused ? <FaPlay /> : <FaPause />}
          </button>
          <span className="font-mono">{formatTime(recordingTime)}</span>
          <span className="rotate-90">
            <TfiLayoutLineSolid />
          </span>
          <button onClick={startRecording} className="p-2">
            <FaRedo />
          </button>
          <button onClick={deleteRecording} className="p-2">
            <RiDeleteBin6Line />
          </button>
        </div>
      )}
    </div>
  );
};

export default RecorderControls;
