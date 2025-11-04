import React from 'react';
import {
  Paper,
  Stack,
  TextField,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const TaskFilters = ({ filters, onFilterChange }) => {
  const handleStatusChange = (event, newStatus) => {
    if (newStatus !== null) {
      onFilterChange({ ...filters, status: newStatus });
    }
  };

  const handlePriorityChange = (event) => {
    onFilterChange({ ...filters, priority: event.target.value });
  };

  const handleSearchChange = (event) => {
    onFilterChange({ ...filters, search: event.target.value });
  };

  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Stack spacing={2}>
        <TextField
          placeholder="Search tasks..."
          value={filters.search || ''}
          onChange={handleSearchChange}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          inputProps={{ 'aria-label': 'Search tasks' }}
        />

        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
          <ToggleButtonGroup
            value={filters.status || 'all'}
            exclusive
            onChange={handleStatusChange}
            aria-label="Task status filter"
            fullWidth
          >
            <ToggleButton value="all" aria-label="Show all tasks">
              All
            </ToggleButton>
            <ToggleButton value="active" aria-label="Show active tasks">
              Active
            </ToggleButton>
            <ToggleButton value="completed" aria-label="Show completed tasks">
              Completed
            </ToggleButton>
          </ToggleButtonGroup>

          <FormControl fullWidth sx={{ minWidth: 120 }}>
            <InputLabel id="priority-filter-label">Priority</InputLabel>
            <Select
              labelId="priority-filter-label"
              value={filters.priority || ''}
              label="Priority"
              onChange={handlePriorityChange}
              inputProps={{ 'aria-label': 'Filter by priority' }}
            >
              <MenuItem value="">All Priorities</MenuItem>
              <MenuItem value="high">High</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="low">Low</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default TaskFilters;
