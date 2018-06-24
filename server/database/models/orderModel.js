const mongoose = require("mongoose");
const deepPopulate = require('mongoose-deep-populate')(mongoose);
const {_ALGOLIA} = require("../../configuration/config");
const orderSchema = new mongoose.Schema({
  owner : {
    type : mongoose.Schema.ObjectId,
    ref : "user"
  },
  totalPrice : {
    type : Number,
    default : 0
  },
  products : [{
    product : {
      type : mongoose.Schema.ObjectId,
      ref : "product"
    },
    quantity : {
      type : Number,
      default : 0
    }
  }],
  created : {
    type : Date,
    default : Date.now
  },
});

orderSchema.plugin(deepPopulate);
const orderModel = mongoose.model("order",orderSchema);

module.exports = orderModel;
