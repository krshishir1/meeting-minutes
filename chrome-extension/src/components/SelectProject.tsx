import { useState, useEffect } from "react";
import { IoIosArrowForward } from "react-icons/io";
import { useNavigate } from "react-router-dom";

export default function SelectProjectPage() {
  const [projects, setProjects] = useState<any[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProjects() {
      const response = await fetch("http://localhost:4000/api/projects");
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to fetch projects");
      }

      const data = await response.json();
      console.log(data);

      setProjects(data.projects);
    }

    fetchProjects();
  }, []);

  useEffect(() => {
    chrome.storage.local.get(["projectId"], (result) => {
      console.log("Value currently is", result.projectId);

      if(result.projectId) {
        // setCurrentProjectId(result.projectId);
        navigate(`/project/${result.projectId}`);
      }
    });
  }, []);

  return (
    <section className="pt-8 px-8">
      <h1 className="text-neutral-800 font-bold text-2xl text-center mb-5">
        Select the project
      </h1>

      {projects?.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            No Projects Available
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            It looks like you don't have any projects yet. Let's get started!
          </p>
          <button
            className="bg-blue-800 text-white text-lg px-6 py-3 rounded-md shadow-md hover:bg-blue-900 transition duration-300"
            // onClick={redirectToAddProject}
          >
            Add New Project
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 w-full max-w-screen-xl">
          {projects.map((project) => (
            <div
              key={project._id}
              className="relative flex justify-between items-center bg-white p-6 rounded-lg shadow border border-neutral-100 transition transform group hover:scale-102 hover:shadow-md cursor-pointer"
              onClick={() => {
                navigate(`/project/${project._id}`);
                chrome.storage.local.set({ projectId: project._id, projectName: project.name }, () => {
                  console.log("ProjectId is set: ", project._id);
                });
              }}
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800">
                  {project.name}
                </h3>
                <p className="text-gray-600">{project.description}</p>
              </div>
              <button className="transform -translate-y-1/2 text-xl text-blue-800 opacity-0 group-hover:opacity-100 transition-opacity">
                <IoIosArrowForward size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
