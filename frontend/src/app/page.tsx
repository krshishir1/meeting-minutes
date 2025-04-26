/* Landing Page: app/page.tsx */

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { mockProjects } from '@/utils/mockData';
import Image from 'next/image';
import Header from '@/components/common/header';
import {Button} from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookmarkPlus, ScrollText, Sparkles } from 'lucide-react';


type Project = {
  id: string;
  name: string;
  media: {
    id: string;
    name: string;
    type: string;
  }[];
};


const features = [
  {
    id: 1,
    Component: () => <BookmarkPlus/>,
    title: 'Add the free Tactiq Chrome extension',
    description: "Get started in seconds. Add Tactiq Chrome extension. Connect your Google, Microsoft Teams or Zoom account. Start an instant meeting or join your next one to view automatic transcription.",
    image: '/hero.jpeg',
  },
  {
    id: 2,
    Component: () => <ScrollText/>,
    title: 'Get Instant AI Meeting Summaries for Google Meet',
    description: "Experience seamless AI meeting summaries for Google Meet. Install Tactiq, and watch as it transcribes and highlights key points in real-time.",
    image: '/hero.jpeg',
  },
  {
    id: 3,
    Component: () => <Sparkles/>,
    title: 'Generate meeting insights using AI',
    description: "Use quick AI prompts to generate a meeting summary, action items, bullet point highlights, and more. You can dive deeper by asking specific questions using AI.",
    image: '/hero.jpeg',
  }
]

export default function HomePage() {
  const [projectName, setProjectName] = useState('');
  const [projects, setProjects] = useState<Project[]>([]);
  const router = useRouter();

  useEffect(() => {
    setProjects(mockProjects)
  }, []);

  const handleProjectSubmit = () => {
    if (!projectName.trim()) return;
    // Save project name for extension (optional: localStorage or postMessage)
    localStorage.setItem('currentProjectName', projectName);
  };

  return (
    <>
      <Header/>
      <section className="px-4 my-20 flex items-center justify-between max-w-7xl mx-auto ">
  <div className="flex flex-col gap-4 max-w-lg">
    <h1 className="text-5xl font-semibold leading-tight">
      AI Meeting Summary for Google Meet
    </h1>
    <p className="text-lg text-gray-600">
      Get Real-Time Transcription, One-Click AI Meeting Summaries, and Custom AI Actions — Put Your Meeting Notes to Work
    </p>
    <Button className="p-4 py-6 w-fit bg-purple-500 text-white rounded-lg shadow-lg hover:bg-purple-600" onClick={()=>router.push("/dashboard")}>
      Go to Dashboard
    </Button>
  </div>
  <Image
    src="/hero.jpeg"
    width={500}
    height={500}
    alt="hero"
    className="rounded-lg shadow-lg"
  />
</section>

      <section className='my-10 mx-20'>
        <div className='flex flex-col  justify-center gap-2 my-10 '>
        <p className=' text-blue-600'>Get started in seconds!</p>
        <h1 className='text-3xl font-semibold'>Boost productivity with Briefly's AI Meeting Summary for Google Meet</h1>
        <p>Simply add the Briefly Chrome Extension and get started</p>
        </div>
        <div className='flex items-center justify-center gap-4 '>
        {features.map((feature)=>(
          <Card key={feature.id} className='w-110 h-150 relative bg-gray-100'>
            <CardHeader>
              <CardTitle>
                {feature.Component()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h1 className='text-lg font-semibold mb-2'>
                {feature.title}
              </h1>
              <p className='my-8'>{feature.description}</p>
              <Link href='/' className='font-semibold underline mb-10'>
              Add to Chrome for free
              </Link>
              <Image src={feature.image} width={300} height={300} alt="feature image" className='absolute bottom-0 right-0 rounded-lg'/>
            </CardContent>
          </Card>
        ))}
        </div>
      </section>

      
      <section className='my-30 mx-20 flex justify-between items-center gap-4'>
      <div className='flex flex-col  justify-center gap-2 my-10 max-w-lg'>
        <p className=' text-blue-600'>In meeting experience</p>
        <h1 className='text-4xl font-semibold'>Real-Time Google Meet AI Summaries</h1>
        <p className='text-gray-600'>Get instant summaries during your Google Meet sessions. Tactiq's AI captures key points and action items, so you stay focused on the conversation.</p>
        <Button className='w-fit p-4 my-6 bg-white text-black border'>Add to Chrome for free</Button>
        </div>
        <Image src='/hero.jpeg' alt='logo' width={500} height={500}/>
      </section>

      <section className='my-30 mx-20 flex justify-between items-center gap-4'>
      <div className='flex flex-col  justify-center gap-2 my-10 max-w-lg'>
        <p className=' text-blue-600'>Take the next step with AI</p>
        <h1 className='text-4xl font-semibold'>Custom AI Summaries for Google Meet</h1>
        <p className='text-gray-600'>Get instant summaries during your Google Meet sessions. Tactiq's AI captures key points and action items, so you stay focused on the conversation.</p>
        <Button className='w-fit p-4 my-6 bg-white text-black border'>Add to Chrome for free</Button>
        </div>
        <Image src='/hero.jpeg' alt='logo' width={500} height={500}/>
      </section>

    </>
  );
} 

// Inside: app/project/[id]/media/[mediaId]/page.tsx


