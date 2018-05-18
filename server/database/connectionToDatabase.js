const mongoose = require("mongoose");
const { _DATABASE_URL, _SECRET } = require("../configuration/config");

mongoose.connect(_DATABASE_URL, (err) => {
  if(err) {
    console.log(err);
  } else{
    console.log("connection to database established");
  }
})

module.exports = {
  mongoose
}
