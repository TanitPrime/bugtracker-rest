const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const app = express();
const ProjectRoutes = require("./Routes/ProjectRoutes");

mongoose.connect("mongodb://localhost/mern", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

app.use(express.json());
app.use("/project", ProjectRoutes);

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {

  console.log("db connected");

  app.get("/", (req, res) => {
    res.send("welcome to homepage");
  });

  app.listen(process.env.PORT, () => {
    console.log(`server listening on ${process.env.PORT}`);
  });
});
