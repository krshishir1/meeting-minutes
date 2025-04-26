"use client";

import Header from "@/components/common/header";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
type Project = {
    _id: number;
    name: string;
    description: string;
    meetings: { _id: string; title: string; type: string }[];
  };

export default function Dashboard() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);


  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/projects");
        setProjects(response.data.projects);
        if(projects.length === 0) {
          console.log("no projects")

        }
      } catch (error) {
        console.log("Error fetching projects:", error);
        // setProjects(mockProjects)
      }
    };    
    fetchProjects();
  }, []);

  
  const handleCreateProject = async () => {
    if (name.trim() && description.trim()) {
      try {
        const newProject = {name, description};
        const response = await axios.post("http://localhost:4000/api/projects", newProject);
        setProjects((prevProjects) => [...prevProjects, response.data]);
        setName("");
        setDescription("");
        setIsModalOpen(false);
      } catch (error) {        
        console.log("Error creating project:", error);
      }
    }
  };


  const mockProjects = [
    {
        id: 1,
        title: "Project 1",
        description: "Description for project 1",
        meetings: [
            { id: "1", name: "Meeting 1", type: "audio" },
            { id: "2", name: "Meeting 2", type: "video" },
        ]
    },
    {
        id: 2,
        title: "Project 2",
        description: "Description for project 2",
        meetings: [
            { id: "3", name: "Meeting 3", type: "image" },
            { id: "4", name: "Meeting 4", type: "document" },
        ]
    },{
        id: 3,
        title: "Project 1",
        description: "Description for project 1",
        meetings: [
            { id: "1", name: "Meeting 1", type: "audio" },
            { id: "2", name: "Meeting 2", type: "video" },
        ]
    },{
        id: 4,
        title: "Project 1",
        description: "Description for project 1",
        meetings: [
            { id: "1", name: "Meeting 1", type: "audio" },
            { id: "2", name: "Meeting 2", type: "video" },
        ]
    },
  ]

  return (
    <>
    <Header />
    <section className="p-6 mx-10">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <h1 className="text-5xl font-bold mb-2">Get Started!</h1>
        <h2 className="text-gray-600 mb-6 w-150 text-lg font-semibold">Create a project to manage related meeting recordings and summaries.</h2>
        
        <Button 
          onClick={() => setIsModalOpen(true)} 
          className="bg-purple-500 hover:bg-purple-600 text-white font-semibold p-6 rounded-md"
        >
          Create a New Project
        </Button>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create a New Project</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Project Title"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-lg p-2 w-full"
            />
            <Textarea
              placeholder="Project Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border rounded-lg p-2 w-full"
            />
          </div>
          <DialogFooter className="space-x-4">
            <Button 
              onClick={handleCreateProject}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              Create
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => setIsModalOpen(false)} 
              className="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-md"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>

    <section className="m-10 text-2xl font-semibold p-4 ">
      <h1 className="text-3xl font-bold mb-6">Existing Projects</h1>
      <Accordion type="single" collapsible className=" my-10 border rounded-md shadow-md p-6 bg-white">
          {projects.map((project) => (
              <AccordionItem value={`item-${project._id}`} key={project._id}>
                <AccordionTrigger className="hover:bg-gray-100 rounded-md p-4 transition-all duration-300 ease-in-out hover:no-underline">
                  <div className="">
                    <h1 className="text-xl mb-2 text-purple-600 hover:underline font-bold">{project.name}</h1>
                    <p className="text-gray-500">{project.description}</p>
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 space-y-3">
                    {project.meetings.map((meeting) => (
                      <div key={meeting._id} className="flex justify-between items-center">
                        <p className="text-lg font-semibold">{meeting.title}</p>
                        <Button 
                          variant="link" 
                          onClick={() => router.push(`/meeting/${meeting._id}`)} 
                          className="text-purple-500 hover:text-purple-600"
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
          ))}
      </Accordion>
    </section>
  </>
  );
}