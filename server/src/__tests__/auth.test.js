import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from '../routes/auth.js';
import User from '../models/User.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);

// Mock database connection
beforeAll(async () => {
  const url = process.env.MONGO_TEST_URI || 'mongodb://127.0.0.1:27017/booking_test';
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await User.deleteMany({});
});

describe('Authentication Tests', () => {
  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        contact: '1234567890',
        userType: 'student'
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.name).toBe(userData.name);
      expect(response.body.user.email).toBe(userData.email);
      expect(response.body.user).not.toHaveProperty('password');
    });

    it('should fail registration with missing required fields', async () => {
      const userData = {
        email: 'test@example.com',
        // missing name and password
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(422);

      expect(response.body).toHaveProperty('errors');
      expect(Array.isArray(response.body.errors)).toBe(true);
    });

    it('should fail registration with invalid email', async () => {
      const userData = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(422);

      expect(response.body.errors).toBeDefined();
    });

    it('should fail registration with short password', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: '123',
      };

      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(422);

      expect(response.body.errors).toBeDefined();
    });

    it('should fail registration with duplicate email', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      // First registration
      await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(201);

      // Second registration with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send(userData)
        .expect(400);

      expect(response.body.msg).toBe('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
    });

    it('should login successfully with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      expect(response.body).toHaveProperty('token');
      expect(response.body.user).toHaveProperty('id');
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should fail login with invalid email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body.msg).toBe('Invalid credentials');
    });

    it('should fail login with invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(400);

      expect(response.body.msg).toBe('Invalid credentials');
    });

    it('should fail login with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@example.com',
        })
        .expect(422);

      expect(response.body.errors).toBeDefined();
    });
  });

  describe('GET /api/auth/me', () => {
    let token;

    beforeEach(async () => {
      // Register and get token
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Test User',
          email: 'test@example.com',
          password: 'password123',
        });
      token = response.body.token;
    });

    it('should get current user with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body.email).toBe('test@example.com');
      expect(response.body).not.toHaveProperty('password');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.msg).toBe('No token, authorization denied');
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid_token')
        .expect(401);

      expect(response.body.msg).toBe('Token is not valid');
    });
  });

  describe('GET /api/auth/check-admin', () => {
    it('should return true for admin user', async () => {
      // Create admin user directly
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        userType: 'admin',
      });

      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'admin@example.com',
          password: 'password123',
        });

      const token = response.body.token;

      const adminCheck = await request(app)
        .get('/api/auth/check-admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(adminCheck.body.isAdmin).toBe(true);
    });

    it('should return false for student user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          name: 'Student User',
          email: 'student@example.com',
          password: 'password123',
          userType: 'student',
        });

      const token = response.body.token;

      const adminCheck = await request(app)
        .get('/api/auth/check-admin')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(adminCheck.body.isAdmin).toBe(false);
    });
  });
});