const app = require("../../app");
const request = require("supertest");
require("../mongodb_helper");
const User = require("../../models/user");
const TokenGenerator = require("../../models/token_generator");
const Post = require("../../models/post");

describe("User Updates", () => {
  let user;
  let new_token;
  let post;

  beforeEach(async () => {
    await User.deleteMany({});
    await Post.deleteMany({});

    user = new User({
      email: "daved@test.com",
      password: "5678",
      firstName: "Dave",
      lastName: "David",
    });
    await user.save();

    new_token = TokenGenerator.jsonwebtoken(user._id);

    post = new Post({
      message: 'Test post',
      comments: [
        {
          comment: "Test comment for deleted user",
          author: {
            id: user._id,
            name: `${user.firstName} ${user.lastName}`,
            firstName: user.firstName,
            lastName: user.lastName,
          }
        }
      ]
    });
    await post.save();
  });

  describe('when encountering an error during update', () => {
    const updatedFields = {
      email: 'newemail@test.com',
    };
    let response;

    beforeEach(async () => {
      // Mock the error by setting UserId to an invalid value
      const invalidUserId = 'invalid_user_id';
      const token = TokenGenerator.jsonwebtoken(invalidUserId);

      response = await request(app)
        .put('/userUpdatesRoute')
        .set('Cookie', [`token=${token}`])
        .send(updatedFields);
    });

    it('should return status 400', async () => {
      expect(response.statusCode).toEqual(400);
    });

    it('should return "Bad request" message', async () => {
      expect(response.body.message).toEqual('Bad request');
    });
  });

  describe("when updating only the first name", () => {
    const updatedFields = {
      firstName: "John",
    };
    let response;

    beforeEach(async () => {
      response = await request(app)
        .put(`/userUpdatesRoute`)
        .set('Cookie', [`token=${new_token}`])
        .send(updatedFields);
    });

    it("should return status 200", async () => {
      expect(response.statusCode).toEqual(200);
    });

    it("should update the first name", async () => {
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.firstName).toEqual(updatedFields.firstName);
    });
  });

  describe("when updating first and last name", () => {
    const updatedFields = {
      firstName: "John",
      lastName: "Perry",
    };
    let response;

    beforeEach(async () => {
      response = await request(app)
        .put(`/userUpdatesRoute`)
        .set('Cookie', [`token=${new_token}`])
        .send(updatedFields);
    });

    it("should return status 200", async () => {
      expect(response.statusCode).toEqual(200);
    });

    it("should update the first and last name", async () => {
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.firstName).toEqual(updatedFields.firstName);
      expect(updatedUser.lastName).toEqual(updatedFields.lastName);
    });
  });

  describe('when deleting a user that does not exist', () => {
    let response;

    beforeEach(async () => {
      // Delete the user to simulate the user not found scenario
      await User.findByIdAndDelete(user._id);

      response = await request(app)
        .delete('/userUpdatesRoute')
        .set('Cookie', [`token=${new_token}`]);
    });

    it('should return status 404', async () => {
      expect(response.statusCode).toEqual(404);
    });

    it('should return an error message "User not found"', async () => {
      expect(response.body.message).toEqual('User not found');
    });
  });


  describe("when updating email only", () => {
    const updatedFields = {
      email: "newJohn@email.com",
    };
    let response;

    beforeEach(async () => {
      response = await request(app)
        .put(`/userUpdatesRoute`)
        .set('Cookie', [`token=${new_token}`])
        .send(updatedFields);
    });

    it("should return status 200", async () => {
      expect(response.statusCode).toEqual(200);
    });

    it("should update the email only", async () => {
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.email).toEqual(updatedFields.email);
    });
  });

  describe("when updating password only", () => {
    const updatedFields = {
      password: "one2three",
    };
    let response;

    beforeEach(async () => {
      response = await request(app)
        .put(`/userUpdatesRoute`)
        .set('Cookie', [`token=${new_token}`])
        .send(updatedFields);
    });

    it("should return status 200", async () => {
      expect(response.statusCode).toEqual(200);
    });

    it("should update the password only", async () => {
      const updatedUser = await User.findById(user._id);
      expect(updatedUser.password).toEqual(updatedFields.password);
    });
  });

  

  describe("when deleting a user", () => {
    let response;

    beforeEach(async () => {
      response = await request(app).delete(`/userUpdatesRoute`).set('Cookie', [`token=${new_token}`]);
    });

    it("should return status 200", async () => {
      expect(response.statusCode).toEqual(200);
    });

    it("should delete the user and associated posts", async () => {
      const deletedUser = await User.findById(user._id);
      const updatedPost = await Post.findOne(post._id);

      expect(deletedUser).toBeNull();
      expect(updatedPost).toBeNull();
    });
  });
});
