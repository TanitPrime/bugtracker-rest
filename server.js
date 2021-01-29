const express = require("express");
const mongoose = require("mongoose");
const animal = require("./Schema");
const app = express();
const bodyParser = require('body-parser')

mongoose.connect("mongodb://localhost/mern", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

app.use(bodyParser.urlencoded({ extended: true }));

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("db connected");
  app.get("/", (req, res) => {
    res.send("get to homepage recieved");
  });

  app.post("/animal", async (req, res) => {
      console.log(req.body.name)
    const pet = new animal({ name: req.body.name });
    await pet.save(err=>{
        if(err) res.send("error when saving animal")
        res.send("animal registered")
    })
  });

  app.get("/animals", (req, res) => {
      animal.find()
        .then(data=>{
            res.json(data);
        })
        .catch(err=>{
            res.json(err)
        })
  });

  app.listen({ port: 4000 }, () => {
    console.log("server up at 4000");
  });
});
