import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import roomRoutes from '../routes/roomRoutes.js';
import Room from '../models/roomModel.js';
import Hostel from '../models/hostelModel.js';

const app = express();
app.use(express.json());
app.use('/api/rooms', roomRoutes);

beforeAll(async () => {
  const url = process.env.MONGO_TEST_URI || 'mongodb://127.0.0.1:27017/booking_test';
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await Room.deleteMany({});
  await Hostel.deleteMany({});
});

describe('Room Tests', () => {
  let hostelId;

  beforeEach(async () => {
    // Create a hostel for room tests
    const hostel = await Hostel.create({
      name: 'Test Hostel',
      location: 'Kampala',
      priceRange: { min: 500000, max: 600000 },
    });
    hostelId = hostel._id;
  });

  describe('POST /api/rooms', () => {
    it('should create a room successfully', async () => {
      const roomData = {
        roomNumber: '101',
        roomType: 'single',
        price: 500000,
        hostel: hostelId.toString(),
        images: ['room1.jpg'],
        moreInfo: 'Spacious single room',
        isSelfContained: true,
        amenities: ['wifi', 'desk'],
      };

      const response = await request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect(201);

      expect(response.body.roomNumber).toBe('101');
      expect(response.body.roomType).toBe('single');
      expect(response.body.price).toBe(500000);
      expect(response.body.isAvailable).toBe(true); // default value
    });

    it('should fail without required fields', async () => {
      const roomData = {
        roomNumber: '101',
        // missing roomType, price, hostel, images
      };

      await request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect(400);
    });

    it('should fail with invalid room type', async () => {
      const roomData = {
        roomNumber: '101',
        roomType: 'invalid_type',
        price: 500000,
        hostel: hostelId.toString(),
        images: ['room1.jpg'],
      };

      await request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect(400);
    });

    it('should fail with invalid amenities', async () => {
      const roomData = {
        roomNumber: '101',
        roomType: 'single',
        price: 500000,
        hostel: hostelId.toString(),
        images: ['room1.jpg'],
        amenities: ['invalid_amenity'],
      };

      await request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect(400);
    });

    it('should default isAvailable to true', async () => {
      const roomData = {
        roomNumber: '101',
        roomType: 'single',
        price: 500000,
        hostel: hostelId.toString(),
        images: ['room1.jpg'],
      };

      const response = await request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect(201);

      expect(response.body.isAvailable).toBe(true);
    });

    it('should default isSelfContained to false', async () => {
      const roomData = {
        roomNumber: '101',
        roomType: 'single',
        price: 500000,
        hostel: hostelId.toString(),
        images: ['room1.jpg'],
      };

      const response = await request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect(201);

      expect(response.body.isSelfContained).toBe(false);
    });
  });

  describe('GET /api/rooms', () => {
    beforeEach(async () => {
      // Create multiple rooms
      await Room.create([
        {
          roomNumber: '101',
          roomType: 'single',
          price: 500000,
          hostel: hostelId,
          images: ['room1.jpg'],
          isAvailable: true,
        },
        {
          roomNumber: '102',
          roomType: 'double',
          price: 700000,
          hostel: hostelId,
          images: ['room2.jpg'],
          isAvailable: false,
        },
        {
          roomNumber: '103',
          roomType: 'suite',
          price: 1000000,
          hostel: hostelId,
          images: ['room3.jpg'],
          isAvailable: true,
        },
      ]);
    });

    it('should get all rooms', async () => {
      const response = await request(app)
        .get('/api/rooms')
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('roomNumber');
      expect(response.body[0]).toHaveProperty('hostel');
    });

    it('should filter rooms by hostel', async () => {
      const response = await request(app)
        .get(`/api/rooms?hostel=${hostelId}`)
        .expect(200);

      expect(response.body).toHaveLength(3);
      response.body.forEach(room => {
        expect(room.hostel._id).toBe(hostelId.toString());
      });
    });

    it('should filter rooms by roomType', async () => {
      const response = await request(app)
        .get('/api/rooms?roomType=single')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].roomType).toBe('single');
    });

    it('should filter rooms by availability', async () => {
      const response = await request(app)
        .get('/api/rooms?isAvailable=true')
        .expect(200);

      expect(response.body).toHaveLength(2);
      response.body.forEach(room => {
        expect(room.isAvailable).toBe(true);
      });
    });

    it('should filter rooms by minPrice', async () => {
      const response = await request(app)
        .get('/api/rooms?minPrice=600000')
        .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(2);
      response.body.forEach(room => {
        expect(room.price).toBeGreaterThanOrEqual(600000);
      });
    });

    it('should filter rooms by maxPrice', async () => {
      const response = await request(app)
        .get('/api/rooms?maxPrice=600000')
        .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(1);
      response.body.forEach(room => {
        expect(room.price).toBeLessThanOrEqual(600000);
      });
    });

    it('should filter rooms by price range', async () => {
      const response = await request(app)
        .get('/api/rooms?minPrice=600000&maxPrice=800000')
        .expect(200);

      response.body.forEach(room => {
        expect(room.price).toBeGreaterThanOrEqual(600000);
        expect(room.price).toBeLessThanOrEqual(800000);
      });
    });

    it('should combine multiple filters', async () => {
      const response = await request(app)
        .get(`/api/rooms?hostel=${hostelId}&roomType=single&isAvailable=true`)
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].roomType).toBe('single');
      expect(response.body[0].isAvailable).toBe(true);
    });

    it('should populate hostel information', async () => {
      const response = await request(app)
        .get('/api/rooms')
        .expect(200);

      expect(response.body[0].hostel).toHaveProperty('name');
      expect(response.body[0].hostel).toHaveProperty('location');
    });
  });

  describe('GET /api/rooms/:id', () => {
    let roomId;

    beforeEach(async () => {
      const room = await Room.create({
        roomNumber: '101',
        roomType: 'single',
        price: 500000,
        hostel: hostelId,
        images: ['room1.jpg'],
      });
      roomId = room._id.toString();
    });

    it('should get a room by id', async () => {
      const response = await request(app)
        .get(`/api/rooms/${roomId}`)
        .expect(200);

      expect(response.body.roomNumber).toBe('101');
      expect(response.body._id).toBe(roomId);
    });

    it('should return 404 for non-existent room', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/rooms/${fakeId}`)
        .expect(404);
    });

    it('should return 500 for invalid room id', async () => {
      await request(app)
        .get('/api/rooms/invalid_id')
        .expect(500);
    });

    it('should populate hostel information', async () => {
      const response = await request(app)
        .get(`/api/rooms/${roomId}`)
        .expect(200);

      expect(response.body.hostel).toHaveProperty('name');
      expect(response.body.hostel.name).toBe('Test Hostel');
    });
  });

  describe('Room Validation', () => {
    it('should accept valid room types', async () => {
      const roomTypes = ['single', 'double', 'suite'];

      for (const roomType of roomTypes) {
        const roomData = {
          roomNumber: `10${roomTypes.indexOf(roomType)}`,
          roomType,
          price: 500000,
          hostel: hostelId.toString(),
          images: ['room.jpg'],
        };

        const response = await request(app)
          .post('/api/rooms')
          .send(roomData)
          .expect(201);

        expect(response.body.roomType).toBe(roomType);
      }
    });

    it('should accept valid amenities', async () => {
      const amenities = ['wifi', 'air conditioning', 'heating', 'tv', 'mini fridge', 'desk'];
      
      const roomData = {
        roomNumber: '101',
        roomType: 'single',
        price: 500000,
        hostel: hostelId.toString(),
        images: ['room.jpg'],
        amenities,
      };

      const response = await request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect(201);

      expect(response.body.amenities).toEqual(amenities);
    });

    it('should limit roomNumber to 10 characters', async () => {
      const roomData = {
        roomNumber: '12345678901', // 11 characters
        roomType: 'single',
        price: 500000,
        hostel: hostelId.toString(),
        images: ['room.jpg'],
      };

      await request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect(400);
    });

    it('should limit moreInfo to 500 characters', async () => {
      const longInfo = 'a'.repeat(501);
      const roomData = {
        roomNumber: '101',
        roomType: 'single',
        price: 500000,
        hostel: hostelId.toString(),
        images: ['room.jpg'],
        moreInfo: longInfo,
      };

      await request(app)
        .post('/api/rooms')
        .send(roomData)
        .expect(400);
    });
  });
});