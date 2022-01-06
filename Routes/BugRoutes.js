const express = require("express");
const res = require("express/lib/response");
const { isLoggedIn } = require("../MiddlewareHelpers");
const router = express.Router();
const Bug = require("../Models/Bug");
const Project = require("../Models/Project");

//Bug Routes
//get all
router.get("/",isLoggedIn, async (req, res) => {
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
router.get("/:id",isLoggedIn, async (req, res) => {
  try {
    let doc = await Bug.findById(req.params.id);
    return res.status(200).send(doc);
  } catch (err) {
    return res.status(404).send("no data found" + err);
  }

  // await Bug.findById(req.params.id, (err, res) => {
  //   if (err || !res) {
  //     return response.status(404).send("no data found" + err);
  //   }
  //   return response.status(200).send(res);
  // });
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
router.post("/",isLoggedIn, async (req, response) => {
  //new Bug from request
  const bug = {
    name: req.body.name,
    priority: req.body.priority,
    status: req.body.status,
  };
  const filter = req.body.projectId;
  const newBug = new Bug(bug);
  // save Bug
  try {
    let doc = await newBug.save();
    await Project.findByIdAndUpdate(filter, {
      $push: { bugs: doc._id },
    });
    return response.status(200).send(doc);
  } catch (err) {
    return response.status(500).send(err);
  }
});

//delete one
router.delete("/:id",isLoggedIn, async (req, res) => {
  //remove reference
  try{
    let doc = await Bug.findByIdAndDelete(req.params.id);
    if (doc === null) {
      return res.status(404).send(err);
    }
    //delete refence in project
    let doc2 = await Project.update(
      {},
      {
        $pull: { Bugs: req.params.id },
      }
    );
    if (doc2 === null) {
      return res.status(404).send(err);
    }
    return res.status(200).send("document deleted" + doc + doc2);
  }catch(err){
    return res.status(404).send(err);
  }
  // await Project.update(
  //   {},
  //   {
  //     $pull: { Bugs: req.params.id },
  //   }
  // );
  // //then remove document
  // await Bug.findByIdAndDelete(req.params.id, (err, res) => {
  //   if (err) {
  //     return response.status(404).send(err);
  //   }
  //   return response.status(200).send("document deleted" + res);
  // });
});

//update
router.put("/:id",isLoggedIn, async (req, res) => {
  try{
    let doc = await Bug.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        priority: req.body.priority,
        status: req.body.status,
      })
      if (doc === null) {
        return res.status(404).send(err);
      }
      return res.status(200).send("document updated "+doc);
  }catch(err){
    return res.status(404).send(err);
  }
  // await Bug.findByIdAndUpdate(
  //   req.params.id,
  //   {
  //     name: req.body.name,
  //     priority: req.body.priority,
  //     status: req.body.status,
  //   },
  //   (err, res) => {
  //     if (err) {
  //       return response.status(404).send(err);
  //     }
  //     return response.status(200).send("document updated");
  //   }
  // );
});

module.exports = router;
