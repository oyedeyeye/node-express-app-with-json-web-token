const mongoose = require("mongoose");
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI;

exports.connect = () => {
  // connecting to the database
  mongoose
    .connect(MONGO_URI)
    .then(() => {
      console.log("Successfully Connected to the Database");
    })
    .catch((error) => {
      console.log("Database connection failed. exiting now...");
      console.error(error);
      process.exit(1);
    });
};
