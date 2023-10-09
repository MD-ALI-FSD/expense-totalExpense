const express = require("express");

const router = express.Router();

//importing controllers from 'products.js' file.
const signupController = require("../controller/signupController");

//router to GET(render) add-products on path "/add-product" using controller "getAddProduct" from "controlller/admin.js"
router.post("/user/signup", signupController.postAddUser);

//router to GET(render) add-products on path "/add-product" using controller "getAddProduct" from "controlller/admin.js"
router.get("/user/get-user", signupController.getUsers);

//router to GET(render) add-products on path "/add-product" using controller "getAddProduct" from "controlller/admin.js"
// router.delete("/user/delete-user/:userId", userController.postDeleteUser);

// router.put("/user/edit-user/:userId", userController.postEditUser);

module.exports = router;
