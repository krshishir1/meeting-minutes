import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import {MeetingResult} from "@/utils/types";
import {
  ExternalLink,
  Flag,
  LetterText,
  Link2,
  Pencil,
  SquarePen,
  ThumbsUp,
} from "lucide-react";



  type RelevantLink = {
    URL: string;
    description: string;
  };
  type MeetingSummaryProps = {
    result: MeetingResult;
  };

export function MeetingSummary({ result }: MeetingSummaryProps) {
  return (
    <div className="space-y-8">
      <section>
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle>
              <div className="p-2 rounded-full w-15 h-15 flex justify-center items-center mb-2">
                <LetterText className="" />
              </div>
              <h2 className="text-xl font-semibold">Summary</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p>{result?.summary || "No summary available"}</p>
          </CardContent>
        </Card>
      </section>

      <section className="flex gap-8 flex-wrap justify-center my-10">
        {/* Decisions Card */}
        <Card className="w-110 shadow-lg bg-gradient-to-tl from-white">
          <CardHeader>
            <CardTitle>
              <div className="p-2 rounded-full w-15 h-15 flex justify-center items-center mb-2">
                <Flag />
              </div>
              <h2 className="text-xl font-semibold">Decisions</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result?.decisions?.length > 0 ? (
              <ul className="list-disc px-2 grid gap-2">
                {result.decisions.map((item: string, idx: number) => (
                  <li key={idx} className="flex items-center mb-2">
                    <ThumbsUp width={30} />
                    <span className="ml-2">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No important Decisions today</div>
            )}
          </CardContent>
        </Card>

        {/* Action Items Card */}
        <Card className="w-110 shadow-lg bg-gradient-to-b from-white">
          <CardHeader>
            <CardTitle>
              <div className="p-2 rounded-full w-15 h-15 flex justify-center items-center mb-2">
                <Pencil />
              </div>
              <h2 className="text-xl font-semibold">Action Items</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result?.action_items?.length > 0 ? (
              <ul className="list-none px-2 grid gap-2">
                {result.action_items.map((item: string, idx: number) => (
                  <li key={idx} className="flex gap-2 text-left mb-2">
                    <SquarePen width={30} />
                    <span className="ml-2">{item}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No important Action Items today</div>
            )}
          </CardContent>
        </Card>

        {/* Relevant Links Card */}
        <Card className="w-110 shadow-lg bg-gradient-to-tl from-white">
          <CardHeader>
            <CardTitle>
              <div className="p-2 rounded-full w-15 h-15 flex justify-center items-center mb-2">
                <Link2 />
              </div>
              <h2 className="text-xl font-semibold">Relevant Links</h2>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {result?.relevant_links?.length > 0 ? (
              <ul className="pl-5 list-none px-2 grid gap-2">
                {result.relevant_links.map((link: RelevantLink, idx: number) => (
                  <li key={idx} className="flex gap-2 items-center mb-2 h-4">
                    <ExternalLink width={18} />
                    <Link
                      href={link.URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="no-underline hover:underline text-blue-500"
                    >
                      {link.description}
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <div>No Links shared today</div>
            )}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
