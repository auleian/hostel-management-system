import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import hostelRoutes from '@/routes/hostelRoutes.js';
import Hostel from '../models/hostelModel.js';
import path from 'path';

const app = express();
app.use(express.json());
app.use('/api/hostels', hostelRoutes);

beforeAll(async () => {
  const url = process.env.MONGO_TEST_URI || 'mongodb://127.0.0.1:27017/booking_test';
  await mongoose.connect(url);
});

afterAll(async () => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
});

afterEach(async () => {
  await Hostel.deleteMany({});
});

describe('Hostel Tests', () => {
  describe('POST /api/hostels', () => {
    it('should create a new hostel successfully', async () => {
      const hostelData = {
        name: 'Test Hostel',
        location: 'Kampala',
        availableRooms: 10,
        description: 'A great hostel for students',
        rules: 'No smoking, No pets',
        amenities: ['wifi', 'security'],
        genderPolicy: 'mixed',
        contactInfo: '0700000000',
        price: 500000,
      };

      const response = await request(app)
        .post('/api/hostels')
        .send(hostelData)
        .expect(201);

      expect(response.body.name).toBe(hostelData.name);
      expect(response.body.location).toBe(hostelData.location);
      expect(response.body.amenities).toEqual(hostelData.amenities);
      expect(response.body).toHaveProperty('_id');
    });

    it('should create hostel with images', async () => {
      const hostelData = {
        name: 'Test Hostel with Images',
        location: 'Kampala',
        images: ['image1.jpg', 'image2.jpg'],
        price: 500000,
      };

      const response = await request(app)
        .post('/api/hostels')
        .send(hostelData)
        .expect(201);

      expect(response.body.images).toEqual(hostelData.images);
    });

    it('should fail without required fields', async () => {
      const hostelData = {
        description: 'Missing required fields',
      };

      await request(app)
        .post('/api/hostels')
        .send(hostelData)
        .expect(400);
    });

    it('should normalize amenities correctly', async () => {
      const hostelData = {
        name: 'Test Hostel',
        location: 'Kampala',
        amenities: 'wifi,security',
        price: 500000,
      };

      const response = await request(app)
        .post('/api/hostels')
        .send(hostelData)
        .expect(201);

      expect(Array.isArray(response.body.amenities)).toBe(true);
    });
  });

  describe('GET /api/hostels', () => {
    beforeEach(async () => {
      // Create test hostels
      await Hostel.create([
        {
          name: 'Budget Hostel',
          location: 'Kampala',
          priceRange: { min: 300000, max: 400000 },
          amenities: ['wifi'],
        },
        {
          name: 'Luxury Hostel',
          location: 'Entebbe',
          priceRange: { min: 800000, max: 1000000 },
          amenities: ['wifi', 'security', 'parking'],
        },
        {
          name: 'Mid Range Hostel',
          location: 'Kampala',
          priceRange: { min: 500000, max: 600000 },
          amenities: ['wifi', 'security'],
        },
      ]);
    });

    it('should get all hostels', async () => {
      const response = await request(app)
        .get('/api/hostels')
        .expect(200);

      expect(response.body).toHaveLength(3);
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('priceRange');
    });

    it('should filter hostels by name', async () => {
      const response = await request(app)
        .get('/api/hostels?name=Budget')
        .expect(200);

      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Budget Hostel');
    });

    it('should filter hostels by location (case insensitive)', async () => {
      const response = await request(app)
        .get('/api/hostels?name=kampala')
        .expect(200);

      expect(response.body.length).toBeGreaterThan(0);
    });

    it('should filter hostels by minPrice', async () => {
      const response = await request(app)
        .get('/api/hostels?minPrice=500000')
        .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(2);
      response.body.forEach(hostel => {
        expect(hostel.priceRange.max).toBeGreaterThanOrEqual(500000);
      });
    });

    it('should filter hostels by maxPrice', async () => {
      const response = await request(app)
        .get('/api/hostels?maxPrice=500000')
        .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(1);
      response.body.forEach(hostel => {
        expect(hostel.priceRange.min).toBeLessThanOrEqual(500000);
      });
    });

    it('should filter hostels by price range', async () => {
      const response = await request(app)
        .get('/api/hostels?minPrice=400000&maxPrice=700000')
        .expect(200);

      expect(response.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('GET /api/hostels/:id', () => {
    let hostelId;

    beforeEach(async () => {
      const hostel = await Hostel.create({
        name: 'Test Hostel',
        location: 'Kampala',
        priceRange: { min: 500000, max: 600000 },
      });
      hostelId = hostel._id.toString();
    });

    it('should get a hostel by id', async () => {
      const response = await request(app)
        .get(`/api/hostels/${hostelId}`)
        .expect(200);

      expect(response.body.name).toBe('Test Hostel');
      expect(response.body._id).toBe(hostelId);
    });

    it('should return 404 for non-existent hostel', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .get(`/api/hostels/${fakeId}`)
        .expect(404);
    });

    it('should return 400 for invalid hostel id', async () => {
      await request(app)
        .get('/api/hostels/invalid_id')
        .expect(400);
    });
  });

  describe('PATCH /api/hostels/:id', () => {
    let hostelId;

    beforeEach(async () => {
      const hostel = await Hostel.create({
        name: 'Original Hostel',
        location: 'Kampala',
        priceRange: { min: 500000, max: 600000 },
        amenities: ['wifi'],
      });
      hostelId = hostel._id.toString();
    });

    it('should update hostel successfully', async () => {
      const updateData = {
        name: 'Updated Hostel',
        description: 'New description',
      };

      const response = await request(app)
        .patch(`/api/hostels/${hostelId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.name).toBe('Updated Hostel');
      expect(response.body.description).toBe('New description');
    });

    it('should update amenities', async () => {
      const updateData = {
        amenities: ['wifi', 'security', 'parking'],
      };

      const response = await request(app)
        .patch(`/api/hostels/${hostelId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.amenities).toEqual(['wifi', 'security', 'parking']);
    });

    it('should update price range', async () => {
      const updateData = {
        'priceRange[min]': 700000,
        'priceRange[max]': 800000,
      };

      const response = await request(app)
        .patch(`/api/hostels/${hostelId}`)
        .send(updateData)
        .expect(200);

      expect(response.body.priceRange.min).toBe(700000);
      expect(response.body.priceRange.max).toBe(800000);
    });

    it('should return 404 for non-existent hostel', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .patch(`/api/hostels/${fakeId}`)
        .send({ name: 'Updated' })
        .expect(404);
    });
  });

  describe('DELETE /api/hostels/:id', () => {
    let hostelId;

    beforeEach(async () => {
      const hostel = await Hostel.create({
        name: 'Hostel to Delete',
        location: 'Kampala',
        priceRange: { min: 500000, max: 600000 },
      });
      hostelId = hostel._id.toString();
    });

    it('should delete hostel successfully', async () => {
      await request(app)
        .delete(`/api/hostels/${hostelId}`)
        .expect(204);

      const deletedHostel = await Hostel.findById(hostelId);
      expect(deletedHostel).toBeNull();
    });

    it('should return 404 for non-existent hostel', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      await request(app)
        .delete(`/api/hostels/${fakeId}`)
        .expect(404);
    });

    it('should return 400 for invalid hostel id', async () => {
      await request(app)
        .delete('/api/hostels/invalid_id')
        .expect(400);
    });
  });
});