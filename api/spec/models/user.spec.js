const mongoose = require("mongoose");

require("../mongodb_helper");
const User = require("../../models/user");

describe("User model", () => {
  beforeEach((done) => {
    mongoose.connection.collections.users.drop(() => {
      done();
    });
  });

  it("has an email address", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
    });
    expect(user.email).toEqual("someone@example.com");
  });

  it("has a password", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
    });
    expect(user.password).toEqual("password");
  });

  it("has firstName, lastName and profile picture", () => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
        firstName: "Betty",
        lastName: "Rubble",
    });
      expect(user.firstName).toEqual("Betty")
      expect(user.lastName).toEqual("Rubble")
  });

  it("can list all users", (done) => {
    User.find((err, users) => {
      expect(err).toBeNull();
      expect(users).toEqual([]);
      done();
    });
  });

  it("can save a user", (done) => {
    const user = new User({
      email: "someone@example.com",
      password: "password",
      firstName: "Betty",
      lastName: "Rubble",
    });

    user.save((err) => {
      expect(err).toBeNull();

      User.find((err, users) => {
        expect(err).toBeNull();

        expect(users[0]).toMatchObject({
          email: "someone@example.com",
          password: "password",
          firstName: "Betty",
          lastName: "Rubble",
        });
        done();
      });
    });
  });

  it("can add friends", async () => {
    const user1 = new User({
      email: "someone1@example.com",
      password: "password1",
      firstName: "Fred",
      lastName: "Flintstone",
    });
  
    const user2 = new User({
      email: "someone2@example.com",
      password: "password2",
      firstName: "Barney",
      lastName: "Rubble",
    });
  
    await user1.save();
    await user2.save();
  
    user1.friends.push(user2);
    await user1.save();
    // console.log(user1)
    const user = await User.findById(user1._id);
    expect(user.friends[0].toString()).toEqual(user2._id.toString());
  });  
});
