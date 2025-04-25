const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  transcriptText: String,
  summary: String,
  decisions: [String],
  actionItems: [String],
  audioUrl: String,
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: String,
  meetings: [MeetingSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", ProjectSchema);
