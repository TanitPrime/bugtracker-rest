const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    min: 6,
  },
  priority: {
    type: Number,
    enum: [1, 2, 3, 4, 5],
    default: 1,
  },
  status: {
    enum: ["todo", "doing", "done"],
    default: "todo",
    type: String,
  },
  tasks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
    },
  ],
});

const Feature = mongoose.model("Feature", schema);
module.exports = Feature;
