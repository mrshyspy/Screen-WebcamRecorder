import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaStop, FaPause, FaDownload, FaRedo } from "react-icons/fa";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { IoCameraReverse } from "react-icons/io5";


import Navbar from "./components/navbar";

function App() {
  const [videoUrl, setVideoUrl] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isRecordingWindowOn, setRecordingWindow] = useState(false);
  const [isWebcamEnabled, setIsWebcamEnabled] = useState(true); // toggle before recording
  const [isWebcamVisible, setIsWebcamVisible] = useState(true); // cross/camera during recording

  const screenVideoRef = useRef(null);
  const webcamVideoRef = useRef(null);
  const mediaRecordersRef = useRef([]);
  const downloadSectionRef = useRef(null);

  useEffect(() => {
    let timer;
    if (isRecording && !isPaused) {
      timer = setInterval(() => setRecordingTime((prev) => prev + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [isRecording, isPaused]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const startRecording = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      // const webcamStream = await navigator.mediaDevices.getUserMedia({
      //   video: { width: 640, height: 480 },
      //   audio: true,
      // });
      let webcamStream = null;
      if (isWebcamEnabled) {
        webcamStream = await navigator.mediaDevices.getUserMedia({
          video: { width: 640, height: 480 },
          audio: true,
        });
        webcamVideoRef.current.srcObject = webcamStream;
      }

      screenVideoRef.current.srcObject = screenStream;
      webcamVideoRef.current.srcObject = webcamStream;

      const canvasStream = createPictureInPictureStream(
        screenStream,
        webcamStream
      );
      const screenAudioTracks = screenStream.getAudioTracks();
      const webcamAudioTracks = webcamStream.getAudioTracks();

      const audioContext = new AudioContext();
      const destination = audioContext.createMediaStreamDestination();

      if (screenAudioTracks.length > 0) {
        const screenSource = audioContext.createMediaStreamSource(
          new MediaStream(screenAudioTracks)
        );
        screenSource.connect(destination);
      }

      if (webcamAudioTracks.length > 0) {
        const webcamSource = audioContext.createMediaStreamSource(
          new MediaStream(webcamAudioTracks)
        );
        webcamSource.connect(destination);
      }

      const finalStream = new MediaStream([
        ...canvasStream.getVideoTracks(),
        ...destination.stream.getAudioTracks(),
      ]);

      const mediaRecorder = new MediaRecorder(finalStream, {
        mimeType: "video/webm",
      });

      const chunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "video/webm" });
        const url = URL.createObjectURL(blob);
        setVideoUrl(url);
        downloadSectionRef.current?.scrollIntoView({ behavior: "smooth" });
      };

      mediaRecorder.start();
      mediaRecordersRef.current = [mediaRecorder];
      setIsRecording(true);
      setIsPaused(false);
      setRecordingTime(0);
      console.log("Recording started");
    } catch (err) {
      console.error("Recording error:", err);
      alert(
        "Failed to start recording. Please check permissions and try again."
      );
    }
  };

  const togglePause = () => {
    const recorder = mediaRecordersRef.current[0];
    if (!recorder) return;

    if (recorder.state === "recording") {
      recorder.pause();
      setIsPaused(true);
    } else if (recorder.state === "paused") {
      recorder.resume();
      setIsPaused(false);
    }
  };

  const stopRecording = () => {
    mediaRecordersRef.current.forEach((recorder) => recorder.stop());
    setIsRecording(false);
    setIsPaused(false);
    setRecordingTime(0);
  };

  const deleteRecording = () => {
    setVideoUrl(null);
    setIsRecording(false);
    setRecordingTime(0);

    if (screenVideoRef.current) {
      screenVideoRef.current.srcObject
        ?.getTracks()
        .forEach((track) => track.stop());
      screenVideoRef.current.srcObject = null;
    }

    if (webcamVideoRef.current) {
      webcamVideoRef.current.srcObject
        ?.getTracks()
        .forEach((track) => track.stop());
      webcamVideoRef.current.srcObject = null;
    }
  };

  const createPictureInPictureStream = (screenStream, webcamStream) => {
    const webcamEnabled = webcamStream && isWebcamVisible;

    const canvas = document.createElement("canvas");
    canvas.width = 1920;
    canvas.height = 1080;
    const ctx = canvas.getContext("2d");

    const screenTrack = screenStream.getVideoTracks()[0];
    const webcamTrack = webcamStream.getVideoTracks()[0];
    const canvasStream = canvas.captureStream(30);

    const padding = 16;
    const borderRadius = 20;
    const borderColor = "white";
    const borderWidth = 5;
    const webcamWidth = 320;
    const webcamHeight = 240;

    const screenVideo = document.createElement("video");
    const webcamVideo = document.createElement("video");

    screenVideo.srcObject = screenStream;
    webcamVideo.srcObject = webcamStream;

    screenVideo.muted = true;
    webcamVideo.muted = true;

    screenVideo
      .play()
      .catch((err) => console.warn("Screen video play error", err));
    webcamVideo
      .play()
      .catch((err) => console.warn("Webcam video play error", err));

    const drawStreams = () => {
      if (screenVideo.readyState >= 2) {
        ctx.drawImage(screenVideo, 0, 0, canvas.width, canvas.height);
      }

      if (webcamVideo.readyState >= 2) {
        const x = canvas.width - webcamWidth - padding;
        const y = canvas.height - webcamHeight - padding;

        ctx.save();
        ctx.beginPath();
        ctx.moveTo(x + borderRadius, y);
        ctx.lineTo(x + webcamWidth - borderRadius, y);
        ctx.quadraticCurveTo(
          x + webcamWidth,
          y,
          x + webcamWidth,
          y + borderRadius
        );
        ctx.lineTo(x + webcamWidth, y + webcamHeight - borderRadius);
        ctx.quadraticCurveTo(
          x + webcamWidth,
          y + webcamHeight,
          x + webcamWidth - borderRadius,
          y + webcamHeight
        );
        ctx.lineTo(x + borderRadius, y + webcamHeight);
        ctx.quadraticCurveTo(
          x,
          y + webcamHeight,
          x,
          y + webcamHeight - borderRadius
        );
        ctx.lineTo(x, y + borderRadius);
        ctx.quadraticCurveTo(x, y, x + borderRadius, y);
        ctx.closePath();
        ctx.lineWidth = borderWidth;
        ctx.strokeStyle = borderColor;
        ctx.stroke();
        ctx.clip();
        ctx.drawImage(webcamVideo, x, y, webcamWidth, webcamHeight);
        ctx.restore();
      }
    };

    const interval = setInterval(drawStreams, 1000 / 30);

    canvasStream.addEventListener("inactive", () => {
      clearInterval(interval);
      screenTrack.stop();
      webcamTrack.stop();
    });

    return canvasStream;
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <Navbar />
      <section className="bg-gradient-to-r from-green-500 to-blue-500 text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Screen & Webcam Recorder
        </h1>
        <p className="text-lg md:text-xl text-gray-100 mt-4">
          Record your screen with a webcam overlay and download high-quality
          videos.
        </p>
      </section>

      <section className=" py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Live Preview (Picture-in-Picture)
        </h2>

        <div className="  relative mx-auto w-5/6 max-w-6xl border-4 border-gray-600 rounded-xl overflow-hidden">
          <video
            ref={screenVideoRef}
            autoPlay
            muted
            className="w-full h-auto bg-gray-800 rounded-lg shadow-xl"
          />
          <div className="absolute bottom-4 right-4">
            {isWebcamVisible ? (
              <>
                <video
                  ref={webcamVideoRef}
                  autoPlay
                  muted
                  className="w-28 h-20 sm:w-36 sm:h-28 md:w-48 md:h-36 bg-black rounded-xl"
                />
                <button
                  onClick={() => setIsWebcamVisible(false)}
                  className="absolute -top-1 -right-3  text-white rounded-full px-2 text-lg md:text-xl"
                >
                  <MdCancel />

                </button>
              </>
            ) : (
              <button
                onClick={() => setIsWebcamVisible(true)}
                className="w-7 h-7 md:w-10 md:h-10 bg-black bg-opacity-60 rounded-full flex items-center justify-center text-white text-lg md:text-2xl"
              >
                <IoCameraReverse />

              </button>
            )}
          </div>

          {/* Recording Controls */}
          <div className="absolute left-1/2 bottom-0 mb-4 -translate-x-1/2 flex flex-wrap justify-center gap-3 sm:gap-4 px-2 sm:px-6">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center bg-white text-green-600 font-semibold px-4 py-2 md:px-5 md:py-2 rounded-full shadow-lg hover:bg-green-50 transition text-sm sm:text-base"
              >
                <FaPlay className="mr-2 text-xs md:text-sm" />
                Start Recording
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-gray-800 bg-opacity-90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-xl animate-fade-in text-xs md:text-base">
                <button
                  onClick={stopRecording}
                  className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-full transition"
                  title="Stop Recording"
                >
                  <FaStop />
                </button>

                <button
                  onClick={togglePause}
                  className="text-white p-2 rounded-full transition"
                  title={isPaused ? "Resume" : "Pause"}
                >
                  {isPaused ? <FaPlay /> : <FaPause />}
                </button>

                <span className="font-mono">{formatTime(recordingTime)}</span>
                <span className="rotate-90">
                  {" "}
                  <TfiLayoutLineSolid />{" "}
                </span>

                <button
                  onClick={startRecording}
                  title="Record again"
                  className="text-white p-2 rounded-full"
                >
                  <FaRedo />
                </button>

                <button
                  onClick={deleteRecording}
                  title="Delete recording"
                  className="text-white p-2 rounded-full"
                >
                  <RiDeleteBin6Line />
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
      {videoUrl && (
        <div
          ref={downloadSectionRef}
          className="mt-12 flex flex-col items-center gap-4"
        >
          <video src={videoUrl} controls className="w-full max-w-3xl" />
          <a
            href={videoUrl}
            download="recording.webm"
            className="flex items-center bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg hover:bg-green-700 transition"
          >
            <FaDownload className="mr-2" />
            Download Recording
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
