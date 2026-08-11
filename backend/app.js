const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const userRouter = require("./routes/users");

const app = express();

dotenv.config();

//// Middleware to parse incoming JSON request bodies and make them available in req.body
app.use(express.json());

mongoose.connect(process.env.MONGO_URL).then((conn) => {
  console.log("MongoDB is connectedddd");
});

app.use("/api/v2", userRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is started at port no : ${process.env.PORT}`);
});
