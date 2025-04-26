
"use client";

import { useEffect, useState } from "react";
import { MeetingTranscript } from "@/components/common/meetingTranscript";
import { MeetingSummary } from './../../../components/common/meetingSummary';
import { mockDataForSummary } from "@/utils/mockData"; 
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import Images from "@/components/common/Images";
import { AudioLines, GalleryHorizontal, Text } from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";

export interface Meeting {
    _id: string;
    title: string;
    date: string;
    transcriptText?: string;
    summary?: string;
    decisions?: string[];
    actionItems?: string[];
    audioUrl?: string;
  }
  


export default function MeetingPage() {
  const [view, setView] = useState<"summary" | "transcript" | "image">("summary");

  const { id: meetingId } = useParams();
  const [meeting, setMeeting] = useState(null);

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const res = await axios.get("http://localhost:4000/api/meetings/"+meetingId);
        const projects = res.data.projects;

        for (const project of projects) {
            const found = project.meetings.find((m: Meeting) => m._id === meetingId);
            if (found) {
              setMeeting(found);
              break;
            }
          }
          

        if (!meeting) console.warn("Meeting not found");

      } catch (err) {
        console.error("Error fetching meeting:", err);
      }
    };

    fetchMeeting();
  }, [meetingId]);
// meeting ||
  const data =  mockDataForSummary;
  return (
    <>
    <Header/>
    <div className="p-6 mx-10 space-y-6">
      <div className="flex gap-4">
        <Button
          className={`px-4 py-2 rounded ${
            view === "summary" ? "bg-orange-600 text-white" : " text-black hover:text-white hover:bg-orange-700 bg-muted"
          }`}
          onClick={() => setView("summary")}
        >
         <Text/> Summary
        </Button>
        <Button
          className={`px-4 py-2 rounded ${
            view === "transcript" ? "bg-orange-600 text-white" : "hover:bg-orange-700 bg-muted text-black hover:text-white"
          }`}
          onClick={() => setView("transcript")}
        >
          <AudioLines/>Transcript
        </Button>
        <Button
          className={`px-4 py-2 rounded ${
            view === "image" ? "bg-orange-600 text-white" : "hover:bg-orange-700 bg-muted text-black hover:text-white"
          }`}
          onClick={() => setView("image")}
        >
          <GalleryHorizontal/>Gallery
        </Button>
      </div>

      {view === "summary" ? (
        <MeetingSummary summary={data.summary} />
      ) : view=="transcript"?(
        <MeetingTranscript data={data} />
      ):(
        <Images data={data.visual_moments}/>
      )}
    </div>
    </>
  );
}
