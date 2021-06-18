const express = require("express");
const mongoose = require("mongoose");
const {isLoggedIn, belongsToProject} = require("../MiddlewareHelpers");
const router = express.Router();
const Project = require("../Models/Project");

//Project Routes
//get all
router.get("/",isLoggedIn, async (req, res) => {
  console.log(req.currentUser)
  try {
    await Project.find().then((data) => {
      return res.send(data);
    });
  } catch (err) {
    return res.status(404).send("no data or bad request \n" + err);
  }
});

//get one
router.get("/:id", isLoggedIn ,async (req, res) => {
  const isValid = mongoose.Types.ObjectId.isValid(req.params.id);
  try {
    if (isValid) {
      const result = await Project.findById(req.params.id)
        //populate Bugs and Users before sending for ease of access
        .populate("bugs")
        .populate("users")
        .exec();
      if (result === null) return res.status(404).send(err);
      return res.status(200).send(result);
    }
    return res.sendStatus(404);
  } catch (err) {
    return res.status(404).send("no data or bad request \n" + err);
  }
});

//create
router.post("/",isLoggedIn, async (req, res) => {
  const newproject = {
    name: req.body.name,
    status: req.body.status,
  };
  try {
    const project = new Project(newproject);
    //add users if sent
    if (req.body.users) {
      req.body.users.forEach((element) => {
        project.users.push(element);
        console.log(element);
      });
    }
    const result = await project.save();
    if (result === null) {
      return res.send("bad request or invalid data \n" + err);
    }

    return res.send("project saved");
  } catch (err) {
    return res.status(500).send("something went wrong \n" + err);
  }
});

//delete one
router.delete("/:id", isLoggedIn,async (req, res) => {
  try {
    if(currentUser.role==="Admin"){
      const result = await Project.findByIdAndDelete(req.params.id);
      if (result === null) {
        return res.status(404).send(err);
      }
      return res.status(200).send("document deleted");
    }
  } catch (err) {
    return res.status(500).send("something went wrong \n" + err);
  }
});

//update
//todo: deal with newly added users
router.put("/:id",isLoggedIn,async (req, res) => {
  const updatedProject = {
    name: req.body.name,
    status: req.body.status,
  };
  try {
    const result = await Project.findByIdAndUpdate(
      req.params.id,
      updatedProject
    );
    if (result === null) {
      return res.status(404).send(err);
    }
    return res.status(200).send("project updated");
  } catch (err) {
    return res.status(500).send("something went wrong \n" + err);
  }
});

module.exports = router;
