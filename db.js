const Sequelize = require("sequelize");
const databaseUrl = "postgres://postgres:secret@localhost:5432/postgres";
const db = new Sequelize(databaseUrl);

db.sync({ force: false }) // dont delete data on sync
  .then(() => console.log("DB connected"));

module.exports = db;
