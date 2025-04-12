import React, { useState } from 'react';

const DeviceSelector = () => {
  const [cameras, setCameras] = useState([]);
  const [microphones, setMicrophones] = useState([]);
  const [showCameras, setShowCameras] = useState(false);
  const [showMicrophones, setShowMicrophones] = useState(false);

  const getDevices = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      const devices = await navigator.mediaDevices.enumerateDevices();
      const cams = devices.filter((d) => d.kind === 'videoinput');
      const mics = devices.filter((d) => d.kind === 'audioinput');
      setCameras(cams);
      setMicrophones(mics);
    } catch (error) {
      console.error('Error accessing devices:', error);
    }
  };

  const handleShowCameras = async () => {
    await getDevices();
    setShowCameras(!showCameras);
    setShowMicrophones(false);
  };

  const handleShowMicrophones = async () => {
    await getDevices();
    setShowMicrophones(!showMicrophones);
    setShowCameras(false);
  };

  return (
    <div className="space-y-4 p-4">
      <button
        onClick={handleShowCameras}
        className="bg-green-600 text-white px-4 py-2 rounded shadow"
      >
        Show Camera Devices
      </button>
      {showCameras && (
        <select className="block w-full p-2 border rounded">
          {cameras.map((cam) => (
            <option key={cam.deviceId} value={cam.deviceId}>
              {cam.label || 'Unnamed Camera'}
            </option>
          ))}
        </select>
      )}

      <button
        onClick={handleShowMicrophones}
        className="bg-blue-600 text-white px-4 py-2 rounded shadow"
      >
        Show Microphone Devices
      </button>
      {showMicrophones && (
        <select className="block w-full p-2 border rounded">
          {microphones.map((mic) => (
            <option key={mic.deviceId} value={mic.deviceId}>
              {mic.label || 'Unnamed Microphone'}
            </option>
          ))}
        </select>
      )}
    </div>
  );
};

export default DeviceSelector;
