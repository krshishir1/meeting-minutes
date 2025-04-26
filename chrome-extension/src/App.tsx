import { useEffect, useState } from "react";
import AudioRecorder from "./components/AudioRecorder";

import SelectProjectPage from "./components/SelectProject";
import MeetingRecorder from "./components/MeetingRecorder";

import {
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider,
  Route,
} from "react-router-dom";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      <Route index element={<SelectProjectPage />} />
      <Route path="project/:projectId" element={<MeetingRecorder />} />
      {/* <Route path="about" element={<About />} /> */}
    </Route>
  )
);

export default function App() {
  return (
    <RouterProvider router={router} />
  );
}
