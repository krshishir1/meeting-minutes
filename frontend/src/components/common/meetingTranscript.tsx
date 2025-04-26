// /components/meeting/MeetingTranscript.tsx

import { Captions } from "lucide-react";
import React from "react";

const bgColors = [
    "bg-red-100",
    "bg-green-100",
    "bg-orange-100",
    "bg-orange-100",
    "bg-pink-100",
    "bg-yellow-100",
    "bg-indigo-100",
    "bg-teal-100",
  ];
  
  function getColor(name: string) {
    const hash = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return bgColors[hash % bgColors.length];
  }

  function getInitials(name: string) {
    const names = name.trim().split(" ");
    if (names.length === 1) {
      return names[0][0].toUpperCase();
    }
    return (names[0][0] + names[names.length - 1][0]).toUpperCase();
  }
  

export function MeetingTranscript({ data }: { data: any }) {
  return (
    <div className="space-y-8">

      <section className="my-10">
        
        <div className="space-y-4 rounded-xl p-4 shadow-lg border">
        {/* <div className="p-2 rounded-full w-15 h-15 flex justify-center items-center mb-2"></div> */}
        <h2 className="text-3xl font-semibold my-6 mx-2 scroll flex justify-start items-center gap-2"><Captions  className=""/> <span>Meeting Transcript</span></h2>
          <div className="px-12 py-4">
          {data.segments.map((seg: any, idx: number) => (
            <div
              key={idx}
              className="px-4 py-2 mb-2"
            >
              <div className="font-semibold flex justify-between items-center mb-2">
                <div className="flex gap-2 items-center ">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center ${getColor(seg.speaker)}`}>

{getInitials(seg.speaker)}
</span>
                    <span>{seg.speaker}</span></div>  <span>{seg.start} - {seg.end}</span>
              </div>
              <p className="mt-1 text-gray-600 font-semibold">{seg.text}</p>
            </div>
          ))}
          </div>
        </div>
      </section>
    </div>
  );
}
