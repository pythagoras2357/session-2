import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';

const TaskForm = ({ open, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    due_date: null,
    priority: 'medium',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.description || '',
        due_date: initialData.due_date ? dayjs(initialData.due_date) : null,
        priority: initialData.priority || 'medium',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        due_date: null,
        priority: 'medium',
      });
    }
    setErrors({});
  }, [initialData, open]);

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleDateChange = (newValue) => {
    setFormData({ ...formData, due_date: newValue });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    const taskData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      due_date: formData.due_date ? formData.due_date.format('YYYY-MM-DD') : null,
      priority: formData.priority,
    };

    onSubmit(taskData);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>{initialData ? 'Edit Task' : 'Add New Task'}</DialogTitle>
        <DialogContent>
          <Stack spacing={3} sx={{ mt: 1 }}>
            <TextField
              label="Title"
              value={formData.title}
              onChange={handleChange('title')}
              error={!!errors.title}
              helperText={errors.title}
              fullWidth
              required
              autoFocus
              inputProps={{ 'aria-label': 'Task title' }}
            />

            <TextField
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
              fullWidth
              multiline
              rows={3}
              inputProps={{ 'aria-label': 'Task description' }}
            />

            <DatePicker
              label="Due Date"
              value={formData.due_date}
              onChange={handleDateChange}
              slotProps={{
                textField: {
                  fullWidth: true,
                  inputProps: { 'aria-label': 'Task due date' },
                },
              }}
            />

            <FormControl fullWidth>
              <InputLabel id="priority-label">Priority</InputLabel>
              <Select
                labelId="priority-label"
                value={formData.priority}
                label="Priority"
                onChange={handleChange('priority')}
                inputProps={{ 'aria-label': 'Task priority' }}
              >
                <MenuItem value="low">Low</MenuItem>
                <MenuItem value="medium">Medium</MenuItem>
                <MenuItem value="high">High</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {initialData ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};

export default TaskForm;
