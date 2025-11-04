import dayjs from 'dayjs';

export const formatDate = (dateString) => {
  if (!dateString) return 'No due date';
  return dayjs(dateString).format('MMM D, YYYY');
};

export const isPastDue = (dueDate) => {
  if (!dueDate) return false;
  return dayjs(dueDate).isBefore(dayjs(), 'day');
};

export const isDueSoon = (dueDate) => {
  if (!dueDate) return false;
  const now = dayjs();
  const due = dayjs(dueDate);
  const daysUntilDue = due.diff(now, 'day');
  return daysUntilDue >= 0 && daysUntilDue <= 3;
};

export const getPriorityColor = (priority) => {
  const colors = {
    high: '#f44336',
    medium: '#ff9800',
    low: '#2196f3',
  };
  return colors[priority] || colors.medium;
};

export const getPriorityLabel = (priority) => {
  const labels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  };
  return labels[priority] || 'Medium';
};

export const sortTasks = (tasks, sortBy = 'dueDate') => {
  const sorted = [...tasks];
  
  switch (sortBy) {
    case 'dueDate':
      return sorted.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed - b.completed;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;
        return new Date(a.due_date) - new Date(b.due_date);
      });
    
    case 'priority':
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return sorted.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed - b.completed;
        return priorityOrder[a.priority] - priorityOrder[b.priority];
      });
    
    case 'created':
      return sorted.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed - b.completed;
        return new Date(b.created_at) - new Date(a.created_at);
      });
    
    default:
      return sorted;
  }
};

export const filterTasks = (tasks, filters) => {
  let filtered = [...tasks];

  if (filters.status === 'active') {
    filtered = filtered.filter(task => !task.completed);
  } else if (filters.status === 'completed') {
    filtered = filtered.filter(task => task.completed);
  }

  if (filters.priority) {
    filtered = filtered.filter(task => task.priority === filters.priority);
  }

  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(task =>
      task.title.toLowerCase().includes(searchLower) ||
      (task.description && task.description.toLowerCase().includes(searchLower))
    );
  }

  return filtered;
};
