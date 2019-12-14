const Sequelize = require("sequelize");
const db = require("../db");
const User = require("../user/model");

const Message = db.define("message", {
  text: Sequelize.STRING
});

Message.belongsTo(User);

module.exports = Message;
