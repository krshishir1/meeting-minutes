"use client";

import Header from "@/components/common/header";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { motion } from "motion/react";
import { File, Folder, Plus } from "lucide-react";
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
  const [refreshTrigger, setRefreshTrigger] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/projects");
        setProjects(response.data.projects);
      } catch (error) {
        console.log("Error fetching projects:", error);
      }
    };
    fetchProjects();
  }, [refreshTrigger]);

  const handleCreateProject = async () => {
    if (name.trim() && description.trim()) {
      try {
        const newProject = { name, description };
        const response = await axios.post(
          "http://localhost:4000/api/projects",
          newProject
        );
        setProjects((prevProjects) => [...prevProjects, response.data]);
        setName("");
        setDescription("");
        setIsModalOpen(false);
        setRefreshTrigger(prev => !prev);
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
      ],
    },
    {
      id: 2,
      title: "Project 2",
      description: "Description for project 2",
      meetings: [
        { id: "3", name: "Meeting 3", type: "image" },
        { id: "4", name: "Meeting 4", type: "document" },
      ],
    },
    {
      id: 3,
      title: "Project 1",
      description: "Description for project 1",
      meetings: [
        { id: "1", name: "Meeting 1", type: "audio" },
        { id: "2", name: "Meeting 2", type: "video" },
      ],
    },
    {
      id: 4,
      title: "Project 1",
      description: "Description for project 1",
      meetings: [
        { id: "1", name: "Meeting 1", type: "audio" },
        { id: "2", name: "Meeting 2", type: "video" },
      ],
    },
  ];

  return (
    <>
      <Header />
      <motion.section
        className="p-6 lg:mx-10 mx-12 flex justify-between items-center flex-wrap"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="pl-4">
        <motion.h1
            className="text-4xl font-bold mb-2"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Get Started!
          </motion.h1>
          <motion.h2
            className="text-gray-600 w-150 text-lg font-semibold"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Create a project to manage related meeting recordings and summaries.
          </motion.h2>
        </div>
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          

          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              onClick={() => setIsModalOpen(true)}
              className="bg-orange-500 hover:bg-orange-600 text-white font-bold p-6 rounded-md"
            >
              <Plus/>
              Create a New Project
            </Button>
          </motion.div>

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
      </motion.section>

      <motion.section
        className="mx-12 text-2xl font-semibold p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
      >
        <h1 className="text-3xl font-bold mb-2 ml-4">Existing Projects</h1>

        <Accordion
          type="single"
          collapsible
          className="mb-10 rounded-md p-6 bg-white flex flex-col gap-4"
        >
          {projects.map((project, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 * index }}
            >
              <AccordionItem value={`item-${project._id}`} className="">
                <AccordionTrigger className="hover:bg-gray-100 rounded-md p-4 transition-all duration-300 ease-in-out hover:no-underline  border w-full">
                 <div className="flex items-center gap-4 justify-between">
                 <Folder
                    className="text-white bg-orange-500 p-2 rounded-full"
                    width={40}
                    height={40}
                  />
                  <div>
                    <h1 className="text-xl mb-2 hover:underline font-bold">
                      {project.name}
                    </h1>
                    <p className="text-gray-500">{project.description}</p>
                  </div>
                 </div>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="p-4 space-y-3">
                    {(project.meetings || []).map((meeting) => (
                      <div
                        key={meeting._id}
                        className="flex justify-between items-center"
                      >
                        <p className="text-lg font-semibold">{meeting.title}</p>
                        <Button
                          variant="link"
                          onClick={() => router.push(`/meeting/${meeting._id}`)}
                          className="text-orange-500 hover:text-orange-600"
                        >
                          View
                        </Button>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </motion.section>
    </>
  );
}
