import React from 'react';
import { Box, Typography } from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';

const EmptyState = ({ message = "No tasks yet. Click 'Add Task' to get started!" }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 200,
        py: 4,
        textAlign: 'center',
      }}
    >
      <AssignmentIcon sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
};

export default EmptyState;
