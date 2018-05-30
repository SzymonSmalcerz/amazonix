const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  owner : {
    type : mongoose.Schema.Types.ObjectId,
    ref : "user"
  },
  title : String,
  description : String,
  rating : {
    type : Number,
    default : 0
  },
  created : {
    type : Date,
    default : Date.now
  }
});

const reviewModel = mongoose.model("review",reviewSchema);


module.exports = reviewModel;
