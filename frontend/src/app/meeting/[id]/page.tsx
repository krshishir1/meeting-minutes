
"use client";

import { useState } from "react";
import { MeetingTranscript } from "@/components/common/meetingTranscript";
import { MeetingSummary } from './../../../components/common/meetingSummary';
import { mockDataForSummary } from "@/utils/mockData"; 
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";

// Your mock data, or replace with actual fetched data


export default function MeetingPage() {
  const [view, setView] = useState<"summary" | "transcript">("summary");

  const data = mockDataForSummary;

  return (
    <>
    <Header/>
    <div className="p-6 mx-10 space-y-6">
      <div className="flex gap-4">
        <Button
          className={`px-4 py-2 rounded ${
            view === "summary" ? "bg-primary text-white" : "bg-muted text-black hover:text-white"
          }`}
          onClick={() => setView("summary")}
        >
          Summary
        </Button>
        <Button
          className={`px-4 py-2 rounded ${
            view === "transcript" ? "bg-primary text-white" : "bg-muted text-black hover:text-white"
          }`}
          onClick={() => setView("transcript")}
        >
          Transcript
        </Button>
      </div>

      {view === "summary" ? (
        <MeetingSummary summary={data.summary} />
      ) : (
        <MeetingTranscript data={data} />
      )}
    </div>
    </>
  );
}
