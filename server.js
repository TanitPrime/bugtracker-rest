const mongoose = require("mongoose");
require("dotenv").config();
const express = require("express");
const app = express();
const ProjectRoutes = require("./Routes/ProjectRoutes");
const BugRoutes = require("./Routes/BugRoutes");
const UserRoutes = require("./Routes/UserRoutes");
const HomePage = require("./Routes/Homepage");
const Auth = require("./Routes/Auth");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");

//DB instance
mongoose.connect("mongodb://localhost/mern", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
});
const db = mongoose.connection;

//Middleware
app.use(cookieParser(process.env.COOKIE_SECRET))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//Routes
app.use("/project", ProjectRoutes);
app.use("/bug", BugRoutes);
app.use("/user", UserRoutes);
app.use("/auth", Auth);
app.use("/homepage", HomePage);

//default function for unexpected routes
app.get("*",(req, res)=>{
  console.log("hi")
  res.status(404).send("what???");
});

//Server running after db connection
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("db connected");
  app.listen(process.env.PORT, () => {
    console.log(`server listening on ${process.env.PORT}`);
  });
});
