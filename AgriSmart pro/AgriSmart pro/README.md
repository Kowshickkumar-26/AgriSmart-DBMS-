# AgriSmart

AgriSmart is a simple full-stack agriculture management prototype with a Node.js + Express backend and a static frontend.

## Project structure

- `backend/`: API server, database config, routes, and SQL schema files
- `frontend/`: static web pages, styles, and dashboard app logic

## Prerequisites

- Node.js 18+ installed
- MySQL server installed and running
- A MySQL user with access to create the `agrismart` database

## Setup

1. Open a terminal and go to the backend folder:

```powershell
cd "d:\AgriSmart pro (3)\AgriSmart pro\AgriSmart pro\backend"
```

2. Install dependencies:

```powershell
npm install
```

3. Create a `.env` file from the example:

```powershell
copy .env.example .env
```

Then update `.env` with your local MySQL credentials.

4. Create the database schema and optional demo data in MySQL:

```powershell
mysql -u <your_mysql_user> -p < sql/schema.sql
mysql -u <your_mysql_user> -p < sql/seed.sql
```

If you are using the `agrismart_user` credentials from the schema file, the default password is `Password123!`.

## Run the app

From the `backend` directory:

```powershell
npm run dev
```

Then open in your browser:

```text
http://localhost:4000
```

## Demo login

Use the seeded demo account:

- Username: `admin`
- Password: `123456`

## Notes

- The backend now serves the frontend from `http://localhost:4000`
- The frontend calls the API with a same-origin path (`/api`)
- If you want production mode, use:

```powershell
npm start
```
