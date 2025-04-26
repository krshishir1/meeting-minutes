const express = require("express");
const router = express.Router();
const { ObjectId } = require("mongoose").Types;
const Project = require("../models");

const { getJsonFromS3, getTranscription } = require("../aws");


// Create a new meeting
// POST /api/meetings
router.post("/", async (req, res) => {
  try {
    let { projectId, title, audioUrl } = req.body;
    if (!audioUrl) audioUrl = "";

    const meetingData = { title, audioUrl };

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $push: { meetings: meetingData } },
      { new: true }
    );

    if (!updatedProject) {
      throw new Error("Meeting creation failed");
    }

    res
      .status(200)
      .json({
        message: "Meeting created successfully",
        meeting: updatedProject.meetings[updatedProject.meetings.length - 1],
      });
    
  } catch (err) {
    console.log(err.message);
    res.status(500).json({ message: err.message });
  }
});

router.post("/transcribe", async (req, res) => {
  try {

    const { inputKey } = req.body;

    const transcription = await getTranscription(inputKey);
    return res.status(200).json({ transcription })

  } catch(err) {
    console.log(err.message)
    res.status(500).json({ message: err.message})
  }
})

router.patch("/", async (req, res) => {
    try {

        const {projectName, meetingId, updatedData} = req.body;

        const project = await Project.findOne({name: projectName});
        if(!project) {
            throw new Error("Project not found")
        }
        
        const meeting = project.meetings.id(meetingId);
        Object.assign(meeting, updatedData);

        await project.save();
        return res.status(200).json({ message: "Meeting updated successfully", meeting })

    } catch(err) {
        console.log(err.message)
        res.status(500).json({ message: err.message})
    }
})



router.get("/:id", async (req, res) => {
  try {

    console.log(req.params)

    const { id } = req.params;
    let projectName = id.split("_")[0];
    let meetingId = id.split("_")[1];

    const project = await Project.findOne({name: projectName});
    if(!project) {
      throw new Error("Project not found")
    }

    const meeting = project.meetings.id(meetingId);
    if(!meeting) {
      throw new Error("Meeting not found")
    }

    const jsonData = await getJsonFromS3(meeting.dataPath);
    return res.status(200).json({ report: jsonData})

  } catch(err) {
    console.log(err.message)
    res.status(500).json({ message: err.message})
  }
} )



module.exports = router;
