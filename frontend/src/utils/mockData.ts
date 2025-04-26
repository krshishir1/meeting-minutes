// mockData.ts (this can be in your utils or mock folder)
export const mockProjects = [
    {
      id: '1',
      name: 'Project 1',
      media: [
        { id: '1', name: 'Audio Recording 1', type: 'audio' },
        { id: '2', name: 'Video Recording 1', type: 'video' },
      ],
    },
    {
      id: '2',
      name: 'Project 2',
      media: [
        { id: '3', name: 'Audio Recording 2', type: 'audio' },
        { id: '4', name: 'Video Recording 2', type: 'video' },
      ],
    },
  ];

  
  
  export const mockMediaSummaries = [
    {id: 1,
    summary:'Summary of Audio Recording 1: This is a short summary of the audio file.'},
    {id: 2,
    summary:'Summary of Video Recording 1: This is a short summary of the video file.'},
    {id: 3, summary: 'Summary of Audio Recording 2: Another audio summary.'},
    {id: 4, summary: 'Summary of Video  Recording 2: Another video summary.'},      
  ]


  export const mockDataForSummary = {
    "segments": [
      {
        "speaker": "Speaker 1",
        "start": "0:00:02",
        "end": "0:00:08",
        "text": "Hello everyone, thank you for joining this project kickoff meeting. I'm excited to discuss our new mobile app development initiative."
      },
      {
        "speaker": "Speaker 1",
        "start": "0:00:09",
        "end": "0:00:15",
        "text": "Before we dive in, let's quickly go around and introduce ourselves. I'm Alex, the product manager for this project."
      },
      {
        "speaker": "Speaker 2",
        "start": "0:00:16",
        "end": "0:00:23",
        "text": "Hi team, I'm Jamie from the UX design department. I'll be leading the user experience aspects of the app and working closely with the development team."
      },
      {
        "speaker": "Speaker 3",
        "start": "0:00:24",
        "end": "0:00:30",
        "text": "Hello, I'm Taylor, the lead developer. My team will be responsible for the technical implementation of the app."
      },
      {
        "speaker": "Speaker 1",
        "start": "0:00:32",
        "end": "0:00:45",
        "text": "Great! Now let's talk about our timeline. We need to launch the MVP by March 15th, which gives us approximately 8 weeks of development time."
      },
      {
        "speaker": "Speaker 2",
        "start": "0:00:46",
        "end": "0:01:02",
        "text": "That seems achievable. I've prepared some initial wireframes which I'll share with everyone after this call. If you could review them by Thursday and provide feedback, that would be great."
      },
      {
        "speaker": "Speaker 3",
        "start": "0:01:03",
        "end": "0:01:15",
        "text": "I think we should consider using React Native for this project since we want to target both iOS and Android. This would save us significant development time compared to building separate native apps."
      },
      {
        "speaker": "Speaker 1",
        "start": "0:01:16",
        "end": "0:01:30",
        "text": "That's a good suggestion, Taylor. Let's plan to use React Native then. For the backend, we'll use our existing API infrastructure, but we'll need to add a few new endpoints. Can your team handle that as well?"
      },
      {
        "speaker": "Speaker 3",
        "start": "0:01:31",
        "end": "0:01:43",
        "text": "Yes, we can do that. I'd also recommend we use AWS for hosting since we already have experience with their services. We'll need to budget for those cloud costs though."
      },
      {
        "speaker": "Speaker 1",
        "start": "0:01:44",
        "end": "0:02:01",
        "text": "Understood. I'll update the budget for AWS costs. Also, please check out docs.aws.amazon.com/amplify for some helpful resources on integrating React Native with AWS services."
      },
      {
        "speaker": "Speaker 2",
        "start": "0:02:02",
        "end": "0:02:24",
        "text": "One more thing about the design - I've been researching accessibility standards, and we should ensure our app meets WCAG 2.1 guidelines. There's a great resource at w3.org/WAI/standards-guidelines that we should all review."
      },
      {
        "speaker": "Speaker 1",
        "start": "0:02:25",
        "end": "0:02:50",
        "text": "Excellent point about accessibility, Jamie. Let's make that a requirement. To summarize our next steps: Jamie will share wireframes by end of day, everyone reviews them by Thursday, and Taylor's team will start setting up the React Native project structure and AWS integration next week."
      }
    ],
    "summary": {
      "summary": "This meeting was a project kickoff for a new mobile app development initiative. Alex (product manager), Jamie (UX design lead), and Taylor (lead developer) discussed the project timeline, technology stack, and next steps. They agreed to launch an MVP by March 15th (in 8 weeks), use React Native to target both iOS and Android platforms, utilize existing API infrastructure with some new endpoints, and host on AWS. Jamie will share wireframes for review by Thursday, and Taylor's team will begin technical setup next week. They also emphasized the importance of meeting WCAG 2.1 accessibility guidelines.",
      "decisions": [
        "Use React Native framework for cross-platform development",
        "Leverage existing API infrastructure with some new endpoints",
        "Host the application on AWS",
        "Ensure WCAG 2.1 accessibility compliance",
        "Launch MVP by March 15th (8 weeks timeline)"
      ],
      "action_items": [
        "Jamie to share wireframes by end of day",
        "Team to review wireframes by Thursday",
        "Taylor's team to set up React Native project structure next week",
        "Taylor's team to begin AWS integration next week",
        "Alex to update budget for AWS costs",
        "All team members to review accessibility guidelines"
      ],
      "relevant_links": [
        {
          "description": "AWS Amplify documentation for React Native",
          "URL": "https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html"
        },
        {
          "description": "WCAG 2.1 Accessibility Guidelines",
          "URL": "https://www.w3.org/WAI/standards-guidelines/wcag/"
        }
      ]
    },
    "success": true,
    "message": "Transcription and Summarization completed successfully"
  }
    