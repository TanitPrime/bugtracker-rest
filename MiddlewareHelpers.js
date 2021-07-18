const Project = require ("./Models/Project");

const JWT = require("jsonwebtoken");

const isLoggedIn = (req, res, next) => {
  //get token from signed cookies
  let token = req.signedCookies.AuthCookie;
  console.log(token)
  try{
    if (!token) return res.status(403).send(JSON.stringify({msg:`you are not logged in`,type:"error"}));
    //verify token
    JWT.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
      if (err) {
        return res.status(500).send("something went wrong"+ err);
      }
      req.currentUser = decoded;
    });
    next();
  }catch(err){
    return res.status(500).send("something went wrong"+ err);
  }
};

const belongsToProject =async (req, res, next)=>{
  try{
    const project = await Project.findById(req.params.id);
    const value = project.users.includes(req.currentUser.id)?  true :  false;
    req.belongsToProject = value;
    next();
  }catch(err){
    return res.status(500).send("maybe you are not logged in"+ err);
  }
}


module.exports = {belongsToProject,isLoggedIn};