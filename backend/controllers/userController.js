const UserModel = require("../model/userModel");

exports.getUsers = async (req, res, next) => {
  try {
    const users = await UserModel.find();

    res.json({
      message: "Get Users Is Working",
      users,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal Sever Errrrorr" });
  }
};

exports.postUser = async (req, res, next) => {
  try {
    console.log("Working123");
    const userData = new UserModel(req.body);
    const { email, password } = userData;

    const userExist = await UserModel.findOne({ email });

    if (userExist) {
      return res.status(400).json({ message: "User Alredy exists" });
    }
    const savedUser = await userData.save();
    res.status(200).json(savedUser);
  } catch (error) {
    res.status(500).json({ mesggae: "Error occured from post user api" });
  }
};
