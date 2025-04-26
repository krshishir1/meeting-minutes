

'use client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/common/header';
import {Button} from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookmarkPlus, ScrollText, Sparkles } from 'lucide-react';
import { motion } from 'motion/react';

const features = [
  {
    id: 1,
    Component: () => <BookmarkPlus/>,
    title: 'Add the free Briefly Chrome extension',
    description: "Get started in seconds. Add Briefly Chrome extension. Connect your Google, Microsoft Teams or Zoom account. Start an instant meeting or join your next one to view automatic transcription.",
    image: '/hero.jpeg',
  },
  {
    id: 2,
    Component: () => <ScrollText/>,
    title: 'Get Instant AI Meeting Summaries for Google Meet',
    description: "Experience seamless AI meeting summaries for Google Meet. Install Briefly, and watch as it transcribes and highlights key points in real-time.",
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
  const router = useRouter();
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
    <Button className="p-4 py-6 w-fit bg-orange-500 text-white rounded-lg shadow-lg hover:bg-orange-600" onClick={()=>router.push("/dashboard")}>
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

      <section className='my-10 px-20 pt-2 pb-10 '>
        <div className='flex flex-col  justify-center gap-2 my-10 '>
        <p className=' text-orange-600'>Get started in seconds!</p>
        <h1 className='text-3xl font-semibold'>Boost productivity with Briefly&apos; AI Meeting Summary for Google Meet</h1>
        <p>Simply add the Briefly Chrome Extension and get started</p>
        </div>
        <div className='flex items-center justify-center gap-8 flex-wrap '>
        {features.map((feature, index)=>(
          <motion.div
          key={feature.id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2, duration: 0.5, ease: "easeOut" }}
          whileHover={{ scale: 1.05 }}
        >
          <Card className="w-100 h-150 relative bg-orange-100 shadow-md hover:shadow-xl transition-shadow duration-300">
            <CardHeader>
              <CardTitle>
                {feature.Component()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <h1 className="text-lg font-semibold mb-2">{feature.title}</h1>
              <p className="my-8">{feature.description}</p>
              <Link href="/" className="font-semibold underline mb-10">
                Add to Chrome for free
              </Link>
              <Image
                src={feature.image}
                width={300}
                height={300}
                alt="feature image"
                className="absolute bottom-0 right-0 rounded-lg"
              />
            </CardContent>
          </Card>
        </motion.div>
        ))}
        </div>
      </section>

      
      <section className="mt-10 mx-20 flex justify-between items-center gap-4">
  <motion.div
    className="flex flex-col justify-center gap-2 my-10 max-w-lg"
    initial={{ x: -100, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    viewport={{ once: false, amount: 0.2 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <p className="text-orange-600">In meeting experience</p>
    <h1 className="text-4xl font-semibold">Real-Time Google Meet AI Summaries</h1>
    <p className="text-gray-600">
      Get instant summaries during your Google Meet sessions. Briefly&apos; AI captures key points and action items, so you stay focused on the conversation.
    </p>
    <Button className="w-fit p-4 my-6 bg-white text-black border">Add to Chrome for free</Button>
  </motion.div>

  <motion.div
    initial={{ x: 100, opacity: 0 }}
    whileInView={{ x: 0, opacity: 1 }}
    viewport={{ once: false, amount:0.2 }}
    transition={{ duration: 0.6, ease: 'easeOut' }}
  >
    <Image src="/hero.jpeg" alt="logo" width={500} height={500} />
  </motion.div>
</section>


<section
      className=' '
    >
      <motion.div className="flex justify-between items-center gap-4 py-20 px-20" initial={{ opacity: 0, x: 90 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: false, amount:0.2 }}>

      <Image
        src='/hero.jpeg'
        alt='AI Summary'
        width={500}
        height={500}
        className='rounded-lg shadow-lg w-full max-w-md md:w-1/2 lg:max-w-lg object-cover'
      />

      <div className='flex flex-col justify-center gap-4 max-w-lg'>
        <p className='text-orange-400 font-medium'>Take the next step with AI</p>
        <h1 className='text-4xl font-bold'>Custom AI Summaries for Google Meet</h1>
        <p className='text-gray-600'>
          Use Briefly to tailor meeting summaries, extract tasks, and dive deeper into your calls with custom prompts — all in real-time.
        </p>
        <Button className='w-fit p-4 my-6 bg-orange-500 hover:bg-orange-600 text-white rounded-md'>
          Add to Chrome for free
        </Button>
      </div>
      </motion.div>
      
    </section>

    </>
  );
} 

// Inside: app/project/[id]/media/[mediaId]/page.tsx


