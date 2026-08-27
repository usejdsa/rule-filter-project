# Rule-Based Content Filter

# Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MySQL

# Setup

1. Database
Run `schema.sql` on your MySQL instance:
mysql -u <user> -p < schema.sql

2. Backend
- create backend/.env with DB_HOST, DB_USER, DB_PASSWORD, DB_NAME
cd backend
npm install
npm run dev
(Runs on `http://localhost:5000`)

3. Frontend
cd frontend
npm install
npm run dev
(Runs on `http://localhost:5173`)

## API Endpoints

- GET /rules — list all rules
- POST /rules — create a rule 
- POST /process-text — process text returns -processedHtml matchedCount
- PUT /rules/:id — update a rule
- DELETE /rules/:id — delete a rule