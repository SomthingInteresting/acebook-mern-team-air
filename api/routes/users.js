const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/users");

router.post("/", UsersController.Create);
router.post("/addfriend", UsersController.AddFriend); 

module.exports = router;