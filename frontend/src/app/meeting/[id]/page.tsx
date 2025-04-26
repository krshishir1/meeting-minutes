
"use client";

import { useEffect, useState } from "react";
import { MeetingTranscript } from "@/components/common/meetingTranscript";
import { MeetingSummary } from './../../../components/common/meetingSummary';
import Header from "@/components/common/header";
import { Button } from "@/components/ui/button";
import Images from "@/components/common/Images";
import { AudioLines, GalleryHorizontal, Text } from "lucide-react";
import axios from "axios";
import { useParams } from "next/navigation";
import { MeetingReport } from "@/utils/types";
import { mockDataForSummary } from "@/utils/mockData";


export default function MeetingPage() {
  const [view, setView] = useState<"summary" | "transcript" | "image">("summary");
  const [report, setReport] = useState<MeetingReport | null>(null);
  const [error, setError] = useState("");
  const params = useParams() as { id: string };

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        console.log("running")
        const response = await axios.get(
          `http://localhost:4000/api/meetings/${params.id}`
        );
        setReport(response.data.report);
        
      } catch (err) {
  if (err instanceof Error) {
    setError(err.message);
  } else {
    setError("Failed to fetch meeting");
  }
}
    };

    console.log(params)

    if (params?.id) {
      fetchMeetingData();
    }
  }, [params]);

  const data =  mockDataForSummary;
  const resultNew = mockDataForSummary
//   if(error){
//     return(
//         <div>failed to fetch transcript</div>
//     )
//   }
 
// meeting ||
const result = report?.results || {
    summary: "",
    decisions: [],
    action_items: [],
    relevant_links: []
  };
  
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

    {view === "summary" && <MeetingSummary result={data.summary} />}
    {view === "transcript"  && <MeetingTranscript data={data} />}
        {view === "image" && <Images data={data} />}
    </div>
    </>
  );
}
