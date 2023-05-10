const express = require("express");
const router = express.Router();
const homeController = require("../controller/homeController");

router.get("/", homeController.home);
router.use("/user", require("./user"));
router.use("/application", require("./application"));
module.exports = router;
