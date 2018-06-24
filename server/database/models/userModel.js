const mongoose = require("mongoose"),
      bcrypt = require("bcrypt-nodejs"),
      crypto = require("crypto"),
      jwt = require("jsonwebtoken");

const { _SECRET } = require("../../configuration/config");

let userSchema = new mongoose.Schema({
  email : {
    type : String,
    required : true,
    unique : true,
    lowercase : true,
    validate: {
      validator: function(email) {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email.toLowerCase());
      },
      message: '{VALUE} is not a valid email!'
    }
  },
  name : {
    type : String,
    required : true,
    minlength : 3
  },
  password : {
    type : String,
    required : true,
    minlength : 5
  },
  pictureUrl : {
    type : String
  },
  isSeller : {
    type : Boolean,
    default : false
  },
  address : {
    type : String,
    required : true,
    minlength : 5
  },
  created : {
    type : Date,
    default : Date.now
  },
  token : String
});



userSchema.pre("save", function(next){
  if(this.isModified("password")){
    bcrypt.hash(this.password,null,null,(error,hashedPassword) => {
      if (error) {
        return next(error);
      }
      this.password = hashedPassword;
    })
  }
  next();
});

userSchema.methods.isPasswordValid = function(password) {
  return bcrypt.compareSync(password,this.password);
};

userSchema.methods.signToken = function() {
  this.token = jwt.sign({user : this}, _SECRET, {expiresIn : "1d"});
}

userSchema.methods.generateAvatar = function(pictureSize){
  pictureSize = pictureSize || 200;
  var md5 = crypto.createHash("md5").update(this.email).digest("hex");
  return "http://gravatar.com/avatar/" + md5 + "?s" + pictureSize + "&d=retro";
};

let userModel = mongoose.model("user", userSchema);

module.exports = userModel;
