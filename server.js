const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const app = express();
const ProjectRoutes = require("./Routes/ProjectRoutes");
const bodyParser = require("body-parser");

//DB instance
mongoose.connect("mongodb://localhost/mern", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify : false
});
const db = mongoose.connection;

//Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/project", ProjectRoutes);

app.get("/", (req, res) => {
  res.send("welcome to homepage");
});

//Server running after db connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("db connected");
  app.listen(process.env.PORT, () => {
    console.log(`server listening on ${process.env.PORT}`);
  });
});
