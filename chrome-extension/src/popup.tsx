// import React from 'react';
import { createRoot } from "react-dom/client";
import "./index.css";

import SelectProjectPage from "./components/SelectProject";
import MeetingRecorder from "./components/MeetingRecorder";

import { HashRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const injectMicrophonePermissionIframe = () => {
  const iframe = document.createElement("iframe");
  iframe.setAttribute("hidden", "hidden");
  iframe.setAttribute("id", "permissionsIFrame");
  iframe.setAttribute("allow", "microphone");
  iframe.src = chrome.runtime.getURL("/src/permission/index.html");
  document.body.appendChild(iframe);
};

const App = () => {

    const [currentProjectId, setCurrentProjectId] = useState<string>("");
    // const navigate = useNavigate();


  

  return (
    <div style={{ width: 350, height: 500 }} className="px-2 pt-4 pb-10">
      <HashRouter>
        <Routes>
          <Route path="/" element={<SelectProjectPage />} />
          <Route path="project/:projectId" element={<MeetingRecorder />} />
        </Routes>
      </HashRouter>
    </div>
  );
};

createRoot(document.getElementById("root")!).render(<App />);
injectMicrophonePermissionIframe();
