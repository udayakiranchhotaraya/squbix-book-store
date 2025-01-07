const request = require('supertest');
const { connect, closeDatabase, clearDatabase } = require('../tests.setup');
const app = require('../../src/app');
const { User } = require('../../src/models');

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await closeDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});

describe("User API controller", () => {
  describe("POST /api/auth/signup", () => {
    it("should register a new user", async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: { firstName: "Test", lastName: "User" },
          email: "test@example.com",
          password: "password123"
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.message).toBe("User registration successful");
      expect(res.body).toHaveProperty('token');
    });

    it("should not register a user with duplicate email", async () => {
      await User.create({
        name: { firstName: "Test", lastName: "User" },
        email: "test@example.com",
        password: "password123"
      });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: { firstName: "Another Test", lastName: "User" },
          email: "test@example.com",
          password: "password123"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', "E11000 duplicate key error collection: test.users index: email_1 dup key: { email: \"test@example.com\" }");
    });

    it("should not register a user with missing fields", async () => {
      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          email: "test@example.com"
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('message', "User validation failed: name.firstName: Path `name.firstName` is required., password: Path `password` is required.");
    });
  });

  describe("POST /api/auth/signin", () => {
    beforeEach(async () => {
      await User.create({
        name: { firstName: "Test", lastName: "User" },
        email: "test@example.com",
        password: "password123"
      });
    });

    it("should login an existing user", async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: "test@example.com",
          password: "password123"
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', "User login successful");
      expect(res.body).toHaveProperty('token');
    });

    it("should not login with invalid email", async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: "wrong@example.com",
          password: "password123"
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', "Invalid credentials");
    });

    it("should not login with incorrect password", async () => {
      const res = await request(app)
        .post('/api/auth/signin')
        .send({
          email: "test@example.com",
          password: "wrongpassword"
        });

      expect(res.statusCode).toBe(401);
      expect(res.body).toHaveProperty('message', "Invalid credentials");
    });
  });
});
