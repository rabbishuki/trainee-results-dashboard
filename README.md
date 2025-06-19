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

- Only one subject per trainee ID is allowed
- (Additional decisions will be added here as they are made)
