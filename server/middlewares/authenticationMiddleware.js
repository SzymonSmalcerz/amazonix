const jwt = require("jsonwebtoken");

const { _SECRET } = require("../configuration/config");


let checkToken = function(req,res,next) {
  let token = req.headers["authorization"];
  console.log("BELLLLOW !");
  console.log(token);
  if(!token){
    console.log(token);
    console.log("no token provided");
    res.status(403).json({
      success : false,
      message : "no token provided :()"
    });
  } else {
    try {
      req.userData = jwt.verify(token, _SECRET).user;
      next();
    } catch (error) {
      console.log("error");
      res.status(400).json({
        success : false,
        message : "you are not logged in !"
      });
    }
  }
};

module.exports = checkToken;
