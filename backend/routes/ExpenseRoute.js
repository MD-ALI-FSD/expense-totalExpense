const express = require("express");
const router = express.Router();


//importing controllers from 'products.js' file.
const ExpenseController = require("../controller/ExpenseController");
//middleware to validate tokenised user-id received as a header in the GET request
const userAuthentication = require("../../middleware/auth");


//router to add Expenses
router.post("/user/addexpense", userAuthentication.authenticate, ExpenseController.postAddExpense);
//router to edit expense details.
router.put("/user/editexpense/:expenseId", ExpenseController.postEditExpense);
//router to delete an expense
router.delete("/user/deleteexpense/:expenseId", ExpenseController.postDeleteExpense);
//router to get expenses
router.get("/user/getexpense", userAuthentication.authenticate, ExpenseController.getExpense);



//router to get purchase premium order id.
router.get("/user/purchasepremium", userAuthentication.authenticate, ExpenseController.getPurchasePremium);
//router to Update orders table after purchasing premium.
router.post("/user/updatetransactionstatus", userAuthentication.authenticate, ExpenseController.postUpdateTransactionStatus);

//router to get details of a single user.
router.get("/user/getuser", userAuthentication.authenticate, ExpenseController.getUserDetails);

module.exports = router;
