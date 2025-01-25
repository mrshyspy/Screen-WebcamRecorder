import React, { useState, useRef } from "react";
import { FaPlay, FaStop, FaDownload } from "react-icons/fa";

function App() {
  const [videoUrl, setVideoUrl] = useState(null);
  const screenVideoRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const mediaRecordersRef = useRef([]);

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const webcamStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      screenVideoRef.current.srcObject = screenStream;
      webcamVideoRef.current.srcObject = webcamStream;

      const canvasStream = createPictureInPictureStream(
        screenStream,
        webcamStream
      );

      const mediaRecorder = new MediaRecorder(canvasStream, {
        mimeType: "video/webm",
      });

      const chunks = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
      };

      mediaRecorder.start();
      mediaRecordersRef.current = [mediaRecorder];
    } catch (err) {
      console.error("Recording error:", err);
    }
  };

  const createPictureInPictureStream = (screenStream, webcamStream) => {
    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    const screenTrack = screenStream.getVideoTracks()[0];
    const webcamTrack = webcamStream.getVideoTracks()[0];

    const canvasStream = canvas.captureStream(30);
    const padding = 16; // Padding around the webcam view
    const borderRadius = 20; // Rounded corner radius
    const borderColor = "white"; // Webcam border color
    const borderWidth = 5; // Webcam border width
    const webcamWidth = 320; // Width of the webcam view
    const webcamHeight = 240; // Height of the webcam view


    const drawStreams = () => {
      // Draw the screen feed to cover the entire canvas
      ctx.drawImage(screenVideoRef.current, 0, 0, canvas.width, canvas.height);

      // Save the current drawing state
      ctx.save();

      // Define the rounded rectangle for the webcam feed
      const x = canvas.width - webcamWidth - padding;
      const y = canvas.height - webcamHeight - padding;

      ctx.beginPath();
      ctx.moveTo(x + borderRadius, y);
      ctx.lineTo(x + webcamWidth - borderRadius, y);
      ctx.quadraticCurveTo(x + webcamWidth, y, x + webcamWidth, y + borderRadius);
      ctx.lineTo(x + webcamWidth, y + webcamHeight - borderRadius);
      ctx.quadraticCurveTo(
        x + webcamWidth,
        y + webcamHeight,
        x + webcamWidth - borderRadius,
        y + webcamHeight
      );
      ctx.lineTo(x + borderRadius, y + webcamHeight);
      ctx.quadraticCurveTo(x, y + webcamHeight, x, y + webcamHeight - borderRadius);
      ctx.lineTo(x, y + borderRadius);
      ctx.quadraticCurveTo(x, y, x + borderRadius, y);
      ctx.closePath();

      // Draw the white border
      ctx.lineWidth = borderWidth;
      ctx.strokeStyle = borderColor;
      ctx.stroke();

      // Clip the webcam feed into the rounded rectangle
      ctx.clip();

      // Draw the webcam feed inside the rounded rectangle
      ctx.drawImage(webcamVideoRef.current, x, y, webcamWidth, webcamHeight);

      // Restore the previous drawing state
      ctx.restore();
    };

    const interval = setInterval(drawStreams, 1000 / 30);

    canvasStream.addEventListener("inactive", () => {
      clearInterval(interval);
      screenTrack.stop();
      webcamTrack.stop();
    });

    return canvasStream;
  };

  const stopRecording = () => {
    mediaRecordersRef.current.forEach((recorder) => recorder.stop());
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-green-500 to-blue-500 text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold text-white">
          Screen & Webcam Recorder
        </h1>
        <p className="text-lg md:text-xl text-gray-100 mt-4">
          Record your screen with a webcam overlay and download high-quality
          videos.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={startRecording}
            className="flex items-center bg-white text-green-600 font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-green-50 transition"
          >
            <FaPlay className="mr-2" />
            Start Recording
          </button>
          <button
            onClick={stopRecording}
            className="flex items-center bg-red-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg hover:bg-red-700 transition"
          >
            <FaStop className="mr-2" />
            Stop Recording
          </button>
        </div>
      </section>

      {/* Video Previews Section */}
      <section className="py-12 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">Live Previews</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Screen View */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Screen View</h3>
            <video
              ref={screenVideoRef}
              autoPlay
              muted
              className="w-full max-w-lg h-auto rounded-lg shadow-lg mx-auto"
            />
          </div>
          {/* Webcam View */}
          <div className="text-center">
            <h3 className="text-xl font-semibold mb-4">Webcam View</h3>
            <video
              ref={webcamVideoRef}
              autoPlay
              muted
              className="w-full max-w-lg h-auto rounded-lg shadow-lg mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Recorded Video Section */}
      {videoUrl && (
        <section className="py-12 px-6 bg-gray-800">
          <h2 className="text-3xl font-bold text-center mb-8">Your Recording</h2>
          <div className="text-center">
            <video
              src={videoUrl}
              controls
              className="w-full max-w-2xl h-auto rounded-lg shadow-lg mx-auto"
            />
            <a
              href={videoUrl}
              download="recording.webm"
              className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              <FaDownload className="mr-2 inline" />
              Download
            </a>
          </div>
        </section>
      )}
       <section className="py-16 px-6">
        <h2 className="text-3xl font-bold text-center mb-8">
          Why Use Our Recorder?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-2">High-Quality Output</h3>
            <p className="text-gray-400">
              Get smooth, high-definition videos for all your recording needs.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Webcam Overlay</h3>
            <p className="text-gray-400">
              Seamlessly integrate your webcam feed with the screen recording.
            </p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold mb-2">Easy to Use</h3>
            <p className="text-gray-400">
              Simple controls to start, stop, and download recordings with ease.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-500 py-6 text-center">
        <p>&copy; 2025 Screen Recorder App. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;
