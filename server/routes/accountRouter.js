const router = require("express").Router();

const userModel = require("../database/models/userModel"),
      orderModel = require("../database/models/orderModel");

const authenticationMiddleware = require("../middlewares/authenticationMiddleware");

router.post("/signup",async (req,res) => {
  let newUser = new userModel();
  newUser.name = req.body.name;
  newUser.password = req.body.password;
  newUser.email = req.body.email;
  newUser.address = req.body.address || "KRAKOW";
  newUser.isSeller = req.body.isSeller || false;
  let otherUser = await userModel.findOne({email : newUser.email});
  if(otherUser){
    res.json({
      success : false,
      message : "Account with this email already exists"
    });
    return;
  };
  newUser.save().then(async (savedUser) => {
    savedUser.pictureUrl = savedUser.generateAvatar();
    await savedUser.save();
    savedUser.signToken();
    res.setHeader("authorization", savedUser.token);
    res.json({
      success : true,
      token : savedUser.token
    });
  }).catch(error => {
    console.log(error);
    res.json({
      success : false,
      message : error.toString()
    });
  });
});



router.get("/secret",authenticationMiddleware,(req,res) => {
  res.send("now in secret :)");
});

router.post("/login", (req,res) => {
  let user = req.body;
  console.log(req.body);
  userModel.findOne({email : user.email}).then(foundUser => {
    if(!foundUser){throw new Error("user not with this email not found")}
    else if(!foundUser.isPasswordValid(user.password)){throw new Error("incorrect password!")}
    foundUser.signToken();
    res.setHeader("authorization", foundUser.token);
    console.log("ustawiamy token po stronie servera!");
    res.json({
      success : true,
      token : foundUser.token
    });
  }).catch(e => {
    res.json({
      message : e.toString(),
      success : false
    });
  });
});

router.route("/profile")
      .get(authenticationMiddleware,(req,res,next) => {
        userModel.findById(req.userData._id)
                  .then(user => {
                    res.json({
                      user : user,
                      success : true
                    });
                  })
                  .catch(e => {
                    console.log(e);
                    res.json({
                      message : e.toString(),
                      success : false
                    });
                  });
      })
      .post(authenticationMiddleware,async (req,res,next) => {
        userModel.findByIdAndUpdate(req.userData._id,req.body)
                 .then(updatedUser => {
                   res.json({
                     message : "succesfully updated account !",
                     success : true
                   });
                 })
                 .catch(e => {
                   res.json({
                     message : e.toString(),
                     success : false
                   });
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
    res.json({
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
    res.json({
      message : "failure",
      value : e.toString()
    });
  }
});

module.exports = router;
