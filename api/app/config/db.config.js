const mongoose = require("mongoose");
const axios = require("axios");
const adafruit_url = require("../config/adafruit.config");
const models = require("../models/models");

dbname = "EnergyDB";
url =
  "mongodb+srv://tnghja:<password>@cluster0.ttmlzs6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
connectDB = mongoose
  .connect(url, { dbname })
  .then(() => {
    console.log("Connect MongoDB successfully");
  })
  .catch((err) => {
    console.error("Connect fail, try again", err);
  });

module.exports = connectDB;

