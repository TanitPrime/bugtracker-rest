const express = require("express");
const mongoose = require("mongoose");
const { isLoggedIn, belongsToProject } = require("../MiddlewareHelpers");
const router = express.Router();
const Project = require("../Models/Project");
const User = require("../Models/User");

//Project Routes
//get all
router.get("/", isLoggedIn, async (req, res) => {
  console.log(req.currentUser);
  try {
    const result = await Project.find()
    .populate("bugs")
    .populate("users")
    .exec()
    if (result === null) return res.status(404).send(err);
      return res.status(200).send(result);
  } catch (err) {
    return res.status(404).send("no data or bad request \n" + err);
  }
});

//get one
router.get("/:id", isLoggedIn, async (req, res) => {
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

router.post("/", isLoggedIn, async (req, res) => {
  const newproject = {
    name: req.body.name,
    status: req.body.status,
  };
  try {
    const project = new Project(newproject);
    const result = await project.save();
    if (result === null) {
      return res.send("bad request or invalid data \n" + err);
    }

    return res.send("project saved");
  } catch (err) {
    return res.status(500).send("something went wrong \n" + err);
  }
});

//this works with one or more users
//reason is i want the project admin to be able to add users from a checkbox list
router.post("/adduser/:id", isLoggedIn, async (req, res) => {
  try {
    //grab the corresponding project
    const project = await Project.findById(req.params.id);
    //add users if sent
    const users = [];
    let uniqueUsers = [...new Set(req.body.users)]
    uniqueUsers.forEach((element) => {
      users.push(element);
    });

    if (users) {
      //get list of all user ids
      const userIds = await User.find({}, "_id");
      //console.log(users);
      //console.log(userIds)
      //check for intersection
      const intersection = req.body.users.filter((item1) =>
        userIds.some((item2) => item1._id.toString() === item2._id.toString())
      );
      //console.log(intersection);
      //add users to project
      intersection.forEach((element) => {
        //add valid userIds to project
        if (mongoose.Types.ObjectId.isValid(element._id)){

          const exists = project.users.includes(element._id)
          console.log(exists)
          
          if(!exists){
            project.users.push(element);
          }
          else{
            return res.send("Already exists \n" + err);
          }
        }
      });
      const result = await project.save();
      if (result === null) {
        return res.send("bad request or invalid data \n" + err);
      }
      return res.send(result);
    }
  } catch (err) {
    return res.status(500).send("something went wrong \n" + err);
  }
});
//delete one
router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    if (currentUser.role === "Admin") {
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
router.put("/:id", isLoggedIn, async (req, res) => {
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
