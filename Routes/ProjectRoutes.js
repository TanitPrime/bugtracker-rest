const { Router } = require("express");
const e = require("express");
const express = require("express");
const router = express.Router();
const Project = require("../Models/Project");

//Project Routes
//get all
router.get("/projects", async (req, res) => {
  try {
    await Project.find().then((data) => {
      return res.status(200).send(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send("no data or bad request \n" + err);
  }
});

//get one
router.get("/:id", async (req, response) => {
    await Project.findById(req.params.id,(err,res)=>{
      if(err || !res){
        return response.send("no data found"+err).status(404)
      }
      return response.send(res).status(200)
    })
});

//create
router.post("/", async (req, res) => {
  console.log(req.body);
  const newproject = new Project({
    name: req.body.name,
    status: req.body.status,
  });

  await newproject.save((err) => {
    return res.send("bad request or invalid data \n" + err);
  });
  return res.send("project saved");
});

//delete one

router.get("/delete/:id", async (req, response) => {
  await Project.findByIdAndDelete(req.params.id,(err,res)=>{
    if(err){
      return response.send(err).status(404)
    }
    return response.send("document deleted").status(200)
  })
});

module.exports = router;
