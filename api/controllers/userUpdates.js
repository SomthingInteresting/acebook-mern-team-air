const TokenDecoder = require("../models/token_decoder");
const User = require("../models/user");
const Post = require("../models/post");

const UserUpdates = {
  Update: (req, res) => {
    console.log("Request cookies:", req.cookies);
    const decodedToken = TokenDecoder.decode(req.cookies.token);
    if (!decodedToken || !decodedToken.user_id) {
        return res.status(400).json({ message: "Invalid or expired token." });
    }
    const UserId = decodedToken.user_id;
    console.log("decoded_user_id", UserId);

    console.log("Request data:", req.body);
    const { email, password, firstName, lastName, icon } = req.body;

    const updateFields = {};
    if (email) updateFields.email = email;
    if (password) updateFields.password = password;
    if (firstName) updateFields.firstName = firstName;
    if (lastName) updateFields.lastName = lastName;
    if (icon) updateFields.icon = icon;

    User.findByIdAndUpdate(
      UserId,
      updateFields,
      { new: true, strict: false },
      (err, user) => {
        if (err) {
          console.error("Error during user update:", err);
          res.status(500).json({ message: "Internal Server Error", error: err.message });
        } else {
          res.status(200).json({ message: "OK", user });
        }
      }
    );    
  },

  Delete: async (req, res) => {
    const decodedToken = TokenDecoder.decode(req.cookies.token);
    if (!decodedToken || !decodedToken.user_id) {
        return res.status(400).json({ message: "Invalid or expired token." });
    }
    const UserId = decodedToken.user_id;

    try {
      const deletedUser = await User.findByIdAndDelete(UserId);

      if (!deletedUser) {
        res.status(404).json({ message: "User not found" });
        return;
      }

      await Post.deleteMany({ $or: [
        { firstName: deletedUser.firstName, lastName: deletedUser.lastName },
        { "comments.author.id": UserId }
      ]});

      res.status(200).json({ message: "OK", user: deletedUser });
    } catch (err) {
      console.log("UserUpdates error", err);
      res.status(400).json({ message: "Bad request" });
    }
  },
};

module.exports = UserUpdates;
