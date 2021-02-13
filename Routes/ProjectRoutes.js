const express = require("express");
const router = express.Router();
const Project = require("../Models/Project");

//Project Routes
//get all
router.get("/", async (req, res) => {
  try {
    await Project.find().then((data) => {
      return res.send(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send("no data or bad request \n" + err);
  }
});

//get one
router.get("/:id", async (req, res) => {
  //populate features before sending for ease of access
  Project.findById(req.params.id)
    //fill feature reference with actual features
    .populate("features")
    .exec((err, result) => {
      if (err) return res.status(404).send(err);
      return res.status(200).send(result);
    });
});

//create
router.post("/", async (req, res) => {
  const newproject = new Project({
    name: req.body.name,
    status: req.body.status,
  });

  await newproject.save((err) => {
    if (err) {
      return res.status(400).send("bad request or invalid data \n" + err);
    }
  });
  return res.send("project saved");
});

//delete one
router.delete("/:id", async (req, response) => {
  await Project.findByIdAndDelete(req.params.id, (err, res) => {
    if (err) {
      return response.status(404).send(err);
    }
    return response.status(200).send("document deleted");
  });
});

//update
router.put("/:id", async (req, response) => {
  await Project.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, status: req.body.status },
    (err, res) => {
      if (err) {
        return response.status(404).send(err);
      }
      return response.status(200).send("document updated");
    }
  );
});

module.exports = router;
