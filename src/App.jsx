import React, { useState, useRef, useEffect } from "react";
import { FaPlay, FaStop, FaPause, FaDownload, FaRedo } from "react-icons/fa";
import { TfiLayoutLineSolid } from "react-icons/tfi";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdCancel } from "react-icons/md";
import { IoCameraReverse } from "react-icons/io5";

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
  const timerRef = useRef(null);

  const streamRefs = useRef({
    screenStream: null,
    webcamStream: null,
    canvasStream: null,
  });

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const startTimer = () => {
    // setRecordingTime(0);
    timerRef.current = setInterval(() => {
      setRecordingTime((prev) => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  const startRecording = async () => {
    try {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = 1920;
      canvas.height = 1080;

      // Capture screen stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: { width: 1920, height: 1080 },
        audio: true,
      });
      streamRefs.current.screenStream = screenStream;
      const screenVideo = screenVideoRef.current;
      screenVideo.srcObject = screenStream;
      await screenVideo.play();

      // Capture webcam stream if visible
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

      // Drawing the screen and webcam (if visible) on the canvas
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
          ctx.drawImage(
            webcamVideoRef.current,
            canvas.width - webcamWidth - 20,
            canvas.height - webcamHeight - 20,
            webcamWidth,
            webcamHeight
          );
        }

        animationFrameRef.current = requestAnimationFrame(drawFrame);
      };

      drawFrame();

      // Capture the canvas stream and add audio tracks
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
    webcamVideoRef.current.pause(); // Pauses the video

    
  };

  // const toggleWebcam = () => {
  //   setIsWebcamVisible((prev) => !prev);
  // };

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
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      
      <canvas ref={canvasRef} className="hidden" />
      <section className="bg-gradient-to-r from-green-500 to-blue-500 text-center py-16 px-6">
        <h1 className="text-4xl md:text-5xl font-bold">
          Screen & Webcam Recorder
        </h1>
        <p className="text-lg md:text-xl text-gray-100 mt-4">
          Record your screen with a webcam overlay and download high-quality
          videos.
        </p>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8">
          Live Preview (Picture-in-Picture)
        </h2>

        <div className="relative mx-auto w-5/6 max-w-6xl border-4 border-gray-600 rounded-xl overflow-hidden">
          <video
            ref={screenVideoRef}
            autoPlay
            muted
            className="w-full h-auto bg-gray-800 rounded-lg shadow-xl"
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
                  className="w-28 h-20 sm:w-36 sm:h-28 md:w-48 md:h-36 bg-black rounded-xl"
                />
                <button
                  onClick={() => setIsWebcamVisible(false)}
                  className="absolute -top-1 -right-3 text-white rounded-full px-2 text-lg md:text-xl"
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

          {/* Controls */}
          <div className="absolute left-1/2 bottom-0 mb-4 -translate-x-1/2 flex flex-wrap justify-center gap-3 sm:gap-4 px-2 sm:px-6">
            {!isRecording ? (
              <button
                onClick={startRecording}
                className="flex items-center bg-white text-green-600 font-semibold px-3 py-2 md:px-5 md:py-3 rounded-full shadow-lg hover:bg-green-50 transition text-sm sm:text-base"
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
      </section>

      {videoUrl && (
        <section className="text-center mt-12">
          <h3 className="text-xl font-semibold mb-4">
            Download Your Recording
          </h3>
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
    </div>
  );
};

export default App;
