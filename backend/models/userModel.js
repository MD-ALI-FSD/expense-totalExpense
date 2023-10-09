//Importing Sequelize Class and Object
const Sequelize = require("sequelize");
const sequelize = require("../util/database");

//Creating product modal(modal of the object)
const User = sequelize.define("users", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  name: Sequelize.STRING,
  email: {
    type: Sequelize.STRING,
    unique: true,
  },
  phonenumber: {
    type: Sequelize.STRING,
    unique: true,
  },
  password: Sequelize.STRING,
  ispremiumuser: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
});

module.exports = User;
