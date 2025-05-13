import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg';

let ffmpeg;
let loaded = false;

if (typeof document !== 'undefined') {
  try {
    ffmpeg = createFFmpeg({
      corePath: 'https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js',
      log: true,
    });
  } catch (e) {
    console.error('FFmpeg initialization failed', e);
  }
}

const ffmpegCut = async (file, start, end) => {
  if (!loaded) {
    await ffmpeg.load();
    loaded = true;
  }

  const fileName =
    file instanceof File && file.name
      ? file.name
      : `${Math.random().toString().substr(2)}.mp4`;

  await ffmpeg.FS('writeFile', fileName, await fetchFile(file));

  const outputFile = `${Math.random().toString().substr(2)}.mp4`;

  await ffmpeg.run('-i', fileName, '-ss', start, '-to', end, '-c', 'copy', outputFile);

  const data = ffmpeg.FS('readFile', outputFile);
  return new Blob([data.buffer], { type: 'video/mp4' });
};

export default ffmpegCut;
