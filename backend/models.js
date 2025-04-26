const mongoose = require("mongoose");

const MeetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  audioUrl: String,
  videoUrl: String,
  dataPath: String,
});

const ProjectSchema = new mongoose.Schema({
  name: { type: String, unique: true, required: true },
  description: String,
  meetings: [MeetingSchema],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Project", ProjectSchema);


// summary: String,
//   decisions: [String],
//   action_items: [String],
//   relevant_links: {
//     type: [mongoose.Schema.Types.Mixed],
//     default: []
//   },
//   visual_moments: {
//     type: [mongoose.Schema.Types.Mixed],
//     default: []
//   },
//   segments: {
//     type: [mongoose.Schema.Types.Mixed],
//     default: []
//   },