const express = require("express");
const router = express.Router();
const Project = require("../models");

// Create a new project
// POST /api/projects
// Body: { name: String, description: String }
router.post("/", async (req, res) => {
  try {
    const { name, description } = req.body;
    const newProject = new Project({ name, description });
    await newProject.save();

    res
      .status(201)
      .json({ message: "Project created successfully", project: newProject });
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});


// Get all projects
// GET /api/projects
// Response: { projects: [Project[]] }
router.get("/", async (req, res) => {
    try {

        const projects = await Project.find();
        res.status(200).json({ projects });

    } catch(err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
})


// Get a single project by ID
// GET /api/projects/:id
// Response: { project: Project }
router.get("/:id", async (req, res) => {
    try {

        const { id } = req.params;
        const project = await Project.findById(id);

        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }

        res.status(200).json({ project });
        
        
    } catch(err) {
        console.log(err.message);
        res.status(500).json({ message: err.message });
    }
})

module.exports = router;