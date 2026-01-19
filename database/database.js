require("dotenv").config();
const { Sequelize } = require("sequelize");

const connection = new Sequelize(process.env.DATABASE_URL, {
  dialect: "mysql",
  logging: false,
});

module.exports = connection;
