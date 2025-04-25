// /components/meeting/MeetingTranscript.tsx

import { Captions } from "lucide-react";
import React from "react";


export function MeetingTranscript({ data }: { data: any }) {
  return (
    <div className="space-y-8">

      <section className="my-10">
        
        <div className="space-y-4 rounded-xl p-4 shadow-lg border">
        {/* <div className="p-2 rounded-full w-15 h-15 flex justify-center items-center mb-2"></div> */}
        <h2 className="text-3xl font-semibold my-6 mx-2 scroll flex justify-start items-center gap-2"><Captions  className=""/> <span>Transcript</span></h2>
          {data.segments.map((seg: any, idx: number) => (
            <div
              key={idx}
              className="px-4 py-2"
            >
              <div className="font-semibold flex justify-between items-center mb-2">
                <span>{seg.speaker}</span>  <span>{seg.start} - {seg.end}</span>
              </div>
              <p className="mt-1">{seg.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
