import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import App from '../App';

// Mock server to intercept API requests
const mockTasks = [
  {
    id: 1,
    title: 'Test Task 1',
    description: 'Description 1',
    priority: 'high',
    due_date: '2025-11-10',
    completed: 0,
    created_at: '2025-11-01T00:00:00.000Z',
    updated_at: '2025-11-01T00:00:00.000Z',
  },
  {
    id: 2,
    title: 'Test Task 2',
    description: 'Description 2',
    priority: 'medium',
    due_date: '2025-11-15',
    completed: 0,
    created_at: '2025-11-02T00:00:00.000Z',
    updated_at: '2025-11-02T00:00:00.000Z',
  },
  {
    id: 3,
    title: 'Completed Task',
    description: 'This is done',
    priority: 'low',
    due_date: '2025-11-05',
    completed: 1,
    created_at: '2025-11-03T00:00:00.000Z',
    updated_at: '2025-11-03T00:00:00.000Z',
  },
];

const server = setupServer(
  rest.get('/api/tasks', (req, res, ctx) => {
    const status = req.url.searchParams.get('status');
    const priority = req.url.searchParams.get('priority');
    const search = req.url.searchParams.get('search');

    let filteredTasks = [...mockTasks];

    if (status === 'active') {
      filteredTasks = filteredTasks.filter(t => t.completed === 0);
    } else if (status === 'completed') {
      filteredTasks = filteredTasks.filter(t => t.completed === 1);
    }

    if (priority) {
      filteredTasks = filteredTasks.filter(t => t.priority === priority);
    }

    if (search) {
      filteredTasks = filteredTasks.filter(t =>
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        (t.description && t.description.toLowerCase().includes(search.toLowerCase()))
      );
    }

    return res(ctx.status(200), ctx.json(filteredTasks));
  }),

  rest.post('/api/tasks', (req, res, ctx) => {
    const { title, description, priority, due_date } = req.body;

    if (!title || title.trim() === '') {
      return res(ctx.status(400), ctx.json({ error: 'Task title is required' }));
    }

    return res(
      ctx.status(201),
      ctx.json({
        id: 4,
        title,
        description: description || null,
        priority: priority || 'medium',
        due_date: due_date || null,
        completed: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
    );
  }),

  rest.put('/api/tasks/:id', (req, res, ctx) => {
    const { id } = req.params;
    const updates = req.body;
    const task = mockTasks.find(t => t.id === parseInt(id));

    if (!task) {
      return res(ctx.status(404), ctx.json({ error: 'Task not found' }));
    }

    return res(
      ctx.status(200),
      ctx.json({ ...task, ...updates, updated_at: new Date().toISOString() })
    );
  }),

  rest.patch('/api/tasks/:id/complete', (req, res, ctx) => {
    const { id } = req.params;
    const task = mockTasks.find(t => t.id === parseInt(id));

    if (!task) {
      return res(ctx.status(404), ctx.json({ error: 'Task not found' }));
    }

    return res(
      ctx.status(200),
      ctx.json({ ...task, completed: task.completed ? 0 : 1 })
    );
  }),

  rest.delete('/api/tasks/:id', (req, res, ctx) => {
    const { id } = req.params;
    const task = mockTasks.find(t => t.id === parseInt(id));

    if (!task) {
      return res(ctx.status(404), ctx.json({ error: 'Task not found' }));
    }

    return res(ctx.status(200), ctx.json({ message: 'Task deleted successfully', id: parseInt(id) }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('App Component', () => {
  test('renders the app header and main elements', async () => {
    render(<App />);

    // Check for header
    expect(screen.getByRole('heading', { name: /todo app/i })).toBeInTheDocument();

    // Check for Add Task button
    expect(screen.getByRole('button', { name: /add new task/i })).toBeInTheDocument();

    // Check for filters
    expect(screen.getByRole('button', { name: /show all tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show active tasks/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /show completed tasks/i })).toBeInTheDocument();
  });

  test('loads and displays tasks', async () => {
    render(<App />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    expect(screen.getByText('Completed Task')).toBeInTheDocument();
    expect(screen.getByText('Description 1')).toBeInTheDocument();
  });

  test('filters tasks by status - active', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    // Click Active filter
    const activeButton = screen.getByRole('button', { name: /show active tasks/i });
    await user.click(activeButton);

    // Should show only active tasks
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
      expect(screen.queryByText('Completed Task')).not.toBeInTheDocument();
    });
  });

  test('filters tasks by status - completed', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    // Click Completed filter
    const completedButton = screen.getByRole('button', { name: /show completed tasks/i });
    await user.click(completedButton);

    // Should show only completed tasks
    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
      expect(screen.getByText('Completed Task')).toBeInTheDocument();
    });
  });

  test('searches tasks by keyword', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    // Type in search box
    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    await user.type(searchInput, 'Completed');

    // Should show only matching tasks
    await waitFor(() => {
      expect(screen.queryByText('Test Task 1')).not.toBeInTheDocument();
      expect(screen.queryByText('Test Task 2')).not.toBeInTheDocument();
      expect(screen.getByText('Completed Task')).toBeInTheDocument();
    });
  });

  test('opens add task dialog when Add Task button is clicked', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Click Add Task button
    const addButton = screen.getByRole('button', { name: /add new task/i });
    await user.click(addButton);

    // Dialog should open
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
      expect(screen.getByText('Add New Task')).toBeInTheDocument();
    });
  });

  test('creates a new task successfully', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    // Open dialog
    const addButton = screen.getByRole('button', { name: /add new task/i });
    await user.click(addButton);

    // Wait for dialog
    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Fill in the form
    const titleInput = screen.getByLabelText(/^title/i);
    await user.type(titleInput, 'New Task');

    const descriptionInput = screen.getByLabelText(/description/i);
    await user.type(descriptionInput, 'New description');

    // Submit
    const submitButton = within(screen.getByRole('dialog')).getByRole('button', { name: /add/i });
    await user.click(submitButton);

    // Dialog should close and snackbar should appear
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    // Success message should appear
    await waitFor(() => {
      expect(screen.getByText(/task created successfully/i)).toBeInTheDocument();
    });
  });

  test('shows validation error when creating task without title', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Open dialog
    const addButton = screen.getByRole('button', { name: /add new task/i });
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    // Try to submit without filling title
    const submitButton = within(screen.getByRole('dialog')).getByRole('button', { name: /add/i });
    await user.click(submitButton);

    // Should show validation error
    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
    });

    // Dialog should still be open
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('toggles task completion status', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for tasks to load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    // Find and click the checkbox for Task 1
    const task1Card = screen.getByText('Test Task 1').closest('.MuiCard-root');
    const checkbox = within(task1Card).getByRole('checkbox');

    expect(checkbox).not.toBeChecked();

    await user.click(checkbox);

    // Success message should appear
    await waitFor(() => {
      expect(screen.getByText(/task completed/i)).toBeInTheDocument();
    });
  });

  test('handles API error gracefully', async () => {
    // Override handler to simulate error
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<App />);

    // Should show error message
    await waitFor(() => {
      expect(screen.getByText(/failed to load tasks/i)).toBeInTheDocument();
    });
  });

  test('shows empty state when no tasks', async () => {
    // Override handler to return empty array
    server.use(
      rest.get('/api/tasks', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json([]));
      })
    );

    render(<App />);

    // Should show empty state
    await waitFor(() => {
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });
  });

  test('shows filtered empty state message', async () => {
    const user = userEvent.setup();
    render(<App />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    });

    // Search for non-existent task
    const searchInput = screen.getByPlaceholderText(/search tasks/i);
    await user.type(searchInput, 'NonExistentTask');

    // Should show no match message
    await waitFor(() => {
      expect(screen.getByText(/no tasks match your filters/i)).toBeInTheDocument();
    });
  });
});
