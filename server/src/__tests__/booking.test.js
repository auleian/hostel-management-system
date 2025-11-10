import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import bookingRoutes from '../Routes/bookingRoutes.js';
import authRoutes from '../Routes/auth.js';
import Booking from '../models/bookingModel.js';
import Room from '../models/roomModel.js';
import Hostel from '../models/hostelModel.js';
import User from '../models/User.js';
import { protect } from '../middleware/auth.js';

const app = express();
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/bookings', protect, bookingRoutes);

beforeAll(async () => {
  const url = process.env.MONGO_TEST_URI || 'mongodb://127.0.0.1:27017/booking_test';
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await Booking.deleteMany({});
  await Room.deleteMany({});
  await Hostel.deleteMany({});
  await User.deleteMany({});
});

describe('Booking Tests', () => {
  let token;
  let userId;
  let hostelId;
  let roomId;

  beforeEach(async () => {
    // Create a user and get token
    const userResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    
    token = userResponse.body.token;
    userId = userResponse.body.user.id;

    // Create a hostel
    const hostel = await Hostel.create({
      name: 'Test Hostel',
      location: 'Kampala',
      priceRange: { min: 500000, max: 600000 },
    });
    hostelId = hostel._id;

    // Create a room
    const room = await Room.create({
      roomNumber: '101',
      roomType: 'single',
      price: 500000,
      hostel: hostelId,
      images: ['room1.jpg'],
    });
    roomId = room._id;
  });

  describe('POST /api/bookings', () => {
    it('should create a booking successfully', async () => {
      const bookingData = {
        room: roomId.toString(),
        checkInDate: new Date('2024-12-01').toISOString(),
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData)
        .expect(201);

      expect(response.body.message).toBe('Booking created successfully');
      expect(response.body.booking).toHaveProperty('_id');
      expect(response.body.booking.status).toBe('pending');
      expect(response.body.booking.room._id).toBe(roomId.toString());
    });

    it('should fail without authentication', async () => {
      const bookingData = {
        room: roomId.toString(),
        checkInDate: new Date('2024-12-01').toISOString(),
      };

      await request(app)
        .post('/api/bookings')
        .send(bookingData)
        .expect(401);
    });

    it('should fail with missing required fields', async () => {
      const bookingData = {
        checkInDate: new Date('2024-12-01').toISOString(),
        // missing room
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData)
        .expect(400);

      expect(response.body.message).toBe('Missing required booking fields');
    });

    it('should fail with non-existent room', async () => {
      const fakeRoomId = new mongoose.Types.ObjectId();
      const bookingData = {
        room: fakeRoomId.toString(),
        checkInDate: new Date('2024-12-01').toISOString(),
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData)
        .expect(404);

      expect(response.body.message).toBe('Room not found');
    });

    it('should link booking to authenticated user', async () => {
      const bookingData = {
        room: roomId.toString(),
        checkInDate: new Date('2024-12-01').toISOString(),
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData)
        .expect(201);

      expect(response.body.booking.bookedby).toBe(userId);
    });
  });

  describe('GET /api/bookings', () => {
    beforeEach(async () => {
      // Create multiple bookings
      await Booking.create([
        {
          room: roomId,
          checkInDate: new Date('2024-12-01'),
          status: 'pending',
          bookedby: userId,
        },
        {
          room: roomId,
          checkInDate: new Date('2024-12-15'),
          status: 'confirmed',
          bookedby: userId,
        },
      ]);
    });

    it('should get all bookings', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      expect(response.body[0]).toHaveProperty('room');
      expect(response.body[0]).toHaveProperty('bookedby');
    });

    it('should fail without authentication', async () => {
      await request(app)
        .get('/api/bookings')
        .expect(401);
    });

    it('should populate room and hostel information', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body[0].room).toHaveProperty('roomNumber');
      expect(response.body[0].room.hostel).toHaveProperty('name');
    });

    it('should populate user information', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body[0].bookedby).toHaveProperty('name');
      expect(response.body[0].bookedby).toHaveProperty('email');
    });

    it('should return bookings in descending order by creation date', async () => {
      const response = await request(app)
        .get('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toHaveLength(2);
      // Assuming the second booking was created later
      const firstBooking = new Date(response.body[0].createdAt);
      const secondBooking = new Date(response.body[1].createdAt);
      expect(firstBooking >= secondBooking).toBe(true);
    });
  });

  describe('Booking Status', () => {
    it('should default booking status to pending', async () => {
      const bookingData = {
        room: roomId.toString(),
        checkInDate: new Date('2024-12-01').toISOString(),
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData)
        .expect(201);

      expect(response.body.booking.status).toBe('pending');
    });
  });

  describe('Booking Validation', () => {
    it('should accept valid date formats', async () => {
      const bookingData = {
        room: roomId.toString(),
        checkInDate: '2024-12-01T00:00:00.000Z',
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData)
        .expect(201);

      expect(response.body.booking).toHaveProperty('checkInDate');
    });

    it('should include optional checkOutDate if provided', async () => {
      const bookingData = {
        room: roomId.toString(),
        checkInDate: new Date('2024-12-01').toISOString(),
        checkOutDate: new Date('2024-12-31').toISOString(),
      };

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${token}`)
        .send(bookingData)
        .expect(201);

      expect(response.body.booking).toHaveProperty('checkOutDate');
    });
  });
});