const mongoose = require("mongoose");
const { MONGOURL } = require("./keys");

const conectDB = () =>
  mongoose.connect(MONGOURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
mongoose.connection.on("connected", () => {
  console.log("DB connected");
});
mongoose.connection.on("error", (error) => {
  console.log("connection failed", error);
});

module.exports = conectDB;
