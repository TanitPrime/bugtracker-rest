const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    min: 6,
    required: true,
    type: String,
  },
  status: {
    enum: ["todo", "done", "in-progress"],
    type: String,
  },
  dateStarted: {
    type: Date,
    default: Date.now(),
  },
});
const Project = mongoose.model("Project", schema);

module.exports = Project;
