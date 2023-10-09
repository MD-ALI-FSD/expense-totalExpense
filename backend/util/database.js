const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("main-expense-app", "root", "a9431453655@A", {
  dialect: "mysql",
  host: "localhost",
});

module.exports = sequelize;
