import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  CircularProgress,
  Snackbar,
  Alert,
  CssBaseline,
  ThemeProvider,
  createTheme,
} from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskFilters from './components/TaskFilters';
import EmptyState from './components/EmptyState';
import { fetchTasks, createTask, updateTask, toggleComplete, deleteTask } from './services/api';
import { sortTasks, filterTasks } from './utils/taskUtils';
import './App.css';

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
    secondary: { main: '#dc004e' },
    success: { main: '#4caf50' },
    warning: { main: '#ff9800' },
    error: { main: '#f44336' },
    background: { default: '#f5f5f5' },
  },
});

function App() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ status: 'all', priority: '', search: '' });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    loadTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const data = await fetchTasks();
      setTasks(data);
    } catch (err) {
      showSnackbar('Failed to load tasks', 'error');
      console.error('Error loading tasks:', err);
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleAddTask = () => {
    setEditingTask(null);
    setDialogOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setEditingTask(null);
  };

  const handleSubmitTask = async (taskData) => {
    try {
      if (editingTask) {
        const updated = await updateTask(editingTask.id, taskData);
        setTasks(tasks.map(t => t.id === updated.id ? updated : t));
        showSnackbar('Task updated successfully');
      } else {
        const newTask = await createTask(taskData);
        setTasks([...tasks, newTask]);
        showSnackbar('Task created successfully');
      }
      handleCloseDialog();
    } catch (err) {
      showSnackbar(err.message, 'error');
      console.error('Error saving task:', err);
    }
  };

  const handleToggleComplete = async (id) => {
    try {
      const updated = await toggleComplete(id);
      setTasks(tasks.map(t => t.id === updated.id ? updated : t));
      showSnackbar(updated.completed ? 'Task completed' : 'Task reopened', 'info');
    } catch (err) {
      showSnackbar('Failed to update task', 'error');
      console.error('Error toggling task:', err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    
    try {
      await deleteTask(id);
      setTasks(tasks.filter(t => t.id !== id));
      showSnackbar('Task deleted successfully');
    } catch (err) {
      showSnackbar('Failed to delete task', 'error');
      console.error('Error deleting task:', err);
    }
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const filteredTasks = filterTasks(tasks, filters);
  const sortedTasks = sortTasks(filteredTasks, 'dueDate');

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              TODO App
            </Typography>
            <Button
              color="inherit"
              startIcon={<AddIcon />}
              onClick={handleAddTask}
              aria-label="Add new task"
            >
              Add Task
            </Button>
          </Toolbar>
        </AppBar>

        <Container maxWidth="md" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
          <TaskFilters filters={filters} onFilterChange={handleFilterChange} />

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
              <CircularProgress />
            </Box>
          ) : sortedTasks.length === 0 ? (
            <EmptyState
              message={
                filters.status !== 'all' || filters.priority || filters.search
                  ? 'No tasks match your filters'
                  : "No tasks yet. Click 'Add Task' to get started!"
              }
            />
          ) : (
            <TaskList
              tasks={sortedTasks}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleComplete={handleToggleComplete}
            />
          )}
        </Container>

        <TaskForm
          open={dialogOpen}
          onClose={handleCloseDialog}
          onSubmit={handleSubmitTask}
          initialData={editingTask}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    </ThemeProvider>
  );
}

export default App;
