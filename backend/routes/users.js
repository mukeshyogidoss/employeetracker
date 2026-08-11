const express = require("express");
const { getUsers, postUser } = require("../controllers/userController");

const router = express.Router();

router.route("/users").get(getUsers);
router.route("/createuser").post(postUser);

module.exports = router;
