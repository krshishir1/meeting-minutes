import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { IoIosClose } from "react-icons/io";
import { IoIosArrowBack } from "react-icons/io";

const MeetingRecorder = () => {
  const [meetingName, setMeetingName] = useState("");
  const [meetingId, setMeetingId] = useState("");
  const [projectName, setProjectName] = useState("");
  //   const [meetingNameSaved, setMeetingNameSaved] = useState(false);

  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [audioBlob, setAudioBlob] = useState(null);

  const chunksRef = useRef([]);
  const intervalRef = useRef(null);

  const { projectId } = useParams();
  const navigate = useNavigate();

  const [recordingTime, setRecordingTime] = useState(0);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingFinished, setRecordingFinished] = useState(false);
  const [status, setStatus] = useState("START");
  const [preparingTranscription, setPreparingTranscription] = useState(false);

  const [links, setLinks] = useState("");

  const [alertMessage, setAlertMessage] = useState("");

  useEffect(() => {
    async function fetchProject() {
      const response = await fetch(
        "http://localhost:4000/api/projects/" + projectId
      );
      if (response.ok) {
        const data = await response.json();
        const lastMeeting =
          data.project.meetings[data.project.meetings.length - 1];

        console.log(lastMeeting);

        if (lastMeeting) {
          setMeetingId(lastMeeting._id);
          setMeetingName(lastMeeting.title);
        }
      }
    }

    if (projectId) {
      //   fetchProject();
    }
  }, [projectId]);

  useEffect(() => {
    async function fetchProject() {
      const response = await fetch(
        "http://localhost:4000/api/projects/" + projectId
      );
      if (response.ok) {
        const data = await response.json();
        setProjectName(data.project.name);
      }
    }
    fetchProject();
  }, []);

  const handleStartPause = async () => {
    if (status == "START") {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });
      const recorder = new MediaRecorder(stream);

      recorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        setAudioBlob(blob);
        chunksRef.current = [];
      };

      recorder.start();
      setMediaRecorder(recorder);
      setStatus("PAUSE");
      setIsRecording(true);

      intervalRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }

    if (status == "PAUSE") {
      mediaRecorder.stop();
      setStatus("START");
      clearInterval(intervalRef.current);
    }
  };

  const handleFinish = async () => {
    console.log("handleFinish", audioBlob);
    if (!audioBlob) return;

    let audioUrlParams = {
      fileName: `${projectName}_` + meetingId + ".webm",
      fileType: "video/webm",
    };
    const presignedRes = await fetch("http://localhost:4000/presigned-url", {
      method: "POST",
      body: JSON.stringify(audioUrlParams),
      headers: { "Content-Type": "application/json" },
    });

    const { url } = await presignedRes.json();
    console.log("URL found: ", url);

    const formData = new FormData();
    formData.append("file", audioBlob);

    const uploadRes = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "audio/webm",
      },
      body: audioBlob,
    });

    if (uploadRes.ok) {
      setAlertMessage("Meeting Recorded successfully!");

      setPreparingTranscription(true);

      const transcriptionRes = await fetch(
        "http://localhost:4000/api/meetings/transcribe",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            inputKey: `${projectName}_` + meetingId,
          }),
        }
      );

      if (transcriptionRes.ok) {
        setRecordingFinished(true);
        setPreparingTranscription(false);
      }
    } else {
      alert("Upload failed");
    }
  };

  const handleSaveMeetingName = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          projectId,
          title: meetingName,
        }),
      });

      const data = await response.json();
      setMeetingId(data.meeting?._id ? data.meeting._id : "");
      //   chrome.storage.local.set({
      //     meetingName: meetingName,
      //   })
    } catch (err) {
      console.log(err);
    }
  };

  const handleRedirect = () => {};

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hrs > 0 ? `${hrs}:` : ""}${mins
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-lg">
      <button
        onClick={() => navigate("/")}
        className="border cursor-pointer border-neutral-50 px-2 py-1 rounded-md flex items-center gap-2 text-sm"
      >
        <IoIosArrowBack size={28} />
        <p>Back</p>
      </button>

      <h2 className="text-xl font-semibold mb-4 mt-8">Start Recording</h2>

      {/* Input field for meeting name */}
      <div className="mb-4">
        {/* <label className="block text-sm font-medium text-gray-700">Meeting Name</label> */}
        <input
          type="text"
          className="mt-2 p-2 py-3 w-full border border-gray-300 rounded-md"
          value={meetingName}
          onChange={(e) => setMeetingName(e.target.value)}
          disabled={meetingId != ""}
          placeholder="Enter meeting name"
        />
        {meetingName != "" && meetingId == "" && (
          <div className="flex justify-end mt-2">
            <a
              onClick={handleSaveMeetingName}
              className="text-sm bg-blue-800 text-white tracking-wider px-3 py-2 border cursor-pointer"
            >
              Save
            </a>
          </div>
        )}
      </div>

      {isRecording && (
        <div>
          <div className="text-2xl font-mono text-blue-600 mb-4">
            {formatTime(recordingTime)}
          </div>
        </div>
      )}

      {alertMessage != "" && (
        <div className="mt-4 mb-3 p-4 bg-green-100 border border-green-400 rounded-md flex justify-between">
          <p className="text-green-700">{alertMessage}</p>

          <button onClick={() => setAlertMessage("")}>
            <IoIosClose size={20} />
          </button>
        </div>
      )}

      {preparingTranscription && (
        <div className="mt-4 mb-3 p-4 bg-green-100 border border-green-400 rounded-md flex justify-between">
          <p className="text-green-700">Preparing transcription...</p>

          <button onClick={() => setPreparingTranscription(false)}>
            <IoIosClose size={20} />
          </button>
        </div>
      )}

      {meetingId != "" && !recordingFinished && !preparingTranscription && (
        <div className="flex gap-3">
          <button
            onClick={handleStartPause}
            className="py-2 px-4 rounded-md text-blue-800 bg-white border-2 border-blue-800 hover:bg-opacity-80 transition-colors cursor-pointer"
          >
            {status}
          </button>

          {isRecording && audioBlob && (
            <button
              onClick={handleFinish}
              className={`py-2 px-4 rounded-md text-white bg-blue-800 hover:bg-opacity-80 transition-colors cursor-pointer`}
            >
              FINISH
            </button>
          )}
        </div>
      )}

      {recordingFinished && (
        <div>
          <button
            onClick={handleRedirect}
            className={`py-2 px-4 rounded-md text-white bg-blue-800 hover:bg-opacity-80 transition-colors cursor-pointer`}
          >
            View Report
          </button>
        </div>
      )}
    </div>
  );
};

export default MeetingRecorder;
