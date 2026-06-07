# Library Management System

A full-stack library management application for managing books, students, issue records, returns, and reports.

## Features

- Role-based dashboards for administrators, librarians, and students
- Book and student management
- Book issue and return tracking
- Library reports and activity summaries
- MongoDB-backed persistence with a local in-memory fallback

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```
2. Copy the environment template and configure your MongoDB connection:
   ```bash
   cp .env.example .env.local
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

The application is available at `http://localhost:3000`.

## Available Scripts

- `npm run dev` — start the development server
- `npm run build` — build the client and server for production
- `npm start` — run the production build
- `npm run lint` — run TypeScript checks
- `npm run clean` — remove generated build output
