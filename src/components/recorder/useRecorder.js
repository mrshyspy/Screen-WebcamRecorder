// src/components/Recorder/useRecorder.js
import { useRef, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const useRecorder = (isWebcamVisible) => {
  const webcamVideoRef = useRef(null);
  const screenVideoRef = useRef(null);
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const timerRef = useRef(null);

  const [videoUrl, setVideoUrl] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [recordingTime, setRecordingTime] = useState(0);

  const streamRefs = useRef({
    screenStream: null,
    webcamStream: null,
    canvasStream: null,
  });

  const navigate = useNavigate();

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
      screenVideoRef.current.srcObject = screenStream;
      await screenVideoRef.current.play();

      let webcamStream = null;
      if (isWebcamVisible) {
        try {
          webcamStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true,
          });
          streamRefs.current.webcamStream = webcamStream;
          webcamVideoRef.current.srcObject = webcamStream;
          await webcamVideoRef.current.play();
        } catch {
          console.warn("Webcam access denied");
        }
      }

      const drawFrame = () => {
        if (screenVideoRef.current.readyState >= 2) {
          ctx.drawImage(screenVideoRef.current, 0, 0, canvas.width, canvas.height);
        }

        if (isWebcamVisible && webcamVideoRef.current?.readyState >= 2) {
          ctx.drawImage(webcamVideoRef.current, canvas.width - 340, canvas.height - 260, 320, 240);
        }
        animationFrameRef.current = requestAnimationFrame(drawFrame);
      };

      drawFrame();

      const canvasStream = canvas.captureStream(30);
      screenStream.getAudioTracks().forEach((t) => canvasStream.addTrack(t));
      webcamStream?.getAudioTracks().forEach((t) => canvasStream.addTrack(t));
      streamRefs.current.canvasStream = canvasStream;

      const chunks = [];
      const recorder = new MediaRecorder(canvasStream, {
        mimeType: "video/webm;codecs=vp9",
      });
      recorder.ondataavailable = (e) => e.data.size > 0 && chunks.push(e.data);
      recorder.onstop = () => setRecordedChunks(chunks);

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
    if (mediaRecorder && mediaRecorder.state !== "inactive") mediaRecorder.stop();
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

    streamRefs.current.screenStream?.getTracks().forEach((t) => t.stop());
    streamRefs.current.webcamStream?.getTracks().forEach((t) => t.stop());

    setIsRecording(false);
    stopTimer();
  };

  const togglePause = () => {
    if (!mediaRecorder) return;
    if (mediaRecorder.state === "recording") {
      mediaRecorder.pause();
      setIsPaused(true);
      stopTimer();
    } else {
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
    webcamVideoRef.current?.pause();
  };

  useEffect(() => {
    if (recordedChunks.length > 0) {
      const blob = new Blob(recordedChunks, { type: "video/webm" });
      const url = URL.createObjectURL(blob);
      setVideoUrl(url);
      navigate("/RecordedVideo", { state: { videoUrl: url } });
    }
  }, [recordedChunks]);

  useEffect(() => () => stopRecording(), []);
  useEffect(() => () => videoUrl && URL.revokeObjectURL(videoUrl), [videoUrl]);

  return {
    webcamVideoRef,
    screenVideoRef,
    canvasRef,
    videoUrl,
    isRecording,
    isPaused,
    recordingTime,
    formatTime,
    startRecording,
    stopRecording,
    togglePause,
    deleteRecording,
  };
};
