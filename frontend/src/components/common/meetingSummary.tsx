// /components/meeting/MeetingSummary.tsx

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Check, CircleSmall, ExternalLink, Flag, LetterText, Link2, Pen, Pencil, SquarePen } from "lucide-react";

export function MeetingSummary({ summary }: { summary: any }) {
  return (
    <div className="space-y-4">
      <section>
        <Card className="shadow-lg bg-gradient-to-tl from-white  ">
            <CardHeader>
                <CardTitle>
                <div className="p-2 rounded-full w-15 h-15 flex justify-center items-center mb-2"><LetterText  className=""/></div>
                <h2 className="text-xl font-semibold">Summary</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>            
            <p>{summary.summary}</p>
            </CardContent>
        </Card>
      </section>

    

      <section className="flex gap-8 flex-wrap justify-center my-10">
      <Card className="w-110 shadow-lg bg-gradient-to-tl from-white  ">
        <CardHeader>
            <CardTitle>
            <div className="p-2 rounded-full  w-15 h-15 flex justify-center items-center mb-2"><Flag  className=""/></div>
            <h2 className="text-xl font-semibold">Decisions</h2>
            </CardTitle>
        </CardHeader>
        <CardContent>
        <ul className="list-disc pl-5">
          {summary.decisions.map((item: string, idx: number) => (
            <li key={idx} className="flex items-center mb-2">
                <Check width={30} className=""/>
                <span className="ml-2  w-100">{item}</span></li>
          ))}
        </ul>
        </CardContent>
        </Card>
        <Card className="w-110 shadow-lg bg-gradient-to-b from-white  ">
            <CardHeader>
            
                <CardTitle>
                <div className="p-2 rounded-full w-15 h-15 flex justify-center items-center mb-2"><Pencil  className=""/></div>
                <h2 className="text-xl font-semibold">Action Items</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
        <ul className="list-none pl-5">
          {summary.action_items.map((item: string, idx: number) => (
            <li key={idx} className="flex gap-2 text-left mb-2">
                <SquarePen width={30}/>
                <span className="ml-2  w-100">{item}</span></li>
          ))}
        </ul>
            </CardContent>
        </Card>
        <Card className="w-110 shadow-lg bg-gradient-to-tl from-white  ">
            <CardHeader>
                <CardTitle>
                <div className="p-2 rounded-full  w-15 h-15 flex justify-center items-center mb-2"><Link2  className=""/></div>
                    
                <h2 className="text-xl font-semibold">Relevant Links</h2>
                </CardTitle>
            </CardHeader>
            <CardContent>
            <ul className="pl-5 list-none">
          {summary.relevant_links.map((link: any, idx: number) => (
            <li key={idx} className="flex gap-2 items-center mb-2">
                <ExternalLink width={18}/>
              <Link
                href={link.URL}
                target="_blank"
                rel="noopener noreferrer"
                className=" underline "
              >
                {link.description}
              </Link>
            </li>
          ))}
        </ul>
            </CardContent>
        </Card>
      </section>

      
    </div>
  );
}
