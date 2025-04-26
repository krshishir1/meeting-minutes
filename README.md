
# Briefly

This is a web application designed for managing and reviewing meeting transcripts, summaries, and visual moments using AI. Users can view meeting summaries, detailed transcripts, and images from the meeting, all organized in a user-friendly interface.

## Features

- **Meeting Summary**: Displays a brief summary of the meeting, including decisions, action items, and relevant links.
- **Meeting Transcript**: Provides a detailed, timestamped transcript of the meeting with speaker information.
- **Meeting Gallery**: Showcases important images or visual moments captured during the meeting.
- **User-friendly Interface**: Easily toggle between different views (Summary, Transcript, and Gallery) with simple navigation.
- **Fetch Meeting Data**: Pulls data from a backend API and displays it to the user in real-time.
- **Chrome Extension**: Automatically saves project names and allows quick access to meeting data from the Chrome extension.
- **AI & Speech Recognition**: Gemini (for AI summarization) and Deepgram (for speech-to-text transcription)

### Key Technologies:
- **Frontend**: React, Next.js, Tailwind CSS
- **Backend**: FastAPI (Python)
- **AI & Speech Recognition**: Gemini (for AI summarization) and Deepgram (for speech-to-text transcription)
- **Database**: PostgreSQL with Prisma ORM
- **Chrome Extension**: For uploading and managing meeting data
- **Deployment**: Vercel for frontend, custom server for backend


## Getting Started

To run this project locally, follow the steps below.

### Prerequisites

- Node.js (preferably v16 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/meeting-minutes.git
   ```

2. Navigate to the project folder:
   ```bash
   cd meeting-minutes
   ```

3. Install the dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:3000` to see the application in action.


## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

