import React from 'react';
import { Grid } from '@mui/material';
import TaskItem from './TaskItem';

const TaskList = ({ tasks, onEdit, onDelete, onToggleComplete }) => {
  return (
    <Grid container spacing={2}>
      {tasks.map((task) => (
        <Grid item xs={12} key={task.id}>
          <TaskItem
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onToggleComplete={onToggleComplete}
          />
        </Grid>
      ))}
    </Grid>
  );
};

export default TaskList;
