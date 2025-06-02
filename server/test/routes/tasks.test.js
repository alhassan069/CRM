const request = require('supertest');
const app = require('../../index');
const { createTestUser, generateTestToken } = require('../helpers/auth.helper');
const { Task } = require('../../models');

describe('Tasks API', () => {
  let adminUser;
  let adminToken;

  beforeAll(async () => {
    adminUser = await createTestUser('admin');
    adminToken = generateTestToken(adminUser);
  });

  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const taskData = {
        title: 'Test Task',
        description: 'Test Description',
        assigned_to: adminUser.id,
        related_to_type: 'deal',
        related_to_id: 1,
        due_date: new Date(),
        priority: 'high',
        status: 'pending'
      };

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`)
        .send(taskData);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.title).toBe(taskData.title);
      expect(response.body.priority).toBe(taskData.priority);
    });

    it('should return 401 without authentication', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({});

      expect(response.status).toBe(401);
    });
  });

  describe('GET /api/tasks', () => {
    beforeEach(async () => {
      await Task.create({
        title: 'Test Task 1',
        description: 'Test Description 1',
        assigned_to: adminUser.id,
        related_to_type: 'deal',
        related_to_id: 1,
        due_date: new Date(),
        priority: 'high',
        status: 'pending'
      });

      await Task.create({
        title: 'Test Task 2',
        description: 'Test Description 2',
        assigned_to: adminUser.id,
        related_to_type: 'contact',
        related_to_id: 1,
        due_date: new Date(),
        priority: 'medium',
        status: 'completed'
      });
    });

    it('should list tasks with pagination', async () => {
      const response = await request(app)
        .get('/api/tasks')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tasks');
      expect(response.body).toHaveProperty('total');
      expect(response.body).toHaveProperty('currentPage');
      expect(response.body).toHaveProperty('totalPages');
      expect(Array.isArray(response.body.tasks)).toBe(true);
    });

    it('should filter tasks by priority', async () => {
      const response = await request(app)
        .get('/api/tasks?priority=high')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.tasks.every(t => t.priority === 'high')).toBe(true);
    });
  });

  describe('GET /api/tasks/:id', () => {
    let testTask;

    beforeEach(async () => {
      testTask = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        assigned_to: adminUser.id,
        related_to_type: 'deal',
        related_to_id: 1,
        due_date: new Date(),
        priority: 'high',
        status: 'pending'
      });
    });

    it('should get task by id', async () => {
      const response = await request(app)
        .get(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testTask.id);
      expect(response.body.title).toBe(testTask.title);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .get('/api/tasks/99999')
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    let testTask;

    beforeEach(async () => {
      testTask = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        assigned_to: adminUser.id,
        related_to_type: 'deal',
        related_to_id: 1,
        due_date: new Date(),
        priority: 'high',
        status: 'pending'
      });
    });

    it('should update task', async () => {
      const updateData = {
        title: 'Updated Task',
        priority: 'medium',
        status: 'in_progress'
      };

      const response = await request(app)
        .put(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${adminToken}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updateData.title);
      expect(response.body.priority).toBe(updateData.priority);
      expect(response.body.status).toBe(updateData.status);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    let testTask;

    beforeEach(async () => {
      testTask = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        assigned_to: adminUser.id,
        related_to_type: 'deal',
        related_to_id: 1,
        due_date: new Date(),
        priority: 'high',
        status: 'pending'
      });
    });

    it('should delete task', async () => {
      const response = await request(app)
        .delete(`/api/tasks/${testTask.id}`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);

      const deletedTask = await Task.findByPk(testTask.id);
      expect(deletedTask).toBeNull();
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    let testTask;

    beforeEach(async () => {
      testTask = await Task.create({
        title: 'Test Task',
        description: 'Test Description',
        assigned_to: adminUser.id,
        related_to_type: 'deal',
        related_to_id: 1,
        due_date: new Date(),
        priority: 'high',
        status: 'pending'
      });
    });

    it('should mark task as completed', async () => {
      const response = await request(app)
        .patch(`/api/tasks/${testTask.id}/complete`)
        .set('Authorization', `Bearer ${adminToken}`);

      expect(response.status).toBe(200);
      expect(response.body.status).toBe('completed');
      expect(response.body.completed_at).not.toBeNull();
    });
  });
}); 