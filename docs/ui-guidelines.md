# UI Guidelines for TODO App

This document outlines the user interface guidelines and design standards for the TODO application.

## Design System

### Component Library
- Use **Material-UI (MUI)** components for all UI elements to ensure consistency and professional appearance.
- Leverage built-in MUI components such as Button, TextField, Checkbox, Card, Dialog, and IconButton.

### Color Palette

**Primary Colors:**
- Primary: `#1976d2` (Blue)
- Secondary: `#dc004e` (Pink)

**Status Colors:**
- Success: `#4caf50` (Green) - for completed tasks
- Warning: `#ff9800` (Orange) - for tasks due soon
- Error: `#f44336` (Red) - for overdue tasks
- Info: `#2196f3` (Light Blue)

**Neutral Colors:**
- Background: `#f5f5f5` (Light Gray)
- Surface: `#ffffff` (White)
- Text Primary: `#212121` (Dark Gray)
- Text Secondary: `#757575` (Medium Gray)

### Typography
- Use Material-UI's default Roboto font family.
- Headings: Bold, with appropriate size hierarchy (h1-h6).
- Body text: Regular weight, 16px base size for readability.
- Maintain consistent line-height (1.5) for body text.

### Button Styles
- **Primary Actions:** Contained buttons with primary color (e.g., "Add Task", "Save").
- **Secondary Actions:** Outlined buttons (e.g., "Cancel", "Filter").
- **Destructive Actions:** Contained buttons with error color (e.g., "Delete").
- All buttons should have appropriate hover and focus states.
- Use icon buttons for compact actions (e.g., edit, delete in task list).

## Layout and Spacing

### Grid System
- Use MUI Grid component for responsive layout.
- Maintain consistent spacing using MUI's spacing scale (8px increments).
- Standard padding: 16px (2 spacing units) for cards and containers.
- Standard margin: 8px (1 spacing unit) between related elements.

### Task List Layout
- Display tasks as cards with clear visual separation.
- Each task card should include: title, description (if present), due date, priority indicator, and action buttons.
- Use responsive design to adapt from desktop (multi-column) to mobile (single column).

## Accessibility Requirements

### WCAG 2.1 AA Compliance
- **Color Contrast:** Ensure all text meets minimum contrast ratio of 4.5:1 for normal text and 3:1 for large text.
- **Keyboard Navigation:** All interactive elements must be keyboard accessible with visible focus indicators.
- **ARIA Labels:** Provide appropriate ARIA labels for icon buttons and screen reader users.
- **Form Labels:** All form inputs must have associated labels.

### Semantic HTML
- Use appropriate HTML5 semantic elements (header, main, section, button, etc.).
- Ensure proper heading hierarchy (h1 → h2 → h3).

### Focus Management
- Visible focus indicators on all interactive elements.
- Focus should move logically through the interface when using Tab key.
- When opening dialogs, focus should move to the dialog and return to the trigger element on close.

## Interactive Elements

### Task Actions
- **Checkbox:** Use MUI Checkbox for marking tasks complete/incomplete.
- **Edit Icon:** Pencil/edit icon button to open task edit dialog.
- **Delete Icon:** Trash/delete icon button with confirmation dialog.
- **Priority Indicator:** Color-coded badge or icon (High=Red, Medium=Orange, Low=Blue).

### Forms
- Use MUI TextField components for text input.
- Date pickers for due date selection (use MUI DatePicker).
- Dropdown/Select for priority selection.
- Clear error states with helper text for validation errors.

### Feedback and States

**Loading States:**
- Use MUI CircularProgress or LinearProgress for loading indicators.
- Disable buttons during form submission.

**Empty States:**
- Display helpful messages when no tasks exist (e.g., "No tasks yet. Click 'Add Task' to get started!").

**Success/Error Messages:**
- Use MUI Snackbar for temporary success/error notifications.
- Position: Bottom center, auto-dismiss after 4 seconds.

## Responsive Design

### Breakpoints
Follow MUI's default breakpoints:
- xs: 0px (mobile)
- sm: 600px (tablet)
- md: 960px (small laptop)
- lg: 1280px (desktop)
- xl: 1920px (large desktop)

### Mobile Considerations
- Touch targets should be at least 44x44px for easy tapping.
- Simplified navigation on mobile devices.
- Bottom navigation or drawer menu for mobile.
- Full-width forms and buttons on small screens.

---

These guidelines ensure a consistent, accessible, and user-friendly interface for the TODO application.