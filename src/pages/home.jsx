import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaStop, FaPause, FaDownload, FaRedo } from "react-icons/fa";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { IoCameraReverse } from "react-icons/io5";
import { FaVideo } from "react-icons/fa";
import { FeaturesSection } from "../components/FeaturesSection";
import { Navbarr } from "../components/Navbarr";
import { HowToUse } from "../components/HowToUse";
import { MadeFor } from "../components/MadeFor";
import { Timeline } from "../components/ui/timeline";
import CallToAction from "../components/CallToAction";
import { Footer } from "../components/footer";

import { useNavigate } from "react-router-dom";

const Home = () => {
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

  const navigate = useNavigate();

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const startTimer = () => {
    stopTimer(); // clear any existing timer
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

          ctx.drawImage(
            webcamVideoRef.current,
            x,
            y,
            webcamWidth,
            webcamHeight
          );

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
      navigate("/RecordedVideo", { state: { videoUrl: url } });
    }
  }, [recordedChunks]);

  useEffect(() => {
    return () => {
      stopRecording();
      stopTimer(); // ensure timer is cleared on unmount
    };
  }, []);
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl);
      }
    };
  }, [videoUrl]);
  //   useEffect(() => {
  //   if (isRecordingWindowOn) {
  //     document.body.classList.add("overflow-hidden");
  //   } else {
  //     document.body.classList.remove("overflow-hidden");
  //   }

  //   // Clean up on unmount
  //   return () => {
  //     document.body.classList.remove("overflow-hidden");
  //   };
  // }, [isRecordingWindowOn]);

  return (
    <div className="min-h-screen overflow-hidden bg-gray-100">
      <div
        className={`${
          isRecordingWindowOn
            ? " pointer-events-none blur-sm scale-100 transition-all duration-300"
            : "transition-all duration-300"
        }`}
      >
        <Navbarr
          setIsRecordingWindowOn={setIsRecordingWindowOn}
        />
        <FeaturesSection />
        <Timeline />
        <MadeFor />
        <CallToAction
          setIsRecordingWindowOn={setIsRecordingWindowOn}
        />
               <Footer />

      </div>
      {!isRecordingWindowOn ? (
        <div className="fixed bottom-6 left-6 z-50 group">
          <button
            onClick={() => setIsRecordingWindowOn(true)}
            className="flex items-center justify-start bg-[#635bff] text-white rounded-full shadow-lg overflow-hidden transition-all duration-300 ease-in-out w-12 group-hover:w-48 h-12 pl-4"
          >
            <FaVideo className="w-5 h-5 flex-shrink-0 group-hover:mr-2" />
            <span className="ml-2 mr-0 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              Record a video
            </span>
          </button>
        </div>
      ) : (
        <div className=" fixed top-1/2 left-1/2 transition-all duration-800 ease-in-out transform -translate-x-1/2 -translate-y-1/2 max-h-screen z-50 mx-auto w-3/4 max-w-6xl border-4 border-gray-600 rounded-xl overflow-hidden">
          <button
            onClick={() => setIsRecordingWindowOn(false)}
            className="absolute top-3 right-3 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full z-50"
            title="Cancel / Close"
          >
            <MdCancel className="text-xl md:text-2xl" />
          </button>
          <video
            ref={screenVideoRef}
            autoPlay
            muted
            poster="/assets/poster.jpg" // ✅ Static image before video plays
            className="w-full h-auto  rounded-lg shadow-xl"
            style={{ aspectRatio: "16/9" }}
          />

          <div
            className={`absolute bottom-4 right-4  ${
              !isRecording ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            {isWebcamVisible ? (
              <>
                <video
                  ref={webcamVideoRef}
                  autoPlay
                  muted
                  style={{ display: isWebcamVisible ? "block" : "none" }}
                  className=" w-28 h-20 sm:w-36 sm:h-28 md:w-48 md:h-36  bg-gray-900 transition-all duration-400 ease-in-out  rounded-xl"
                />
                <button
                  onClick={() => setIsWebcamVisible(false)}
                  className="  absolute -top-1 -right-3 text-white   rounded-full px-2 text-lg md:text-xl"
                >
                  <MdCancel />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsWebcamVisible(true)}
                className=" transition-all duration-200 ease-in-out w-7 h-7 md:w-10 md:h-10 bg-black bg-opacity-60 rounded-full flex items-center justify-center text-white text-lg md:text-2xl"
              >
                <IoCameraReverse />
              </button>
            )}
          </div>

          {/* Controls */}
          <div className="absolute left-1/2 bottom-0 mb-4 -translate-x-1/2 flex flex-wrap justify-center gap-3 sm:gap-4 px-2 sm:px-6">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center transition-all duration-200 ease-in-out bg-white text-green-600 font-semibold px-3 py-2 md:px-5 md:py-3 rounded-full shadow-lg hover:bg-green-50  text-sm sm:text-base"
              >
                <FaPlay className="mr-2 text-xs md:text-sm" />
                Start Recording
              </button>
            ) : (
              <div className="flex items-center gap-3 bg-gray-800 bg-opacity-90 backdrop-blur-md text-white px-4 py-2 rounded-full shadow-xl text-xs md:text-base">
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
                  <TfiLayoutLineSolid />
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
      )}
      <canvas ref={canvasRef} className="hidden" />
     
      
    </div>
  );
};

export default Home;
