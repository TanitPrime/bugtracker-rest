const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    min: 6,
  },
  password: {
    type: String,
    required:true,
    min:8
  },
  email : {
    type: String,
    trim:true,
    lowercase:true,
    unique:true,
    required:true
  },
  role: {
    enum: ["Dev", "Admin", "Tester", "Manager"],
    default: "Dev",
    type: String,
  },
  projects: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
    },
  ]
});

const User = mongoose.model("User", schema);
module.exports = User;
