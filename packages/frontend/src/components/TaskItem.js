import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  Checkbox,
  IconButton,
  Chip,
  Box,
  Stack,
} from '@mui/material';
import { Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { formatDate, isPastDue, isDueSoon, getPriorityColor, getPriorityLabel } from '../utils/taskUtils';

const TaskItem = ({ task, onEdit, onDelete, onToggleComplete }) => {
  const overdue = isPastDue(task.due_date) && !task.completed;
  const dueSoon = isDueSoon(task.due_date) && !task.completed;

  const getDueDateColor = () => {
    if (overdue) return 'error';
    if (dueSoon) return 'warning';
    return 'default';
  };

  return (
    <Card
      sx={{
        mb: 2,
        opacity: task.completed ? 0.7 : 1,
        transition: 'opacity 0.3s',
        '&:hover': {
          boxShadow: 3,
        },
      }}
    >
      <CardContent>
        <Stack direction="row" alignItems="flex-start" spacing={2}>
          <Checkbox
            checked={task.completed === 1}
            onChange={() => onToggleComplete(task.id)}
            sx={{ mt: -1 }}
            inputProps={{ 'aria-label': `Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}` }}
          />
          
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="h3"
              sx={{
                textDecoration: task.completed ? 'line-through' : 'none',
                mb: 1,
              }}
            >
              {task.title}
            </Typography>
            
            {task.description && (
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {task.description}
              </Typography>
            )}
            
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <Chip
                label={getPriorityLabel(task.priority)}
                size="small"
                sx={{
                  bgcolor: getPriorityColor(task.priority),
                  color: 'white',
                }}
              />
              
              {task.due_date && (
                <Chip
                  label={formatDate(task.due_date)}
                  size="small"
                  color={getDueDateColor()}
                  variant="outlined"
                />
              )}
            </Stack>
          </Box>
          
          <Stack direction="row" spacing={1}>
            <IconButton
              onClick={() => onEdit(task)}
              aria-label={`Edit task ${task.title}`}
              size="small"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              onClick={() => onDelete(task.id)}
              aria-label={`Delete task ${task.title}`}
              size="small"
              color="error"
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default TaskItem;
