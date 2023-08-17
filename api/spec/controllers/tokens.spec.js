const app = require("../../app");
const request = require("supertest");
require("../mongodb_helper");
const User = require('../../models/user');

describe.only("/tokens", () => {
  beforeAll( () => {
    const user = new User({ email: "test@test.com", password: "12345678",  firstName: "Betty",
    lastName: "Rubble" })
    user.save()
  });

  afterAll( async () => {
    await User.deleteMany({})
  })

  test("a token is returned when creds are valid", async () => {
    let response = await request(app)
      .post("/tokens")
      .send({email: "test@test.com", password: "12345678"})
    expect(response.status).toEqual(201)
    expect(response.body.token).not.toEqual(undefined)
    expect(response.body.message).toEqual("OK")
  })


  test("a token is not returned when creds are invalid", async () => {
    let response = await request(app)
      .post("/tokens")
      .send({email: "test@test.com", password: "1234"})
    expect(response.status).toEqual(401)
    expect(response.body.token).toEqual(undefined)
    expect(response.body.message).toEqual("auth error")
  })

  test('should return status 401 and "auth error" message when user is not found', async () => {
    const response = await request(app)
      .post('/tokens')
      .send({ email: 'nonexistent@test.com', password: 'password123' });

    expect(response.status).toEqual(401);
    expect(response.body.message).toEqual('auth error');
  });

})