const express = require("express"),
      morgan = require("morgan"),
      bodyParser = require("body-parser"),
      cors = require("cors");

const connectionToDb = require("./database/connectionToDatabase");



let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:false}));
app.use(cors());
app.use(morgan("dev"));
let PORT = process.env.PORT || 3000;

app.get("*", (req,res,next) => {
  res.send("XD");
})

app.listen(PORT, () => {
  console.log(`server is listening at port ${PORT}`);
})
