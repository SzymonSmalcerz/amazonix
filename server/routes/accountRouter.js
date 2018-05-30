const router = require("express").Router();

const userModel = require("../database/models/userModel"),
      orderModel = require("../database/models/orderModel");

const authenticationMiddleware = require("../middlewares/authenticationMiddleware");

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
    res.setHeader("authorization", savedUser.token);
    res.send(savedUser);
  }).catch(error => {
    res.status(400).send(error);
  });
});



router.get("/secret",authenticationMiddleware,(req,res) => {
  res.send("now in secret :)");
});

router.post("/login", (req,res) => {
  let user = req.body;
  userModel.findOne({email : user.email}).then(foundUser => {
    if(!foundUser){throw new Error("user not with this email not found")}
    else if(!foundUser.isPasswordValid(user.password)){throw new Error("incorrect password!")}
    foundUser.signToken();
    res.setHeader("authorization", foundUser.token);
    res.send(foundUser);
  }).catch(e => {
    res.status(400).send(e.toString());
  });
});

router.route("/profile")
      .get(authenticationMiddleware,(req,res,next) => {
        userModel.findById(req.userData._id)
                  .then(user => {
                    res.json(user);
                  })
                  .catch(e => {
                    res.stats(400).send(e.toString());
                  });
      })
      .post(authenticationMiddleware,async (req,res,next) => {
        userModel.findByIdAndUpdate(req.userData._id,req.body)
                 .then(updatedUser => {
                   res.send("succesfully updated account !");
                 })
                 .catch(e => {
                   res.status(400).send(e.toString());
                 });
      });

router.get("/orders",authenticationMiddleware,async (req,res) => {
  try {
    let orders = await orderModel.find({owner : req.userData._id}).deepPopulate("products.product").populate("owner").exec();
    res.json({
      message : "success",
      value : orders
    });
  } catch(e) {
    res.status(400).json({
      message : "failure",
      value : e.toString()
    });
  }
});

router.get("/orders/:id",authenticationMiddleware,async (req,res) => {
  try {
    let id = req.params.id;
    let order = await orderModel.findById(id).deepPopulate("products.product.owner").populate("owner").exec();
    res.json({
      message : "success",
      value : order
    });
  } catch(e) {
    res.status(400).json({
      message : "failure",
      value : e.toString()
    });
  }
});

module.exports = router;
