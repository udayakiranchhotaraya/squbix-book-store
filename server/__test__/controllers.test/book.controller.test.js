const request = require('supertest');
const { connect, closeDatabase, clearDatabase } = require('../tests.setup');
const app = require('../../src/app');

beforeAll(async () => {
  await connect();
});

afterAll(async () => {
  await closeDatabase();
});

beforeEach(async () => {
  await clearDatabase();
});

describe("Book API controller", () => {

    describe("POST /api/books", () => {
        let adminToken;

        beforeEach(async () => {
            // Create an admin user and get token
            const adminRes = await request(app)
                .post('/api/auth/signup')
                .send({
                    name: { firstName: "Admin", lastName: "User" },
                    email: "admin@example.com",
                    password: "admin123",
                    role: "Admin"
                });
            adminToken = adminRes.body.token;
        });

        it("should create a new book", async () => {
            const res = await request(app)
                .post('/api/books')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: "Book Title",
                    description: "A great book",
                    author: "Author Name",
                    genre: "Fiction",
                });

            expect(res.statusCode).toBe(201);
            expect(res.body).toHaveProperty('message', "New book created successfully");
            expect(res.body).toHaveProperty('book');
        });

        it("should not create a book without required fields", async () => {
            const res = await request(app)
                .post('/api/books')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: "Incomplete Book"
                });

            expect(res.statusCode).toBe(400);
            expect(res.body).toHaveProperty('message');
        });

        it("should not allow non-admin users to create a book", async () => {
            const userRes = await request(app)
                .post('/api/auth/signup')
                .send({
                    name: { firstName: "Test", lastName: "User" },
                    email: "test@example.com",
                    password: "password123",
                });

            const userToken = userRes.body.token;

            const res = await request(app)
                .post('/api/books')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                    title: "Unauthorized Book",
                    description: "Trying unauthorized creation",
                    author: "User Author",
                    genre: "Drama",
                });

            expect(res.statusCode).toBe(403);
            expect(res.body).toHaveProperty('message', "Access denied.");
        });
    });

    describe("GET /api/books", () => {
        beforeEach(async () => {
            const adminRes = await request(app)
                .post('/api/auth/signup')
                .send({
                    name: { firstName: "Admin", lastName: "User" },
                    email: "admin@example.com",
                    password: "admin123",
                    role: "Admin"
                });
            adminToken = adminRes.body.token;
            // Seed database with books
            await request(app)
                .post('/api/books')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: "Book 1",
                    description: "First book description",
                    author: "Author 1",
                    genre: "Fiction",
                });
            await request(app)
                .post('/api/books')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: "Book 2",
                    description: "Second book description",
                    author: "Author 2",
                    genre: "Non-fiction",
                });
        });

        it("should fetch all books", async () => {
            const res = await request(app)
                .get('/api/books');

            expect(res.statusCode).toBe(200);
            expect(res.body.books).toHaveLength(2);
            expect(res.body).toHaveProperty('message', "Books fetched successfully");
        });

        it("should return empty array if no books are available", async () => {
            await clearDatabase();

            const res = await request(app)
                .get('/api/books');

            expect(res.statusCode).toBe(200);
            expect(res.body.books).toHaveLength(0);
        });

        it('should fetch books from the cache if available', async () => {
            await Book.create({ title: 'Book 1', description: 'A great book', author: 'Author 1' });
      
            const res = await request(app).get('/books').set('Authorization', `Bearer ${token}`);
            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('source', 'Database');
      
            const cachedRes = await request(app).get('/books').set('Authorization', `Bearer ${token}`);
            expect(cachedRes.statusCode).toBe(200);
            expect(cachedRes.body).toHaveProperty('source', 'Cache');
        });
    });

    describe("GET /api/books/:id", () => {
        let bookId;

        beforeEach(async () => {
            const res = await request(app)
                .post('/api/books')
                .set('Authorization', `Bearer ${adminToken}`)
                .send({
                    title: "Single Book",
                    description: "Detailed description",
                    author: "Single Author",
                    genre: "Drama",
                });

            bookId = res.body.book._id;
        });

        it("should fetch a book by ID", async () => {
            const res = await request(app)
                .get(`/api/books/${bookId}`);

            expect(res.statusCode).toBe(200);
            expect(res.body).toHaveProperty('book');
            expect(res.body.book.title).toBe("Single Book");
        });

        it("should return 404 if book is not found", async () => {
            const invalidId = mongoose.Types.ObjectId();
            const res = await request(app)
                .get(`/api/books/${invalidId}`);

            expect(res.statusCode).toBe(404);
            expect(res.body).toHaveProperty('message', "Book not found");
        });
    });
});
