const express = require("express");
const router = express.Router();

const UsersController = require("../controllers/usersUpdate");

router.put("/:id", UsersController.Update);
router.delete("/:id", UsersController.Delete);

module.exports = router;