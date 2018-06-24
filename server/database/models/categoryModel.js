const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
  name : {
    type : String,
    unique : true,
    lowercase : true,
    required : true,
    minlength : 3
  },
  created : {
    type : Date,
    default : Date.now
  }
});

const categoryModel = mongoose.model("category",categorySchema);


module.exports = categoryModel;
