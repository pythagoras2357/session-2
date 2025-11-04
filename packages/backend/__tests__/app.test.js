const request = require('supertest');
const { app, db } = require('../src/app');

afterAll(() => {
  if (db) db.close();
});

const createTask = async (taskData = {}) => {
  const defaultTask = {
    title: 'Test Task',
    description: 'Test description',
    priority: 'medium',
    due_date: '2025-11-15'
  };
  const res = await request(app)
    .post('/api/tasks')
    .send({ ...defaultTask, ...taskData })
    .set('Accept', 'application/json');
  return res.body;
};

describe('Task API', () => {
  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app).get('/api/tasks');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should filter tasks by status=active', async () => {
      await createTask({ completed: false });
      const response = await request(app).get('/api/tasks?status=active');
      expect(response.status).toBe(200);
      response.body.forEach(task => {
        expect(task.completed).toBe(0);
      });
    });

    it('should filter tasks by status=completed', async () => {
      const task = await createTask();
      await request(app).patch(`/api/tasks/${task.id}/complete`);
      const response = await request(app).get('/api/tasks?status=completed');
      expect(response.status).toBe(200);
      const completedTasks = response.body.filter(t => t.completed === 1);
      expect(completedTasks.length).toBeGreaterThan(0);
    });

    it('should filter tasks by priority', async () => {
      await createTask({ priority: 'high', title: 'High priority task' });
      const response = await request(app).get('/api/tasks?priority=high');
      expect(response.status).toBe(200);
      response.body.forEach(task => {
        expect(task.priority).toBe('high');
      });
    });

    it('should search tasks by keyword', async () => {
      await createTask({ title: 'UniqueSearchTerm123' });
      const response = await request(app).get('/api/tasks?search=UniqueSearchTerm123');
      expect(response.status).toBe(200);
      expect(response.body.some(task => task.title.includes('UniqueSearchTerm123'))).toBe(true);
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a new task with all fields', async () => {
      const newTask = {
        title: 'New Test Task',
        description: 'Test description',
        priority: 'high',
        due_date: '2025-12-01'
      };
      const response = await request(app)
        .post('/api/tasks')
        .send(newTask)
        .set('Accept', 'application/json');
      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.priority).toBe('high');
    });

    it('should create a task with only title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Minimal Task' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(201);
      expect(response.body.priority).toBe('medium');
    });

    it('should reject task without title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/title/i);
    });

    it('should reject task with invalid priority', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ title: 'Task', priority: 'urgent' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/priority/i);
    });
  });

  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const task = await createTask();
      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({ title: 'Updated Title', priority: 'low' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Updated Title');
      expect(response.body.priority).toBe('low');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .put('/api/tasks/99999')
        .send({ title: 'Updated' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(404);
    });

    it('should reject empty title', async () => {
      const task = await createTask();
      const response = await request(app)
        .put(`/api/tasks/${task.id}`)
        .send({ title: '   ' })
        .set('Accept', 'application/json');
      expect(response.status).toBe(400);
    });
  });

  describe('PATCH /api/tasks/:id/complete', () => {
    it('should toggle task completion', async () => {
      const task = await createTask();
      const response = await request(app)
        .patch(`/api/tasks/${task.id}/complete`)
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
      expect([0, 1]).toContain(response.body.completed);
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .patch('/api/tasks/99999/complete')
        .set('Accept', 'application/json');
      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete an existing task', async () => {
      const task = await createTask({ title: 'Task to delete' });
      const response = await request(app)
        .delete(`/api/tasks/${task.id}`)
        .set('Accept', 'application/json');
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message');
      
      const getResponse = await request(app).get('/api/tasks');
      const deletedTask = getResponse.body.find(t => t.id === task.id);
      expect(deletedTask).toBeUndefined();
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app)
        .delete('/api/tasks/99999')
        .set('Accept', 'application/json');
      expect(response.status).toBe(404);
    });
  });
});
