# Coding Guidelines for TODO App

This document outlines the coding style and quality principles for the TODO application.

## General Principles

### Code Quality
- **DRY (Don't Repeat Yourself):** Avoid code duplication. Extract common logic into reusable functions, components, or utilities.
- **KISS (Keep It Simple, Stupid):** Write simple, straightforward code. Avoid unnecessary complexity.
- **YAGNI (You Aren't Gonna Need It):** Don't add functionality until it's necessary.
- **Single Responsibility Principle:** Each function, component, or module should have one clear purpose.

### Code Readability
- **Write self-documenting code:** Use clear, descriptive names for variables, functions, and components.
- **Add comments sparingly:** Code should be self-explanatory. Use comments to explain "why," not "what."
- **Keep functions small:** Each function should do one thing well. Aim for functions under 20-30 lines.
- **Consistent naming conventions:** Use camelCase for variables and functions, PascalCase for React components and classes.

## Formatting and Style

### Code Formatting
- **Use Prettier** for automatic code formatting across the entire codebase.
- **Line length:** Maximum 100 characters per line (enforced by Prettier).
- **Indentation:** Use 2 spaces for indentation (no tabs).
- **Semicolons:** Always use semicolons to terminate statements.
- **Quotes:** Use single quotes for strings in JavaScript, except when avoiding escaping.

### File Organization
- **One component per file:** Each React component should be in its own file.
- **Meaningful file names:** Use descriptive names that reflect the file's purpose (e.g., `TaskList.js`, `taskUtils.js`).
- **Directory structure:** Group related files in directories (e.g., `components/`, `utils/`, `services/`).

## Import Organization

### Import Order
Organize imports in the following order, with blank lines between groups:

1. **External libraries** (React, third-party packages)
2. **Internal modules** (components, utilities, services)
3. **Styles** (CSS imports)
4. **Assets** (images, icons)

Example:
```javascript
// External libraries
import React, { useState, useEffect } from 'react';
import { Button, TextField } from '@mui/material';

// Internal modules
import TaskList from './components/TaskList';
import { formatDate, sortTasks } from './utils/taskUtils';
import { fetchTasks } from './services/api';

// Styles
import './App.css';
```

### Import Best Practices
- **Use named imports** when importing specific functions or components.
- **Avoid wildcard imports** (e.g., `import * as utils`) unless necessary.
- **Use absolute imports** for shared modules to avoid complex relative paths.

## Linting and Code Quality Tools

### ESLint
- **Use ESLint** to enforce code quality and catch common errors.
- Follow the recommended ESLint configuration for React projects.
- **Fix linting errors before committing code.**
- Run `npm run lint` to check for issues, `npm run lint:fix` to auto-fix where possible.

### Prettier
- **Prettier is mandatory** for consistent code formatting.
- Prettier runs automatically on save (configured in VS Code).
- All code must pass Prettier checks before merging.

### Git Hooks
- **Pre-commit hooks** should run linting and formatting checks.
- Use tools like Husky to enforce code quality before commits.

## JavaScript/React Best Practices

### Modern JavaScript
- **Use ES6+ features:** Arrow functions, destructuring, template literals, spread operator.
- **Prefer const and let** over var. Use const by default, let only when reassignment is needed.
- **Use async/await** for asynchronous operations instead of raw promises.

### React Best Practices
- **Functional components:** Use functional components with hooks instead of class components.
- **Custom hooks:** Extract reusable logic into custom hooks.
- **PropTypes or TypeScript:** Use PropTypes for type checking (or consider migrating to TypeScript).
- **Avoid inline functions in JSX:** Define functions outside JSX to avoid unnecessary re-renders.
- **Use key props correctly:** Always provide unique, stable keys for list items.

### State Management
- **Keep state local when possible:** Only lift state up when multiple components need it.
- **Use Context API** for global state that doesn't change frequently.
- **Consider state management libraries** (Redux, Zustand) for complex state needs.

## Error Handling

### Defensive Programming
- **Validate inputs:** Check function arguments and user inputs before processing.
- **Handle errors gracefully:** Use try-catch blocks for operations that may fail.
- **Provide meaningful error messages:** Help users and developers understand what went wrong.

### Logging
- **Use console.error for errors,** console.warn for warnings, console.log for debugging (remove debug logs before committing).
- **Implement proper logging** in production (consider a logging service).

## Documentation

### Code Comments
- **Document complex logic:** Explain why code exists, not what it does.
- **Use JSDoc comments** for public functions and components to describe parameters and return values.
- **Keep comments up to date:** Outdated comments are worse than no comments.

### README and Documentation
- **Update README.md** when adding new features or changing setup instructions.
- **Maintain documentation files** in the `docs/` directory.
- **Document breaking changes** and migration steps.

## Performance Considerations

### Optimization
- **Avoid premature optimization:** Make it work, then make it fast (only if needed).
- **Use React.memo** for expensive components that don't need frequent re-renders.
- **Lazy load components** that aren't immediately needed.
- **Optimize images and assets** before including them in the project.

### Bundle Size
- **Monitor bundle size:** Use tools like webpack-bundle-analyzer.
- **Avoid unnecessary dependencies:** Carefully evaluate third-party libraries before adding them.
- **Tree-shaking:** Ensure unused code is eliminated during build.

## Version Control

### Git Commit Messages
- **Write clear, descriptive commit messages.**
- Use the imperative mood (e.g., "Add task filtering feature" not "Added task filtering").
- Keep the first line under 50 characters, add details in the body if needed.

### Branching Strategy
- **Feature branches:** Create a new branch for each feature or bug fix.
- **Branch naming:** Use descriptive names (e.g., `feature/add-task-priority`, `fix/date-formatting-bug`).
- **Pull requests:** All code must be reviewed before merging to main.

## Security Best Practices

### Input Validation
- **Sanitize user inputs:** Never trust user input.
- **Validate on both frontend and backend.**
- **Prevent XSS attacks:** Escape user-generated content before rendering.

### Dependencies
- **Keep dependencies up to date:** Regularly run `npm audit` and fix vulnerabilities.
- **Review dependencies:** Be cautious about adding new packages.

---

These guidelines ensure that the TODO application maintains high code quality, readability, and consistency across the codebase.