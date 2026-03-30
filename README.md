# Ecommerce Standalone Application

This repository contains both the backend API server and the frontend Vite application for the ecommerce platform. Follow these step-by-step instructions to get everything running locally for development.

## Features

- **Frontend UI:** Built with Vite and modern frontend technologies.
- **Backend API:** Robust API server handling business logic.
- **Database:** PostgreSQL integration via Drizzle ORM.

## Prerequisites

1. **[Node.js](https://nodejs.org/)**: Ensure you have a recent version of Node.js installed.
2. **[PostgreSQL](https://www.postgresql.org/)**: The database service must be installed and running.

---

## Getting Started

### Step 1: Install Dependencies

From the root of the project directory, install all required dependencies.

```bash
npm install --legacy-peer-deps
```

---

### Step 2: Database Setup

The application uses PostgreSQL. You need to create a database and a dedicated user.

1. Open your `psql` shell as the `postgres` superuser:

```bash
sudo -u postgres psql
```

2. Inside the `psql` shell, run the following SQL commands (replace the password placeholder with a secure password):

```sql
CREATE USER ecommerce WITH PASSWORD 'your_secure_password';
CREATE DATABASE ecommerce_db OWNER ecommerce;
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce;
\q
```

---

### Step 3: Configure Environment Variables

The backend API requires an `.env` file to configure database connections and other secrets.

1. Navigate to the API server directory:
```bash
cd artifacts/api-server
```
2. Copy the example environment file:
```bash
cp .env.example .env
```
3. Open the `.env` file in your editor and update it to match the database credentials you set up in Step 2.

---

### Step 4: Run Database Migrations

Before starting the server, you need to set up the database schema using Drizzle ORM.

1. Ensure your `.env` file in the API server directory is correctly filled out.
2. Load the environment variables into your terminal and run the migration command:

```bash
cd lib/db
set -a && source ../../artifacts/api-server/.env && set +a
npm run push
```

---

### Step 5: Start the Backend API Server

Open a **new terminal window/tab** for the backend server so it can run continuously.

1. Navigate to the backend directory:
```bash
cd artifacts/api-server
```
2. Build the backend:
```bash
npm run build
```
3. Start the server:
```bash
npm run dev
```

*The backend will now be running on `http://localhost:3000`.*

---

### Step 6: Start the Frontend Application

Open another **new terminal window/tab** for the frontend development server.

1. Navigate to the frontend directory:
```bash
cd artifacts/ecommerce
```
2. Start the Vite development server:
```bash
npm run dev
```

*The frontend will now be running on `http://localhost:5173`.*

---

## Summary of Running Services

Once everything is started, you will have:

*   **Frontend UI:** `http://localhost:5173` (Visit this in your browser)
*   **Backend API:** `http://localhost:3000`
*   **Database:** PostgreSQL running on `localhost:5432`

The frontend is configured to automatically proxy `/api` requests to the backend server.

