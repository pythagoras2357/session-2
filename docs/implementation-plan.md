# TODO App Implementation Plan

**Date:** November 3, 2025  
**Project:** TODO Application Expansion  
**Status:** Planning Phase

## Overview

This document outlines the comprehensive implementation plan for expanding the TODO app based on the guidelines defined in:
- Functional Requirements (`docs/functional-requirements.md`)
- UI Guidelines (`docs/ui-guidelines.md`)
- Testing Guidelines (`docs/testing-guidelines.md`)
- Coding Guidelines (`docs/coding-guidelines.md`)

## Current State Analysis

### Backend (Packages/backend)
- ✅ Express.js server with in-memory SQLite database
- ✅ Basic REST API with `/api/items` endpoints
- ✅ CORS and JSON middleware configured
- ✅ Jest test setup with Supertest
- ❌ Database schema needs expansion for full task model
- ❌ API endpoints need to support full CRUD for tasks

### Frontend (Packages/frontend)
- ✅ React application with basic structure
- ✅ Fetching and displaying data from backend
- ✅ Basic form submission functionality
- ❌ No Material-UI components
- ❌ No task management features (priority, due dates, etc.)
- ❌ Limited styling and accessibility

## Implementation Phases

### Phase 1: Backend Foundation (Priority: HIGH)

#### 1.1 Database Schema Update
**Objective:** Transform `items` table to `tasks` table with full feature support

**Schema Design:**
```sql
CREATE TABLE tasks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  description TEXT,
  due_date TEXT,
  priority TEXT DEFAULT 'medium' CHECK(priority IN ('high', 'medium', 'low')),
  completed INTEGER DEFAULT 0 CHECK(completed IN (0, 1)),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)
```

**Files to Modify:**
- `packages/backend/src/app.js` - Update database initialization

**Estimated Time:** 30 minutes

#### 1.2 REST API Endpoints
**Objective:** Implement complete CRUD operations with filtering and search

**Endpoints to Implement:**
1. `GET /api/tasks` - List all tasks with optional filters
   - Query params: `status` (all/active/completed), `priority` (high/medium/low), `search` (keyword)
2. `POST /api/tasks` - Create new task
   - Body: `{ title, description?, due_date?, priority? }`
3. `PUT /api/tasks/:id` - Update existing task
   - Body: Partial task object
4. `PATCH /api/tasks/:id/complete` - Toggle completion status
5. `DELETE /api/tasks/:id` - Delete task

**Validation Requirements:**
- Title is required and non-empty
- Priority must be 'high', 'medium', or 'low'
- Proper HTTP status codes (200, 201, 400, 404, 500)

**Files to Modify:**
- `packages/backend/src/app.js` - Add/update route handlers

**Estimated Time:** 2 hours

#### 1.3 Backend Testing
**Objective:** Achieve 80%+ test coverage for all API endpoints

**Test Cases to Write:**
- GET endpoints: filtering, search, empty results
- POST endpoint: valid creation, validation errors
- PUT endpoint: full/partial updates, not found errors
- PATCH endpoint: toggle completion
- DELETE endpoint: successful deletion, not found errors

**Files to Modify:**
- `packages/backend/__tests__/app.test.js` - Rewrite tests for task API

**Estimated Time:** 2 hours

**Phase 1 Total Time:** ~4.5 hours

---

### Phase 2: Frontend Setup & Core Components (Priority: HIGH)

#### 2.1 Install Material-UI Dependencies
**Objective:** Add MUI and related packages

**Packages to Install:**
```bash
cd packages/frontend
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
npm install @mui/x-date-pickers dayjs
```

**Estimated Time:** 15 minutes

#### 2.2 Create Utility Files
**Objective:** Build reusable functions for data manipulation

**Files to Create:**
- `packages/frontend/src/utils/taskUtils.js`
  - `sortTasks(tasks, sortBy)` - Sort by date, priority, or creation
  - `filterTasks(tasks, filters)` - Filter by status, priority, search
  - `formatDate(dateString)` - Format dates for display
  - `isPastDue(dueDate)` - Check if task is overdue
  - `getPriorityColor(priority)` - Return color based on priority

- `packages/frontend/src/services/api.js`
  - `fetchTasks(filters)` - GET /api/tasks
  - `createTask(taskData)` - POST /api/tasks
  - `updateTask(id, updates)` - PUT /api/tasks/:id
  - `toggleComplete(id)` - PATCH /api/tasks/:id/complete
  - `deleteTask(id)` - DELETE /api/tasks/:id

**Estimated Time:** 1.5 hours

#### 2.3 Create Component Structure
**Objective:** Build MUI-based components following UI guidelines

**Components to Create:**

1. **TaskList.js** (`packages/frontend/src/components/TaskList.js`)
   - Displays list of tasks using MUI Grid
   - Props: `tasks`, `onEdit`, `onDelete`, `onToggleComplete`
   - Uses TaskItem components

2. **TaskItem.js** (`packages/frontend/src/components/TaskItem.js`)
   - MUI Card with task details
   - Checkbox for completion
   - Edit and delete icon buttons
   - Priority badge with color coding
   - Due date display with warning colors

3. **TaskForm.js** (`packages/frontend/src/components/TaskForm.js`)
   - MUI Dialog for add/edit
   - Fields: title (TextField), description (TextField multiline), due_date (DatePicker), priority (Select)
   - Validation and error display
   - Props: `open`, `onClose`, `onSubmit`, `initialData?`

4. **TaskFilters.js** (`packages/frontend/src/components/TaskFilters.js`)
   - Status filter buttons (All/Active/Completed)
   - Priority dropdown
   - Search TextField
   - Props: `filters`, `onFilterChange`

5. **EmptyState.js** (`packages/frontend/src/components/EmptyState.js`)
   - Display when no tasks exist
   - Encouraging message and icon
   - Props: `message`

**Estimated Time:** 4 hours

#### 2.4 Update App.js
**Objective:** Integrate all components with state management

**Key Features:**
- State: tasks, filters, dialog open/close, selected task for editing
- Load tasks on mount
- Handle CRUD operations
- Apply filters and sorting
- Loading and error states with MUI components

**Files to Modify:**
- `packages/frontend/src/App.js` - Complete rewrite

**Estimated Time:** 2 hours

#### 2.5 Update Styling
**Objective:** Apply MUI theme and custom styles per UI guidelines

**Files to Modify:**
- `packages/frontend/src/App.css` - Update with MUI color palette
- `packages/frontend/src/index.css` - Global styles

**Color Palette to Use:**
- Primary: #1976d2
- Secondary: #dc004e
- Success: #4caf50
- Warning: #ff9800
- Error: #f44336
- Background: #f5f5f5

**Estimated Time:** 1 hour

**Phase 2 Total Time:** ~8.75 hours

---

### Phase 3: Advanced Features (Priority: MEDIUM)

#### 3.1 Sorting Implementation
**Objective:** Allow users to sort tasks

**Sort Options:**
- By due date (ascending/descending)
- By priority (high → low)
- By creation date (newest first)
- By completion status

**UI Component:**
- Add sort dropdown to TaskFilters

**Estimated Time:** 1 hour

#### 3.2 Enhanced Filtering
**Objective:** Multi-criteria filtering

**Filter Combinations:**
- Status + Priority
- Status + Search
- Priority + Search
- All combined

**Estimated Time:** 30 minutes

#### 3.3 User Feedback
**Objective:** Provide clear feedback for all actions

**Features:**
- MUI Snackbar for success/error messages
- Loading indicators (CircularProgress)
- Confirmation dialog for delete operations
- Disable buttons during async operations

**Estimated Time:** 1.5 hours

**Phase 3 Total Time:** ~3 hours

---

### Phase 4: Accessibility & Responsiveness (Priority: MEDIUM)

#### 4.1 Accessibility (WCAG 2.1 AA)
**Objective:** Ensure app is accessible to all users

**Checklist:**
- ✓ ARIA labels on all icon buttons
- ✓ Keyboard navigation for all interactive elements
- ✓ Focus management in dialogs
- ✓ Color contrast ratios meet standards
- ✓ Semantic HTML elements
- ✓ Screen reader testing

**Files to Update:**
- All component files

**Estimated Time:** 2 hours

#### 4.2 Responsive Design
**Objective:** Optimize for all screen sizes

**Breakpoints (MUI defaults):**
- xs: 0px (mobile)
- sm: 600px (tablet)
- md: 960px (small laptop)
- lg: 1280px (desktop)

**Mobile Optimizations:**
- Single column layout
- Full-width forms
- Touch targets 44x44px minimum
- Simplified navigation

**Estimated Time:** 2 hours

**Phase 4 Total Time:** ~4 hours

---

### Phase 5: Testing (Priority: HIGH)

#### 5.1 Frontend Unit Tests
**Objective:** Test components and utilities in isolation

**Test Files to Create:**
- `packages/frontend/src/utils/__tests__/taskUtils.test.js`
- `packages/frontend/src/services/__tests__/api.test.js`
- `packages/frontend/src/components/__tests__/TaskItem.test.js`
- `packages/frontend/src/components/__tests__/TaskForm.test.js`
- `packages/frontend/src/components/__tests__/TaskFilters.test.js`

**Testing Library:** Jest + React Testing Library

**Estimated Time:** 4 hours

#### 5.2 Frontend Integration Tests
**Objective:** Test component interactions

**Test Scenarios:**
- Complete task creation flow
- Edit task workflow
- Delete with confirmation
- Filter and search interactions

**Estimated Time:** 2 hours

#### 5.3 End-to-End Tests (Optional)
**Objective:** Test complete user journeys

**Tool:** Playwright or Cypress

**Test Scenarios:**
- Create, edit, complete, delete task
- Apply various filters
- Responsive behavior

**Estimated Time:** 4 hours (if implemented)

**Phase 5 Total Time:** ~6-10 hours

---

## Total Estimated Time

- Phase 1 (Backend): 4.5 hours
- Phase 2 (Frontend Core): 8.75 hours
- Phase 3 (Advanced Features): 3 hours
- Phase 4 (Accessibility & Responsive): 4 hours
- Phase 5 (Testing): 6 hours

**Total: ~26.25 hours** (3-4 working days)

---

## Implementation Order (Recommended)

1. **Day 1: Backend Foundation**
   - Complete Phase 1 (Database + API + Tests)
   - Verify all tests pass

2. **Day 2: Frontend Core**
   - Install MUI (Phase 2.1)
   - Create utilities (Phase 2.2)
   - Build components (Phase 2.3-2.4)

3. **Day 3: Features & Polish**
   - Complete styling (Phase 2.5)
   - Add advanced features (Phase 3)
   - Implement accessibility (Phase 4.1)

4. **Day 4: Testing & Refinement**
   - Write frontend tests (Phase 5.1-5.2)
   - Responsive design (Phase 4.2)
   - Bug fixes and refinements

---

## Success Criteria

### Functional
- ✓ All 10 functional requirements from `docs/functional-requirements.md` implemented
- ✓ Full CRUD operations working
- ✓ Filtering, sorting, and search functional
- ✓ Data persists via backend API

### Technical
- ✓ 80%+ test coverage (backend and frontend)
- ✓ All tests passing
- ✓ No linting errors
- ✓ Code follows guidelines in `docs/coding-guidelines.md`

### UI/UX
- ✓ Material-UI components used throughout
- ✓ Follows color palette from `docs/ui-guidelines.md`
- ✓ WCAG 2.1 AA compliant
- ✓ Responsive on mobile, tablet, desktop

---

## Risk Mitigation

### Technical Risks
1. **File corruption during edits** → Use file creation tools properly, verify after each edit
2. **Test failures** → Write tests incrementally, run after each change
3. **Component complexity** → Keep components small, extract logic to utilities

### Scope Risks
1. **Feature creep** → Stick to documented requirements only
2. **Time overruns** → Implement MVP first, add enhancements later

---

## Next Steps

1. Review and approve this plan
2. Create a fresh branch for implementation
3. Begin with Phase 1.1 (Database Schema)
4. Commit after each completed sub-phase
5. Run tests frequently to catch issues early

---

**Plan Status:** Ready for Implementation  
**Approved By:** _Pending_  
**Start Date:** _TBD_
