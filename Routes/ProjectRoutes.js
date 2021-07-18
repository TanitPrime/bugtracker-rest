const express = require("express");
const mongoose = require("mongoose");
const { isLoggedIn, belongsToProject } = require("../MiddlewareHelpers");
const router = express.Router();
const Project = require("../Models/Project");
const User = require("../Models/User");

//Project Routes
//get all
router.get("/",isLoggedIn, async (req, res) => {
  console.log(req.currentUser);
  try {
    await Project.find().then((data) => {
      return res.send(data);
    });
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

//create
router.post("/", isLoggedIn, async (req, res) => {
  const newproject = {
    name: req.body.name,
    status: req.body.status,
  };
  try {
    const project = new Project(newproject);
    //add users if sent
    if (req.body.users) {
      console.log(req.body.users)
      //get list of all user ids
      const userIds = await User.find({}, "_id").exec();
      console.log("userIds:"+userIds)
      //check for intersection
      //general function
      const operation = (list1, list2, isUnion = false) =>
        list1.filter(
          (
            (set) => (a) =>
              isUnion === set.has(a._id)
          )(new Set(list2.map((b) => b._id)))
        );
      //intersection function
      const inBoth = (list1, list2) => operation(list1, list2, true);
      const intersection = inBoth(userIds,req.body.users)
      console.log(intersection)
      //if ids are included in db then save to project
      if (intersection.length === req.body.users.length) {
        req.body.users.forEach((element) => {
          project.users.push(element);
        });
      } else {
        //else we tell user ids are invalid
        return res
          .status(400)
          .send("the ids submitted are invalid please try again");
      }
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
