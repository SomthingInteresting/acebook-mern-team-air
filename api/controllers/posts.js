const Post = require("../models/post");
const User = require("../models/user");
const TokenGenerator = require("../models/token_generator");

const PostsController = {
  // Retrieves a list of all posts
  Index: (req, res) => {
    Post.find(async (err, posts) => {
      if (err) {
        throw err;
      }
      // checks if the user is logged in and matches the user_id
      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(200).json({ posts: posts.reverse(), token: token });
    });
  },
  // It creates a post and saves it to the database
  Create: async (req, res) => {
    const { user_id } = req;
    const { body } = req;

    try {
      const user = await User.findById(user_id);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const post = new Post({
        ...body,
        timestamp: new Date(),
        firstName: user.firstName,
        lastName: user.lastName,
        icon: user.icon,
      });

      const savedPost = await post.save();

      const token = await TokenGenerator.jsonwebtoken(req.user_id);
      res.status(201).json({ message: "OK", token: token, post: savedPost });
    } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  },

  AddLikes: (req, res) => {
    const postId = req.params.id;
    const userId = req.user_id;
    Post.findById(postId, (err, post) => {
      if (err) {
        throw err;
      }

      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }

      // Check if the user has already liked the post
      if (post.likedBy.includes(userId)) {
        return res
          .status(400)
          .json({ message: "You've already liked this post." });
      }

      const updatedPost = post;
      updatedPost.like += 1;
      updatedPost.likedBy.push(userId);

      updatedPost.save(async (err, updatedPost) => {
        if (err) {
          throw err;
        }

        const token = await TokenGenerator.jsonwebtoken(userId);
        res
          .status(201)
          .json({ message: "OK", token: token, post: updatedPost });
      });
    });
  },

  RemoveLikes: (req, res) => {
    const postId = req.params.id;
    const userId = req.user_id;

    Post.findById(postId, (err, post) => {
      if (err) {
        throw err;
      }

      const updatedPost = post;
      updatedPost.like -= 1;
      updatedPost.likedBy = updatedPost.likedBy.filter((id) => id !== userId);

      updatedPost.save(async (err, updatedPost) => {
        if (err) {
          throw err;
        }
        const token = await TokenGenerator.jsonwebtoken(userId);
        res
          .status(201)
          .json({ message: "OK", token: token, post: updatedPost });
      });
    });
  },

  CreateComment: (req, res) => {
    const postId = req.params.id;
    const { comment } = req.body;

    const userId = req.user_id;

    // A better way would have been to update the token generator but that may break other functions + tests
    User.findById(userId, async (err, user) => {
      if (err) {
        throw err;
      }

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const userName = `${user.firstName} ${user.lastName}`;

      Post.findById(postId, async (err, post) => {
        if (err) {
          throw err;
        }

        post.comments.push({
          comment: comment,
          author: { id: userId, name: userName },
        });
        post.save(async (err, updatedPost) => {
          if (err) {
            throw err;
          }

          const token = await TokenGenerator.jsonwebtoken(userId);
          res
            .status(201)
            .json({ message: "OK", token: token, post: updatedPost });
        });
      });
    });
  },
};

module.exports = PostsController;
