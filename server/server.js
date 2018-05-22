const express = require("express"),
      morgan = require("morgan"),
      bodyParser = require("body-parser"),
      cors = require("cors");

const connectionToDb = require("./database/connectionToDatabase"),
      accountRouter = require("./routes/accountRouter"),
      productsRouter = require("./routes/productsRouter"),
      sellerRouter = require("./routes/sellerRouter");



let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(morgan("dev"));
app.use("/account",accountRouter);
app.use("/products",productsRouter);
app.use("/seller",sellerRouter);
let PORT = process.env.PORT || 3000;

app.get("*", (req,res,next) => {
  res.send("XD");
})

app.listen(PORT, () => {
  console.log(`server is listening at port ${PORT}`);
})
