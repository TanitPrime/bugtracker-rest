const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    min: 6,
  },
  status: {
    enum: ["todo", "doing", "done", "pending-test"],
    default: "todo",
    type: String,
  },
  category: {
    enum: ["bug", "new", "change"],
    default: "new",
    type: String,
  },
});

const Task = mongoose.model("Task", schema);
module.exports = Task;
