const mongoose = require("mongoose");

const schema = new mongoose.Schema({
  name: {
    type: String,
    min: 6,
  },
  password: {
    type: String,
  },
  role: {
    enum: ["Dev", "Admin", "Tester", "Manager"],
    default: "Dev",
    type: String,
  },
});

const User = mongoose.model("User", schema);
module.exports = User;
