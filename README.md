# Full-Stack Expense Tracker

A client-side single-page application (SPA) designed to manage personal finances. This project implements a complete CRUD workflow, secure simulated authentication, and data visualization, optimized for direct deployment on GitHub Pages.

## 
- **Authentication System**: 
  - Simulated JWT authentication flow with Base64 encoding.
  - User registration and login persisted via LocalStorage.
  - Client-side route protection and session management.

- **Expense Management (CRUD)**:
  - Add, view, edit, and delete expense records.
  - Detailed tracking including Category, Amount, Created At, and Updated At.
  - Automatic sorting of records by most recent.

- **Data Persistence**:
  - Utilizes IndexedDB via Dexie.js for high-performance, asynchronous client-side storage.

- **Data Visualization**:
  - Integrated Chart.js for categorical spending breakdown.

## Technical Stack

- **Frontend**: HTML5, CSS, Vanilla JavaScript.
- **Libraries**: Dexie.js (Database), Chart.js (Visualization).

## Project Structure

- `src/index.html`: Main application structure.
- `src/style.css`: Application styling.
- `src/app.js`: Core CRUD and UI logic.
- `src/auth.js`: Authentication and JWT simulation.
- `src/db.js`: IndexedDB configuration.