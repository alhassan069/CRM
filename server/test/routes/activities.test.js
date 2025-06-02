const request = require('supertest');
const app = require('../../index');
const { createTestUser, generateTestToken } = require('../helpers/auth.helper');
const { Activity } = require('../../models');

describe('Activities API', () => {
  let adminUser;
  let adminToken;

  beforeAll(async () => {
    adminUser = await createTestUser('admin');
    adminToken = generateTestToken(adminUser);
  });

  describe('POST /api/activities', () => {
    it('should create a new activity', async () => {
      const activityData = {
        type: 'call',
        subject: 'Test Call',
        description: 'Test Description',
        related_to_type: 'deal',
        related_to_id: 1,
        due_date: new Date(),
        status: 'pending'
      };

      const response = await request(app)
        .post('/api/activities')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(activityData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.type).toBe(activityData.type);
      expect(response.body.subject).toBe(activityData.subject);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/activities')
        .send({});

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/activities', () => {
    beforeEach(async () => {
      await Activity.create({
        type: 'call',
        subject: 'Test Call 1',
        description: 'Test Description 1',
        related_to_type: 'deal',
        related_to_id: 1,
        created_by: adminUser.id,
        due_date: new Date(),
        status: 'pending'
      });

      await Activity.create({
        type: 'email',
        subject: 'Test Email',
        description: 'Test Description 2',
        related_to_type: 'contact',
        related_to_id: 1,
        created_by: adminUser.id,
        due_date: new Date(),
        status: 'completed'
      });
    });

    it('should list activities with pagination', async () => {
      const response = await request(app)
        .get('/api/activities')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('activities');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('currentPage');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.activities)).toBe(true);
    });

    it('should filter activities by type', async () => {
      const response = await request(app)
        .get('/api/activities?type=call')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.activities.every(a => a.type === 'call')).toBe(true);
    });
  });

  describe('GET /api/activities/:id', () => {
    let testActivity;

    beforeEach(async () => {
      testActivity = await Activity.create({
        type: 'call',
        subject: 'Test Call',
        description: 'Test Description',
        related_to_type: 'deal',
        related_to_id: 1,
        created_by: adminUser.id,
        due_date: new Date(),
        status: 'pending'
      });
    });

    it('should get activity by id', async () => {
      const response = await request(app)
        .get(`/api/activities/${testActivity.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testActivity.id);
      expect(response.body.subject).toBe(testActivity.subject);
    });

    it('should return 404 for non-existent activity', async () => {
      const response = await request(app)
        .get('/api/activities/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/activities/:id', () => {
    let testActivity;

    beforeEach(async () => {
      testActivity = await Activity.create({
        type: 'call',
        subject: 'Test Call',
        description: 'Test Description',
        related_to_type: 'deal',
        related_to_id: 1,
        created_by: adminUser.id,
        due_date: new Date(),
        status: 'pending'
      });
    });

    it('should update activity', async () => {
      const updateData = {
        subject: 'Updated Subject',
        status: 'completed'
      };

      const response = await request(app)
        .put(`/api/activities/${testActivity.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.subject).toBe(updateData.subject);
      expect(response.body.status).toBe(updateData.status);
    });
  });

  describe('DELETE /api/activities/:id', () => {
    let testActivity;

    beforeEach(async () => {
      testActivity = await Activity.create({
        type: 'call',
        subject: 'Test Call',
        description: 'Test Description',
        related_to_type: 'deal',
        related_to_id: 1,
        created_by: adminUser.id,
        due_date: new Date(),
        status: 'pending'
      });
    });

    it('should delete activity', async () => {
      const response = await request(app)
        .delete(`/api/activities/${testActivity.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);

      const deletedActivity = await Activity.findByPk(testActivity.id);
      expect(deletedActivity).toBeNull();
    });
  });
}); 