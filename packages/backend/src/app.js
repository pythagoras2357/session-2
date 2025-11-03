const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const Database = require('better-sqlite3');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Initialize in-memory SQLite database
const db = new Database(':memory:');

// Create tables
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    due_date TEXT,
    priority TEXT DEFAULT 'medium' CHECK(priority IN ('high', 'medium', 'low')),
    completed INTEGER DEFAULT 0 CHECK(completed IN (0, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`);

// Insert some initial sample tasks
const initialTasks = [
  { title: 'Complete project documentation', description: 'Write comprehensive docs for the TODO app', priority: 'high', due_date: '2025-11-10' },
  { title: 'Review pull requests', description: 'Check and approve pending PRs', priority: 'medium', due_date: '2025-11-05' },
  { title: 'Update dependencies', description: 'Run npm audit and update packages', priority: 'low', due_date: null }
];

const insertTaskStmt = db.prepare(
  'INSERT INTO tasks (title, description, priority, due_date) VALUES (?, ?, ?, ?)'
);

initialTasks.forEach(task => {
  insertTaskStmt.run(task.title, task.description, task.priority, task.due_date);
});

console.log('In-memory database initialized with sample tasks');

// API Routes

// Get all tasks with optional filtering
app.get('/api/tasks', (req, res) => {
  try {
    const { status, priority, search } = req.query;
    let query = 'SELECT * FROM tasks WHERE 1=1';
    const params = [];

    if (status === 'completed') {
      query += ' AND completed = 1';
    } else if (status === 'active') {
      query += ' AND completed = 0';
    }

    if (priority && ['high', 'medium', 'low'].includes(priority)) {
      query += ' AND priority = ?';
      params.push(priority);
    }

    if (search) {
      query += ' AND (title LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ' ORDER BY completed ASC, due_date ASC, created_at DESC';

    const tasks = db.prepare(query).all(...params);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});

// Create a new task
app.post('/api/tasks', (req, res) => {
  try {
    const { title, description, due_date, priority } = req.body;

    if (!title || typeof title !== 'string' || title.trim() === '') {
      return res.status(400).json({ error: 'Task title is required' });
    }

    if (priority && !['high', 'medium', 'low'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be high, medium, or low' });
    }

    const stmt = db.prepare(
      'INSERT INTO tasks (title, description, due_date, priority) VALUES (?, ?, ?, ?)'
    );
    const result = stmt.run(
      title.trim(),
      description || null,
      due_date || null,
      priority || 'medium'
    );

    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ error: 'Failed to create task' });
  }
});

// Update an existing task
app.put('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, due_date, priority, completed } = req.body;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    if (title !== undefined && (!title || typeof title !== 'string' || title.trim() === '')) {
      return res.status(400).json({ error: 'Task title cannot be empty' });
    }

    if (priority !== undefined && !['high', 'medium', 'low'].includes(priority)) {
      return res.status(400).json({ error: 'Priority must be high, medium, or low' });
    }

    const updateStmt = db.prepare(`
      UPDATE tasks 
      SET title = ?, description = ?, due_date = ?, priority = ?, completed = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `);

    updateStmt.run(
      title !== undefined ? title.trim() : existingTask.title,
      description !== undefined ? description : existingTask.description,
      due_date !== undefined ? due_date : existingTask.due_date,
      priority !== undefined ? priority : existingTask.priority,
      completed !== undefined ? (completed ? 1 : 0) : existingTask.completed,
      id
    );

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ error: 'Failed to update task' });
  }
});

// Toggle task completion status
app.patch('/api/tasks/:id/complete', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const newCompletedStatus = existingTask.completed ? 0 : 1;
    const updateStmt = db.prepare('UPDATE tasks SET completed = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
    updateStmt.run(newCompletedStatus, id);

    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    res.json(updatedTask);
  } catch (error) {
    console.error('Error toggling task completion:', error);
    res.status(500).json({ error: 'Failed to toggle task completion' });
  }
});

// Delete a task
app.delete('/api/tasks/:id', (req, res) => {
  try {
    const { id } = req.params;

    if (!id || isNaN(parseInt(id))) {
      return res.status(400).json({ error: 'Valid task ID is required' });
    }

    const existingTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
    if (!existingTask) {
      return res.status(404).json({ error: 'Task not found' });
    }

    const deleteStmt = db.prepare('DELETE FROM tasks WHERE id = ?');
    const result = deleteStmt.run(id);

    if (result.changes > 0) {
      res.json({ message: 'Task deleted successfully', id: parseInt(id) });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ error: 'Failed to delete task' });
  }
});

module.exports = { app, db };