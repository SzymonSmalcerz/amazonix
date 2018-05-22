const mongoose = require("mongoose");


const categorySchema = new mongoose.Schema({
  name : {
    type : String,
    unique : true,
    lowercase : true,
    required : true,
    minlength : 3
  }
});

const categoryModel = mongoose.model("category",categorySchema);


module.exports = categoryModel;
