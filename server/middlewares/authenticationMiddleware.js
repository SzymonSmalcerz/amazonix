const jwt = require("jsonwebtoken");

const { _SECRET } = require("../configuration/config");


let checkToken = function(req,res,next) {
  let token = req.headers["authorization"];
  if(!token){
    res.status(403).send("no token provided :()")
  } else {
    try {
      req.userData = jwt.verify(token, _SECRET).user;
      next();
    } catch (error) {
      res.status(400).send("you are not logged in !");
    }
  }
};

module.exports = checkToken;
