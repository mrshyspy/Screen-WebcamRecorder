// VideoTrimmer.jsx
import React, { useState } from 'react';
import ffmpegCut from '../utils/ffmpegCut';

const VideoEditorPage = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [outputUrl, setOutputUrl] = useState('');
  const [loading, setLoading] = useState(false);

  const handleCut = async () => {
    if (!videoFile || !startTime || !endTime) {
      alert('Please upload a video and enter start and end time');
      return;
    }

    setLoading(true);
    try {
      const trimmedBlob = await ffmpegCut(videoFile, startTime, endTime);
      const url = URL.createObjectURL(trimmedBlob);
      setOutputUrl(url);
    } catch (err) {
      console.error('Video cut error:', err);
      alert('Failed to cut the video.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Video Cutter</h1>

      <input
        type="file"
        accept="video/*"
        onChange={(e) => setVideoFile(e.target.files?.[0])}
        className="mb-4"
      />

      <div className="flex gap-4 mb-4">
        <input
          type="text"
          placeholder="Start time (e.g. 00:00:05)"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="border p-2 rounded w-full"
        />
        <input
          type="text"
          placeholder="End time (e.g. 00:00:10)"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="border p-2 rounded w-full"
        />
      </div>

      <button
        onClick={handleCut}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        {loading ? 'Processing...' : 'Cut Video'}
      </button>

      {outputUrl && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Trimmed Video Preview</h2>
          <video controls src={outputUrl} className="w-full mb-2" />
          <a
            href={outputUrl}
            download="trimmed-video.mp4"
            className="text-blue-600 underline"
          >
            Download Video
          </a>
        </div>
      )}
    </div>
  );
};

export default VideoEditorPage;
