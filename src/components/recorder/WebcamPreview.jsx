// src/components/Recorder/WebcamPreview.jsx
import { MdCancel } from "react-icons/md";
import { IoCameraReverse } from "react-icons/io5";

const WebcamPreview = ({ isWebcamVisible, webcamVideoRef, toggleWebcam }) => {
  return (
    <div className="absolute bottom-4 right-4">
      {isWebcamVisible ? (
        <>
          <video
            ref={webcamVideoRef}
            autoPlay
            muted
            className="w-28 h-20 sm:w-36 sm:h-28 md:w-48 md:h-36 bg-gray-900 rounded-xl"
          />
          <button
            onClick={() => toggleWebcam(false)}
            className="absolute -top-1 -right-3 text-white px-2"
          >
            <MdCancel />
          </button>
        </>
      ) : (
        <button
          onClick={() => toggleWebcam(true)}
          className="w-7 h-7 bg-black bg-opacity-60 rounded-full flex items-center justify-center text-white"
        >
          <IoCameraReverse />
        </button>
      )}
    </div>
  );
};

export default WebcamPreview;
