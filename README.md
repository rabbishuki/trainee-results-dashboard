# Trainee Results Dashboard

## Introduction

The Trainee Results Dashboard is a web application designed to track, analyze, and monitor trainee performance across various subjects. It provides a comprehensive view of trainee data, including grades, personal information, and progress over time. The dashboard features filtering capabilities, analytical charts, and status monitoring to help instructors and administrators effectively manage trainee performance.

## Technology Stack

This project uses the following technologies:

- **Angular**: ^20.0.0 (CLI: ^20.0.2)
- **TypeScript**: ~5.8.2
- **Jest**: ^29.7.0 (for unit testing)
- **Angular Material**: ^20.0.3 (for UI components)

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with Jest, use the following command:

```bash
npm test
```

This will run Jest in watch mode with coverage reporting.

## Decisions

This section documents important architectural and design decisions made during development:

### Architecture & Design Decisions
#### Frontend Framework

- Angular with Standalone Components - Modern Angular approach, no modules needed
- Angular Material Design - Comprehensive UI component library for consistent design
- Angular Signals - Modern reactive state management for better performance and developer experience

#### Reactive Programming Patterns

- Manual signal updates for CRUD operations - Immediate updates for add/edit/delete operations without debouncing
- Separation of concerns: Search observables for user input, direct signal updates for data changes

#### State Management Strategy

- Signals for local component state - Modern Angular approach for reactive UI updates
- localStorage for state persistence - Page state (filter, pagination) persists across navigation
- Service-level data change notifications - dataChanged$ observable for coordinating updates across components

#### Data Flow Design

- Immutable updates at component boundary - Service uses normal array operations, component creates new references for signals
- Single source of truth - Service holds the canonical data, components react to changes
- Reactive pipeline: Filter changes + Data changes → Search results → Signal updates → UI updates

#### Form & Validation Strategy

- Reactive Forms with comprehensive validation - Type-safe forms with real-time validation feedback
- Manual date entry enabled - Users can type dates or use datepicker for better UX
- Sectioned form layout - Logical grouping of related fields for better usability

#### Testing Approach

- Jest for unit testing - Modern testing framework with better performance than Karma
- Service mocking - Isolated component testing with jasmine spies
- Observable testing - Proper async testing patterns for reactive code

#### UI/UX Decisions

- Material Dialog over native dialog - Better accessibility and consistent styling
- OnPush change detection - Performance optimization
- Mobile-responsive design - Adaptive layouts for different screen sizes
- Visual feedback - Row selection, hover states, loading indicators

#### Performance Optimizations

- Single-pass filtering - Efficient search algorithm that filters data in one iteration
- Computed signals for derived state - Automatic recalculation only when dependencies change

#### Code Organization

- Feature-based structure - Components grouped by functionality
- Standalone components - No Angular modules, cleaner dependency injection
- TypeScript strict mode - Better type safety and developer experience

#### Trade-offs Made

- Manual array spreading for signals - Chose immutability at component boundary over service-level immutability
- localStorage over session storage - Persistent state across browser sessions
- Dialog for details over inline editing - Better mobile experience and focused editing
- Synchronous + reactive hybrid - Combined immediate CRUD updates with debounced search for optimal UX
