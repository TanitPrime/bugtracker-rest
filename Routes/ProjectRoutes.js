const express = require("express");
const router = express.Router();
const Project = require("../Models/Project");

//Project Routes
//get all
router.get("/projects", async (req, res) => {
  try {
    await Project.find().then((data) => {
      return res.send(200, data);
    });
  } catch (err) {
    console.log(err);
    return res.send(404, "no data or bad request \n" + err);
  }
});

//get one
router.get("/:id", async (req, response) => {
  await Project.findById(req.params.id, (err, res) => {
    if (err || !res) {
      return response.send(404, "no data found" + err);
    }
    return response.send(200, res);
  });
});

//create
router.post("/", async (req, res) => {
  console.log(req.body);
  const newproject = new Project({
    name: req.body.name,
    status: req.body.status,
  });

  await newproject.save((err) => {
    return res.send(400, "bad request or invalid data \n" + err);
  });
  return res.send(200, "project saved");
});

//delete one
router.get("/:id", async (req, response) => {
  await Project.findByIdAndDelete(req.params.id, (err, res) => {
    if (err) {
      return response.send(404, err);
    }
    return response.send(200, "document deleted");
  });
});

//update
router.put("/put/:id", async (req, response) => {
  await Project.findByIdAndUpdate(
    req.params.id,
    { name: req.body.name, status: req.body.status },
    (err, res) => {
      if (err) {
        return response.send(404, err);
      }
      return response.send(200, "document updated");
    }
  );
});

module.exports = router;
