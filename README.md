# Ecommerce Standalone Application

This project contains both the backend API server and the frontend Vite application for the ecommerce platform. Follow these step-by-step instructions to get everything running locally.

## Prerequisites

1. **Node.js**: Ensure you have a recent version of Node.js installed.
2. **PostgreSQL**: The database must be installed and running.

---

## Step 1: Install Dependencies

From the root of the `ecommerce-standalone` directory, install all required dependencies. Since this was extracted from a workspace, we use the `--legacy-peer-deps` flag to avoid minor conflicts.

```bash
cd "/home/kingloic/Documents/My projects/ecommerce-standalone"
npm install --legacy-peer-deps
```

---

## Step 2: Database Setup

The application uses PostgreSQL. We need to create a user and a database. If you already ran these commands earlier, you can skip this step.

Open a terminal and run the `psql` shell as the `postgres` superuser:

```bash
sudo -u postgres psql
```

Inside the `psql` shell, run the following SQL commands:

```sql
CREATE USER ecommerce WITH PASSWORD 'ecommerce123';
CREATE DATABASE ecommerce_db OWNER ecommerce;
GRANT ALL PRIVILEGES ON DATABASE ecommerce_db TO ecommerce;
\q
```

---

## Step 3: Configure Environment Variables

The backend API requires an `.env` file to know how to connect to the database.

1. Navigate to the API server directory:
```bash
cd "/home/kingloic/Documents/My projects/ecommerce-standalone/artifacts/api-server"
```
2. Copy the example environment file:
```bash
cp .env.example .env
```
3. Your `.env` file is already pre-configured to point to the database you created in Step 2:
```env
PORT=3000
DATABASE_URL=postgresql://ecommerce:ecommerce123@localhost:5432/ecommerce_db
SESSION_SECRET=change-me-to-something-secret
LOG_LEVEL=info
```

---

## Step 4: Run Database Migrations

Before starting the server, you need to set up the database schema using Drizzle ORM.

1. Keep your terminal in the API server directory (or go back to the project root). The push script needs the `DATABASE_URL` environment variable.
2. Run the migration command:

```bash
cd "/home/kingloic/Documents/My projects/ecommerce-standalone/lib/db"
DATABASE_URL=postgresql://ecommerce:ecommerce123@localhost:5432/ecommerce_db npx drizzle-kit push --config ./drizzle.config.ts
```

*Note: If you run into issues finding `drizzle-kit`, you can prefix the command with `npx`.*

---

## Step 5: Start the Backend API Server

You will need to open a **new terminal window/tab** for the backend server so it can run continuously.

1. Open **Terminal 1**.
2. Navigate to the backend directory:
```bash
cd "/home/kingloic/Documents/My projects/ecommerce-standalone/artifacts/api-server"
```
3. Build the backend:
```bash
npm run build
```
4. Start the server:
```bash
npm run dev
```

*The backend will now be running on http://localhost:3000.*

---

## Step 6: Start the Frontend Application

You will need another **new terminal window/tab** for the frontend development server.

1. Open **Terminal 2**.
2. Navigate to the frontend directory:
```bash
cd "/home/kingloic/Documents/My projects/ecommerce-standalone/artifacts/ecommerce"
```
3. Start the Vite development server:
```bash
npm run dev
```

*The frontend will now be running on http://localhost:5173.*

---

## Summary of Running Services

Once everything is started, you will have:

*   **Frontend UI:** http://localhost:5173 (Visit this in your browser)
*   **Backend API:** http://localhost:3000
*   **Database:** PostgreSQL running on localhost:5432

The frontend is configured to automatically proxy `/api` requests to the backend on port 3000.
