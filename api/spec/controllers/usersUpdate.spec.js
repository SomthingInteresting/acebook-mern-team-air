const app = require("../../app");
const request = require("supertest");
require("../mongodb_helper");
const User = require("../../models/user");

describe("User Updates", () => {
  let user; // user variable declared at top level so anything below it can use it via the below hook 

  beforeEach(async () => {      //runs literally before each 'it' test
    await User.deleteMany({});  // deletes everything before each test run

    user = new User({           //creates a new user that will be used in every single test, as declared by let user;
      email: "daved@test.com",
      password: "5678",
      firstName: "Dave",
      lastName: "David",
    });
    await user.save();        //saves newly created user
  });

  describe("when updating only the first name", () => {
    const updatedFields = {
      firstName: "John",
    };
    let response;

    beforeEach(async () => {
      response = await request(app)
        .put(`/usersUpdate/${user._id}`)
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
      lastName: "Perry"
    };
    let response;

    beforeEach(async () => {
      response = await request(app)
        .put(`/usersUpdate/${user._id}`)
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

  describe("when updating email only", () => {
    const updatedFields = {
      email: "newJohn@email.com"
    };
    let response;

    beforeEach(async () => {
      response = await request(app)
        .put(`/usersUpdate/${user._id}`)
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
      password: "one2three"
    };
    let response;

    beforeEach(async () => {
      response = await request(app)
        .put(`/usersUpdate/${user._id}`)
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
      response = await request(app)
        .delete(`/usersUpdate/${user._id}`)
    });

    it("should return status 200", async () => {
      expect(response.statusCode).toEqual(200);
    });

    it("not be able to find the deleted user in database", async () => {
      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });
})

});
