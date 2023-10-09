//Importing Sequelize Class and Object
const Sequelize = require("sequelize");
const sequelize = require("../util/database");

//Creating product modal(modal of the object)
const Expense = sequelize.define("expenses", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  amount: Sequelize.INTEGER,
  description: Sequelize.STRING,
  category: Sequelize.STRING,
});

module.exports = Expense;
