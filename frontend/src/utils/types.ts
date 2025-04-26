// src/types/meeting.ts
export type VisualMoment = {
    start_time: string;
    end_time: string;
    importance: "low" | "medium" | "high";
    reason: string;
    screenshot_url: string;
    expected_visual: string;
  };
  
 export type TranscriptSegment = {
    speaker: string;
    start: string;
    end: string;
    text: string;
  };
  
  export type MeetingReport = {
    segments: TranscriptSegment[];
    visual_moments: VisualMoment[];
    results: {
      summary: string;
      decisions: string[];
      action_items: string[];
      relevant_links: {
        URL: string;
        description: string;
      }[];
    };
  };
  
export type MeetingResult = {
    summary: string;
    decisions: string[];
    action_items: string[];
    relevant_links: {
      URL: string;
      description: string;
    }[];
  };
  