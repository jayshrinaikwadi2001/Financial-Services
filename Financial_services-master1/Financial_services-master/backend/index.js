const express = require("express");
const app = express();
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
dotenv.config();
const db = require("./config/mongoose");
const { default: helmet } = require("helmet");
const morgan = require("morgan");
const cors = require("cors");
db();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));

app.use("/", require("./routes/index"));

app.listen(process.env.PORT, (err) => {
  if (err) console.error("Error in connecting to port");

  console.log(`App running on port ${process.env.PORT}`);
});
