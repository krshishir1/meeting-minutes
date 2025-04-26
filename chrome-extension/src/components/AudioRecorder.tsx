// AudioRecorder.js
import { useRef, useState } from "react";

export default function AudioRecorder() {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream);

    recorder.ondataavailable = (e) => {
      chunksRef.current.push(e.data);
    };

    recorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: "audio/webm" });
      setAudioBlob(blob);
      chunksRef.current = [];
    };

    recorder.start();
    setMediaRecorder(recorder);
  };

  const stopRecording = () => {
    mediaRecorder.stop();
  };

  const uploadToS3 = async () => {
    if (!audioBlob) return;

    let audioUrlParams = {
      fileName: "audio_" + Date.now() + ".webm",
      fileType: "audio/webm",
    };
    const presignedRes = await fetch("http://localhost:4000/presigned-url", {
      method: "POST",
      body: JSON.stringify(audioUrlParams),
      headers: { "Content-Type": "application/json" },
    });

    const { url } = await presignedRes.json();
    console.log("URL found: ", url);

    const formData = new FormData();
    // Object.entries(fields).forEach(([key, value]) => {
    //   formData.append(key, value as string);
    // });
    formData.append("file", audioBlob);

    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "audio/webm",
      },
      body: audioBlob,
    });

    if (uploadRes.ok) {
      alert("Uploaded successfully!");
    } else {
      alert("Upload failed");
    }
  };

  return (
    <div>
      <button onClick={startRecording}>🎙️ Start</button>
      <button onClick={stopRecording}>⏹️ Stop</button>
      <button onClick={uploadToS3} disabled={!audioBlob}>
        ⬆️ Upload
      </button>
    </div>
  );
}
