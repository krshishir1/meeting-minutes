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
        "speaker": "Speaker 0",
        "start": "0:00:04.080000",
        "end": "0:00:13.940000",
        "text": "Our third finalist is Emily Johnston from the School of Pharmacy and Medical Sciences. Her presentation title is Mosquito Research Saving Lives with Pantyhose, and Paperclips."
      },
      {
        "speaker": "Speaker 1",
        "start": "0:00:24.485000",
        "end": "0:03:11.825000",
        "text": "I came to Australia to study the deadliest animal in the world. Now there may be some Australian audience members thinking, Struth, science has finally recognized the importance of the drop bears. But I'm not studying drop bears because around the world, by transmitting diseases like malaria and dengue fever, mosquitoes kill more than a million people every year, making them the deadliest animal on the planet. Now, in Australia, the most common mosquito borne disease is Ross River virus and it occurs at high rates in some areas but not others. My question is why? What is it about certain areas that makes them breed disease? If we can understand the environmental factors that contribute to disease transmission, then we can alter the environment or target our control efforts to prevent human infections. But to answer that question, I had to find out where the infected mosquitoes were in South Australia. And traditionally, testing mosquitoes for virus has always been difficult. So I used a new technique. It takes these cards, which are embedded with virus preserving chemicals, and coats them in honey. Mosquitoes will come to feed on the honey and in the process, spit virus onto the card where it can later be detected. Now, no one had ever used this technique in a broad scale virus survey before, so I had to adapt it. I developed new traps, and set them at over a hundred field sites across South Australia. And I captured over 20,000 hungry mosquitoes and let them feed on the card for a week before testing the cards for virus. Now, you may not think that these traps look very impressive, but science doesn't have to be beautiful, it has to be effective. And these traps are proving to be our most sensitive method of detecting infected mosquitoes. I found three types of infection: Ross River virus, Varmer Forest virus, and Stratford virus, which has never before been found in South Australia. I now have the virus data I need to conduct my analysis and I'm collecting publicly available data about the environment surrounding my traps, like the density of human housing, the biodiversity of mammals and the ratio of green space to buildings, to see if any of those environmental factors can link, these virus hotspots that I've shown here. But the most exciting part of my research so far has been the success of this method. Public health officials in Victoria, Queensland, and Western Australia have been in contact with us about implementing this technique for their surveillance next year. And I developed these traps on a tight budget. I used recycled milk cartons, pantyhose and paperclips to make the traps. Each trap costs less than a dollar and can be reused for the whole season. That was important to me because the majority of mosquito borne disease risk happens in economically impoverished countries. In India, for example, where about a quarter of the population lives on a dollar a day, there are thirty three million cases of dengue infection every year. With my low budget virus surveillance and spatial analysis method, I can help any country regardless of resources find out where their deadliest animals occur, why they're there, and how we can stop them from infecting humans. Thanks."
      }
    ],
    "summary": {
      "summary": "Emily Johnston from the School of Pharmacy and Medical Sciences presented her research on mosquito-borne diseases in Australia, specifically Ross River virus. She developed a cost-effective method for detecting infected mosquitoes using virus-preserving cards coated in honey and deployed in traps made from recycled materials like milk cartons, pantyhose, and paperclips. She surveyed over 100 field sites in South Australia, capturing 20,000 mosquitoes. Her research identified three types of infection, including Stratford virus, which had never been found in South Australia. She is now analyzing the virus data with environmental data (human housing density, mammal biodiversity, green space ratio) to identify factors contributing to disease transmission. Her cost-effective method has garnered interest from public health officials in other Australian states (Victoria, Queensland, and Western Australia) who plan to implement it for their surveillance programs. Her research aims to help countries with limited resources to track and prevent mosquito-borne diseases.",
      "decisions": [],
      "action_items": [
        "Continue analysis of virus data with environmental data to identify environmental factors contributing to virus hotspots.",
        "Assist public health officials in Victoria, Queensland, and Western Australia with implementing the mosquito surveillance technique."
      ],
      "relevant_links": [
        {
          "description": "Information on Ross River virus",
          "URL": "https://www.health.gov.au/topics/ross-river-virus"
        },
        {
          "description": "Information on Dengue Fever",
          "URL": "https://www.who.int/news-room/fact-sheets/detail/dengue-and-severe-dengue"
        },
        {
          "description": "Information on Malaria",
          "URL": "https://www.who.int/news-room/fact-sheets/detail/malaria"
        }
      ]
    },
    "visual_moments": [
      {
        "start_time": "00:00:24",
        "end_time": "00:00:32",
        "importance": "low",
        "reason": "Speaker refers to the drop bear, an Australian mythical creature. Visual context would help non-Australian audience members understand the humorous reference.",
        "expected_visual": "A humorous image or caricature of a drop bear.",
        "screenshot_url": "https://minutes-video-bucket.s3.amazonaws.com/screenshots/screenshot_20250425220623_81bc42d5-9f71-4947-96ea-4f9120204bc4.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4MTWG44HSN6JQPXS%2F20250425%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250425T220623Z&X-Amz-Expires=7200&X-Amz-SignedHeaders=host&X-Amz-Signature=fc176f6268b6465fd07443ef33a0879a2b6adabe920ca88f32bb9ddcb7cc6e6c"
      },
      {
        "start_time": "00:00:56",
        "end_time": "00:01:03",
        "importance": "high",
        "reason": "The speaker describes cards used for virus detection and how mosquitoes interact with them. Visual context is important to understand the mechanism.",
        "expected_visual": "Close-up of the card, possibly with honey applied. An illustration or video showing a mosquito feeding on the card and depositing the virus.",
        "screenshot_url": "https://minutes-video-bucket.s3.amazonaws.com/screenshots/screenshot_20250425220623_9e98a34e-88e4-459e-b543-ae14365df95e.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4MTWG44HSN6JQPXS%2F20250425%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250425T220623Z&X-Amz-Expires=7200&X-Amz-SignedHeaders=host&X-Amz-Signature=f5a0e13028d530d425dd2fffc65d50b4750edc6988a2d24d558009bcff3db90b"
      },
      {
        "start_time": "00:01:10",
        "end_time": "00:01:21",
        "importance": "high",
        "reason": "The speaker mentions developing new traps and setting them across South Australia. It would be beneficial to see the traps deployed in the field.",
        "expected_visual": "Images or video of the traps deployed in various field locations across South Australia. Possibly a map showing trap locations.",
        "screenshot_url": "https://minutes-video-bucket.s3.amazonaws.com/screenshots/screenshot_20250425220623_a921eba7-e5c4-4041-977b-29c6bab5fff0.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4MTWG44HSN6JQPXS%2F20250425%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250425T220623Z&X-Amz-Expires=7200&X-Amz-SignedHeaders=host&X-Amz-Signature=be11861c3738ccb8199e1ae4a0673e170372b4394df62696deab8c564e60e27b"
      },
      {
        "start_time": "00:01:25",
        "end_time": "00:01:29",
        "importance": "medium",
        "reason": "The speaker describes the traps as not looking impressive, but being effective. A visual would allow the audience to judge.",
        "expected_visual": "A clear image of the mosquito traps themselves.",
        "screenshot_url": "https://minutes-video-bucket.s3.amazonaws.com/screenshots/screenshot_20250425220623_0513afc6-8d4b-436e-905e-7e9580686506.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4MTWG44HSN6JQPXS%2F20250425%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250425T220623Z&X-Amz-Expires=7200&X-Amz-SignedHeaders=host&X-Amz-Signature=5450e1e474cfb6e893e4fc30eae445b20abe811fb07c6b29855a512af35583e9"
      },
      {
        "start_time": "00:01:44",
        "end_time": "00:01:47",
        "importance": "medium",
        "reason": "Speaker mentions 'virus hotspots I've shown here', indicating a visual representation of data.",
        "expected_visual": "A map or chart illustrating the distribution of virus hotspots.",
        "screenshot_url": "https://minutes-video-bucket.s3.amazonaws.com/screenshots/screenshot_20250425220623_af4d7a9c-d028-4256-a019-fa9fbf53a11f.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4MTWG44HSN6JQPXS%2F20250425%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250425T220624Z&X-Amz-Expires=7200&X-Amz-SignedHeaders=host&X-Amz-Signature=13e3151fe4689967ec8ec573125f366d0388a18a79786ec4186b08e2f428d654"
      },
      {
        "start_time": "00:02:08",
        "end_time": "00:02:13",
        "importance": "high",
        "reason": "The speaker lists the materials used to create the traps (recycled milk cartons, pantyhose, paperclips). A visual is crucial to understanding the low-budget construction and ingenious design of the trap.",
        "expected_visual": "A detailed visual or diagram showing the components of the mosquito trap, potentially showing how they are assembled. A picture of the finished trap.",
        "screenshot_url": "https://minutes-video-bucket.s3.amazonaws.com/screenshots/screenshot_20250425220624_adb052eb-9c1b-430b-9c4c-19a1e17edd51.jpg?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIA4MTWG44HSN6JQPXS%2F20250425%2Fap-south-1%2Fs3%2Faws4_request&X-Amz-Date=20250425T220624Z&X-Amz-Expires=7200&X-Amz-SignedHeaders=host&X-Amz-Signature=97b320b059ce494f938ff06e466fc362cd17c27058faa3c0c7826eab8729ff2d"
      }
    ],
    "success": true,
    "message": "Transcription and summarization completed successfully"
  }
    