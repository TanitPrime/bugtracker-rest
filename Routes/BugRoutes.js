const express = require("express");
const res = require("express/lib/response");
const router = express.Router();
const Bug = require("../Models/Bug");
const Project = require("../Models/Project");

//Bug Routes
//get all
router.get("/", async (req, res) => {
  try {
    await Bug.find().then((data) => {
      return res.status(200).send(data);
    });
  } catch (err) {
    console.log(err);
    return res.status(404).send("no data or bad request \n" + err);
  }
});

//get one
router.get("/:id", async (req, response) => {
  await Bug.findById(req.params.id, (err, res) => {
    if (err || !res) {
      return response.status(404).send("no data found" + err);
    }
    return response.status(200).send(res);
  });
  // Bug.findById(req.params.id)
  //   //fill tasks reference with actual tasks
  //   .populate("tasks")
  //   .exec((err, result) => {
  //     if (err) return res.status(404).send(err);
  //     return res.status(200).send(result);
  //   });
});

//create
//requires Project Id
router.post("/", async (req, response) => {
  //new Bug from request
  const bug = {
    name: req.body.name,
    priority: req.body.priority,
    status: req.body.status,
  };
  const filter = req.body.projectId;
  const newBug = new Bug(bug);
  // save Bug
  try{
    let doc = await newBug.save()
    await Project.findByIdAndUpdate(
      filter,{
        $push:{bugs: doc._id}
      }
    )
    return response.status(200).send(doc)
  }catch(err){return response.status(500).send(err)}

});

//delete one
router.delete("/:id", async (req, response) => {
  //remove reference
  await Project.update(
    {},
    {
      $pull: { Bugs: req.params.id },
    }
  );
  //then remove document
  await Bug.findByIdAndDelete(req.params.id, (err, res) => {
    if (err) {
      return response.status(404).send(err);
    }
    return response.status(200).send("document deleted" + res);
  });
});

//update
router.put("/:id", async (req, response) => {
  await Bug.findByIdAndUpdate(
    req.params.id,
    {
      name: req.body.name,
      priority: req.body.priority,
      status: req.body.status,
    },
    (err, res) => {
      if (err) {
        return response.status(404).send(err);
      }
      return response.status(200).send("document updated");
    }
  );
});

module.exports = router;
