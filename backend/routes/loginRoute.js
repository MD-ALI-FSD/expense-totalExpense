const express = require("express");

const router = express.Router();

//importing controllers from 'products.js' file.
const loginController = require("../controller/loginController");

router.post("/user/login", loginController.postVerifyUser);

module.exports = router;
