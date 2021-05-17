const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    min: 6,
    required: true,
    type: String,
    unique: true,
  },
  status: {
    enum: ["todo", "done", "doing"],
    type: String,
    default: "todo",
  },
  dateStarted: {
    type: Date,
    default: Date.now(),
  },
  bugs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Bug",
    },
  ],
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
  ],
});
const Project = mongoose.model("Project", schema);

module.exports = Project;
