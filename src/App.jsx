import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaStop, FaPause, FaDownload, FaRedo, FaVideo } from "react-icons/fa";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { IoCameraReverse } from "react-icons/io5";
import { FeaturesSection } from "./components/FeaturesSection";
import { Navbarr } from "./components/Navbarr";
import { HowToUse } from "./components/HowToUse";
import { MadeFor } from "./components/MadeFor";
import { Timeline } from "./components/ui/timeline";
import CallToAction from "./components/CallToAction";

const App = () => {
  const webcamVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);

  const [videoUrl, setVideoUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [isWebcamVisible, setIsWebcamVisible] = useState(true);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecordingWindowOn, setIsRecordingWindowOn] = useState(false);
  const timerRef = useRef(null);

  const streamRefs = useRef({
    screenStream: null,
    webcamStream: null,
    canvasStream: null,
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const startTimer = () => {
    stopTimer();
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startRecording = async () => {
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 1920;
      canvas.height = 1080;

      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1920, height: 1080 },
        audio: true,
      });
      streamRefs.current.screenStream = screenStream;
      const screenVideo = screenVideoRef.current;
      screenVideo.srcObject = screenStream;
      await screenVideo.play();

      let webcamStream = null;
      if (isWebcamVisible) {
        try {
          webcamStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          streamRefs.current.webcamStream = webcamStream;
          const webcamVideo = webcamVideoRef.current;
          webcamVideo.srcObject = webcamStream;
          await webcamVideo.play();
        } catch (err) {
          console.warn("Webcam access denied");
        }
      }

      const drawFrame = () => {
        if (screenVideo.readyState >= 2) {
          ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
        }

        if (
          isWebcamVisible &&
          webcamVideoRef.current &&
          webcamVideoRef.current.readyState >= 2
        ) {
          const webcamWidth = 320;
          const webcamHeight = 240;
          const x = canvas.width - webcamWidth - 20;
          const y = canvas.height - webcamHeight - 20;
          const radius = 20;

          ctx.save();
          ctx.beginPath();
          ctx.moveTo(x + radius, y);
          ctx.lineTo(x + webcamWidth - radius, y);
          ctx.quadraticCurveTo(x + webcamWidth, y, x + webcamWidth, y + radius);
          ctx.lineTo(x + webcamWidth, y + webcamHeight - radius);
          ctx.quadraticCurveTo(
            x + webcamWidth,
            y + webcamHeight,
            x + webcamWidth - radius,
            y + webcamHeight
          );
          ctx.lineTo(x + radius, y + webcamHeight);
          ctx.quadraticCurveTo(
            x,
            y + webcamHeight,
            x,
            y + webcamHeight - radius
          );
          ctx.lineTo(x, y + radius);
          ctx.quadraticCurveTo(x, y, x + radius, y);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(webcamVideoRef.current, x, y, webcamWidth, webcamHeight);
          ctx.restore();
        }

        animationFrameRef.current = requestAnimationFrame(drawFrame);
      };

      drawFrame();

      const canvasStream = canvas.captureStream(30);
      screenStream.getAudioTracks().forEach((track) => {
        canvasStream.addTrack(track);
      });

      if (isWebcamVisible && webcamStream) {
        webcamStream.getAudioTracks().forEach((track) => {
          canvasStream.addTrack(track);
        });
      }

      streamRefs.current.canvasStream = canvasStream;

      const chunks = [];
      const recorder = new MediaRecorder(canvasStream, {
        mimeType: "video/webm;codecs=vp9",
      });

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = () => {
        setRecordedChunks(chunks);
      };

      recorder.start(1000);
      setMediaRecorder(recorder);
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      startTimer();
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    }

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    const { screenStream, webcamStream } = streamRefs.current;
    screenStream?.getTracks().forEach((t) => t.stop());
    webcamStream?.getTracks().forEach((t) => t.stop());

    setIsRecording(false);
    stopTimer();
  };

  const togglePause = () => {
    if (!mediaRecorder) return;
    if (mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      setIsPaused(true);
      stopTimer();
    } else if (mediaRecorder.state === "paused") {
      mediaRecorder.resume();
      setIsPaused(false);
      startTimer();
    }
  };

  const deleteRecording = () => {
    setVideoUrl(null);
    setRecordedChunks([]);
    setRecordingTime(0);
    setIsRecording(false);
    stopTimer();
    if (webcamVideoRef.current) webcamVideoRef.current.pause();
  };

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

  useEffect(() => {
    return () => {
      stopRecording();
      stopTimer();
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbarr />
      <FeaturesSection />
      <Timeline />
      <MadeFor />
      <CallToAction />

      <section className="bg-gradient-to-r from-green-500 to-blue-500 text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold">Screen & Webcam Recorder</h1>
        <p className="text-lg md:text-xl text-gray-100 mt-4">
          Record your screen with a webcam overlay and download high-quality videos.
        </p>
      </section>

      <section className="relative py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">Live Preview (Picture-in-Picture)</h2>

        {!isRecordingWindowOn ? (
          <div className="text-center mb-8">
            <button
              onClick={() => setIsRecordingWindowOn(true)}
              className="inline-flex items-center bg-[#635bff] text-white px-6 py-3 rounded-full hover:bg-indigo-700 transition"
            >
              <FaVideo className="mr-2" />
              Record a Video
            </button>
          </div>
        ) : (
          <div className="mx-auto w-full md:w-4/5 max-w-6xl border-2 border-gray-400 bg-white rounded-xl shadow-md p-4 space-y-4">
            <video
              ref={screenVideoRef}
              autoPlay
              muted
              className="w-full h-auto bg-gray-800 rounded-lg shadow-xl"
            />
            <div className="flex justify-end space-x-4">
              {isWebcamVisible ? (
                <div className="relative">
                  <video
                    ref={webcamVideoRef}
                    autoPlay
                    muted
                    className="w-40 h-28 bg-gray-900 rounded-xl"
                  />
                  <button
                    onClick={() => setIsWebcamVisible(false)}
                    className="absolute top-0 right-0 text-white bg-black bg-opacity-50 p-1 rounded-full"
                  >
                    <MdCancel />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsWebcamVisible(true)}
                  className="bg-black bg-opacity-50 text-white p-2 rounded-full"
                >
                  <IoCameraReverse />
                </button>
              )}
            </div>

            <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
              {!isRecording ? (
                <button
                  onClick={startRecording}
                  className="flex items-center bg-white text-green-600 font-semibold px-4 py-2 rounded-full shadow hover:bg-green-50"
                >
                  <FaPlay className="mr-2" />
                  Start Recording
                </button>
              ) : (
                <div className="flex items-center gap-3 bg-gray-800 bg-opacity-90 text-white px-4 py-2 rounded-full">
                  <button onClick={stopRecording} className="bg-red-600 hover:bg-red-700 p-2 rounded-full">
                    <FaStop />
                  </button>
                  <button onClick={togglePause} className="p-2 rounded-full">
                    {isPaused ? <FaPlay /> : <FaPause />}
                  </button>
                  <span className="font-mono">{formatTime(recordingTime)}</span>
                  <span className="rotate-90">
                    <TfiLayoutLineSolid />
                  </span>
                  <button onClick={startRecording} className="p-2 rounded-full">
                    <FaRedo />
                  </button>
                  <button onClick={deleteRecording} className="p-2 rounded-full">
                    <RiDeleteBin6Line />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </section>

      {videoUrl && (
        <section className="text-center mt-12">
          <h3 className="text-xl font-semibold mb-4">Download Your Recording</h3>
          <video controls src={videoUrl} className="w-4/5 mx-auto mb-4" />
          <a
            href={videoUrl}
            download="recording.webm"
            className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-semibold px-5 py-3 rounded-full transition"
          >
            <FaDownload className="mr-2" />
            Download Recording
          </a>
        </section>
      )}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default App;
