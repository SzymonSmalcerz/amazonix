const router = require("express").Router();

const userModel = require("../database/models/userModel");

router.post("/signup",(req,res) => {
  let newUser = new userModel();
  newUser.name = req.body.name;
  newUser.password = req.body.password;
  newUser.email = req.body.email;
  newUser.address = req.body.address;
  newUser.save().then(async (savedUser) => {
    savedUser.pictureUrl = savedUser.generateAvatar();
    await savedUser.save();
    savedUser.signToken();
    res.send(savedUser);
  }).catch(error => {
    res.status(400).send(error);
  });
});

router.post("/login", (req,res) => {
  let user = req.body;
  userModel.findOne({email : user.email}).then(foundUser => {
    if(!foundUser){throw new Error("user not with this email not found")}
    else if(!foundUser.isPasswordValid(user.password)){throw new Error("incorrect password!")}
    foundUser.signToken();
    res.send(foundUser);
  }).catch(e => {
    res.status(400).send(e.toString());
  });
})

module.exports = router;
