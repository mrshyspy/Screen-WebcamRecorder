// src/components/Recorder/RecorderWindow.jsx
import { MdCancel } from "react-icons/md";
import RecorderControls from "./RecorderControls";
import WebcamPreview from "./WebcamPreview";

const RecorderWindow = ({
  isRecordingWindowOn,
  setIsRecordingWindowOn,
  screenVideoRef,
  webcamVideoRef,
  canvasRef,
  recorderHook,
  isWebcamVisible,
  setIsWebcamVisible,
}) => {
  const {
    isRecording,
    isPaused,
    recordingTime,
    formatTime,
    startRecording,
    stopRecording,
    togglePause,
    deleteRecording,
  } = recorderHook;

  return isRecordingWindowOn ? (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 max-w-6xl w-3/4 border-4 border-gray-600 rounded-xl overflow-hidden">
      <button
        onClick={() => setIsRecordingWindowOn(false)}
        className="absolute top-3 right-3 bg-black bg-opacity-60 text-white p-2 rounded-full"
      >
        <MdCancel />
      </button>

      <video ref={screenVideoRef} autoPlay muted className="w-full" />

      <WebcamPreview
        isWebcamVisible={isWebcamVisible}
        webcamVideoRef={webcamVideoRef}
        toggleWebcam={setIsWebcamVisible}
      />

      <RecorderControls
        isRecording={isRecording}
        isPaused={isPaused}
        formatTime={formatTime}
        recordingTime={recordingTime}
        startRecording={startRecording}
        stopRecording={stopRecording}
        togglePause={togglePause}
        deleteRecording={deleteRecording}
      />

      <canvas ref={canvasRef} className="hidden" />
    </div>
  ) : null;
};

export default RecorderWindow;
