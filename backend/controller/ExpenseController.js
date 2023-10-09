const Razorpay = require("razorpay");
const expenseModel = require("../models/expenseModel");
const orderModel = require("../models/orderModel");
const userModel = require("../models/userModel");

const dotenv = require("dotenv");
const { TokenExpiredError } = require("jsonwebtoken");
const sequelize = require("../util/database");
dotenv.config(); // Load the .env file

/*******************************************************/
//  POST Add-Expense Controller
/*******************************************************/
exports.postAddExpense = async (req, res, next) => {
  try {
    console.log("inside add backend");
    const amount = req.body.amount;
    const description = req.body.discription;
    const category = req.body.category;
    const id = req.user.id;

    console.log(amount, description, category);

    const data = await expenseModel.create({
      amount: amount,
      description: description,
      category: category,
      userId: id,
    });

    res.status(201).json({ newExpenseDetail: data });
  } catch (err) {
    res.status(500).json(err);
  }
  // catch (err) {
  //     res.status(500).json({ error: err });
  //   }
};

/*******************************************************/
//  GET Expense Controller
/*******************************************************/
exports.getExpense = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const expenses = await expenseModel.findAll({
      where: { userId: req.user.id },
      attributes: ['id', 'amount', 'description', 'category'],
    });
    // console.log(users);
    const totalExpense = await expenseModel.findAll({
      attributes: ['userId', [sequelize.fn('sum', sequelize.col('expenses.amount')), 'total_cost']], group: ['userID']
    });
    console.log("total expense");
    console.log(totalExpense);
    res.status(200).json({ allExpenses: expenses });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/*******************************************************/
//  GET Single User Details Controller
/*******************************************************/
exports.getUserDetails = async (req, res, next) => {
  try {
    console.log("inside get orders backend");
    console.log(req.user.id);
    const user = await userModel.findAll({
      where: { id: req.user.id },
    });

    console.log(user);
    res.status(200).json({ users: user });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/*******************************************************/
// Delete Expense Controller
/*******************************************************/
exports.postDeleteExpense = async (req, res, next) => {
  try {
    console.log("inside post delete backend");
    const expenseId = req.params.expenseId;
    console.log(expenseId);
    await expenseModel.destroy({ where: { id: expenseId } });

    res.status(200).send("deleted succesfully");
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

/*******************************************************/
// Edit Expense Controller
/*******************************************************/
exports.postEditExpense = (req, res, next) => {
  console.log("inside post editer backend");
  const expenseId = req.params.expenseId;
  const amount = req.body.amount;
  const description = req.body.discription;
  const category = req.body.category;

  expenseModel
    .update(
      {
        amount: amount,
        description: description,
        category: category,
      },
      { where: { id: expenseId } }
    )
    .then((user) => {
      console.log("consoled updated succesfully");
      res.send("updated successfully");
    })
    .catch((err) => console.log(err.message));
};

/*******************************************************/
//  GET Premium Controller
/*******************************************************/
exports.getPurchasePremium = async (req, res) => {
  // console.log("inside razor backend");
  // console.log(process.env.RAZORPAY_KEY_ID);
  // console.log(process.env.RAZORPAY_KEY_SECRET);
  try {
    //  Initialize Razorpay with  API key_id and key_secret
    let rzp = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
    const amount = 100;
    // if successfull then Razorpay creates an "order"
    rzp.orders.create({ amount, currency: "INR" }, async (err, order) => {
      if (err) {
        throw new Error(JSON.stringify(err));
      }

      try {
        //
        /*await req.user.createOrderModel({ orderid: order.id, status: "PENDING" });
         return res.status(201).json({ order, key_id: rzp.key_id });*/
        // If successful, create a new order in the database using Sequelize's create method.
        const createdOrder = await orderModel.create({
          orderid: order.id,
          status: "PENDING",
          userId: req.user.id,
        });
        //It sends a JSON response to the frontend containing the order details and Razorpay key.
        return res.status(201).json({ order: createdOrder, key_id: rzp.key_id });
      } catch (err) {
        throw new Error(err);
      }
    });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: "Something went wrong", error: err.message });
  }
};

/*******************************************************/
//  Update Transaction Status Controller
/*******************************************************/
exports.postUpdateTransactionStatus = async (req, res) => {
  try {
    console.log("inside update premium backend");
    const { payment_id, order_id } = req.body;
    console.log(req.user.dataValues.id);

    // Use async/await for cleaner and more readable code
    const order = await orderModel.findOne({ where: { orderid: order_id } });
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    // Update the specific order record
    const updateData = {
      paymentid: payment_id,
      status: "SUCCESSFUL",
    };
    await orderModel.update(updateData, {
      where: {
        orderid: order_id, // Specify the condition for the update
      },
    });
    // Update the specific order record
    const updateUser = {
      ispremiumuser: true,
    };
    await userModel.update(updateUser, {
      where: {
        id: req.user.dataValues.id, // Specify the condition for the update
      },
    });

    // Update the user record to indicate premium status
    // await req.user.update({ ispremiumuser: true });

    return res.status(202).json({ success: true, message: "Transaction Successful" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
