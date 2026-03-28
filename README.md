# 🎓 TeachVault — Faculty Management System

A full-stack web application built with **CodeIgniter 4** (PHP backend) and **React + Vite** (frontend), featuring JWT authentication and a beautiful dark/modern UI.

---

## 🗂️ Project Structure

```
project/
├── backend/               # CodeIgniter 4 API
│   ├── app/
│   │   ├── Controllers/Api/
│   │   │   ├── AuthController.php
│   │   │   ├── UserController.php
│   │   │   ├── TeacherController.php
│   │   │   └── HealthController.php
│   │   ├── Models/
│   │   │   ├── AuthUserModel.php
│   │   │   └── TeacherModel.php
│   │   ├── Filters/
│   │   │   ├── JWTFilter.php
│   │   │   └── CORSFilter.php
│   │   ├── Config/
│   │   │   ├── Routes.php
│   │   │   └── Filters.php
│   │   └── Database/Migrations/
│   ├── database.sql       # SQL dump for quick setup
│   ├── composer.json
│   └── .env
├── frontend/              # React + Vite app
│   ├── src/
│   │   ├── api/axios.js
│   │   ├── context/AuthContext.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Users.jsx
│   │   │   ├── Teachers.jsx
│   │   │   └── AddTeacher.jsx
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/_redirects   # Fixes React Router on Render
│   ├── .env
│   └── package.json
├── render.yaml            # Render deployment config
└── README.md
```

---

## ✅ Prerequisites

Make sure you have the following installed:

- **PHP** >= 8.1
- **Composer** >= 2.x
- **Node.js** >= 18.x and **npm** >= 9.x
- **MySQL** >= 8.0
- **Git**

---

## 🚀 Local Setup

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/teachvault.git
cd teachvault
```

---

### 2. Database Setup

Open MySQL and run the SQL dump:

```bash
mysql -u root -p < backend/database.sql
```

Or manually in MySQL:

```sql
CREATE DATABASE teacher_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE teacher_db;
-- then paste the contents of backend/database.sql
```

---

### 3. Backend Setup (CodeIgniter 4)

```bash
cd backend
composer install
```

Copy and configure the environment file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
CI_ENVIRONMENT = development

app.baseURL = 'http://localhost:8080'

database.default.hostname = localhost
database.default.database = teacher_db
database.default.username = root
database.default.password = YOUR_MYSQL_PASSWORD
database.default.DBDriver = MySQLi
database.default.port = 3306

JWT_SECRET = your_super_secret_key_change_this
JWT_EXPIRE = 86400
```

Run migrations (optional — or use the SQL dump above):

```bash
php spark migrate
```

Start the backend server:

```bash
php spark serve
```

Backend runs at: **http://localhost:8080**

---

### 4. Frontend Setup (React + Vite)

```bash
cd ../frontend
npm install
```

Configure the `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8080/api
```

Start the development server:

```bash
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/health` | ❌ | Health check |
| POST | `/api/register` | ❌ | Register new user |
| POST | `/api/login` | ❌ | Login and get JWT token |
| GET | `/api/users` | ✅ JWT | Get all users |
| GET | `/api/teachers` | ✅ JWT | Get all teachers (joined with users) |
| POST | `/api/teachers/create` | ✅ JWT | Create teacher + user account |

### Example: Register

```bash
curl -X POST http://localhost:8080/api/register \
  -H "Content-Type: application/json" \
  -d '{"first_name":"John","last_name":"Doe","email":"john@example.com","password":"secret123"}'
```

### Example: Login

```bash
curl -X POST http://localhost:8080/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"secret123"}'
```

### Example: Create Teacher (protected)

```bash
curl -X POST http://localhost:8080/api/teachers/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "first_name":"Jane","last_name":"Smith","email":"jane@uni.edu",
    "password":"password123","university_name":"Mumbai University",
    "gender":"female","year_joined":2020,"bio":"Professor of Computer Science"
  }'
```

---

## 🌐 Deploying on Render

### Step 1 — Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/teachvault.git
git push -u origin main
```

---

### Step 2 — Create MySQL Database on Render

1. Go to [render.com](https://render.com) → **New → PostgreSQL** *(or use PlanetScale/Aiven for MySQL)*
2. **Recommended**: Use **PlanetScale** (free MySQL) or **Railway MySQL** as the database
3. Copy the connection credentials

---

### Step 3 — Deploy Backend on Render

1. Go to Render → **New → Web Service**
2. Connect your GitHub repo
3. Set these settings:
   - **Root Directory**: `backend`
   - **Environment**: `PHP`
   - **Build Command**: `composer install --no-dev --optimize-autoloader`
   - **Start Command**: `php spark serve --host 0.0.0.0 --port $PORT`
4. Add **Environment Variables**:

| Key | Value |
|-----|-------|
| `CI_ENVIRONMENT` | `production` |
| `app.baseURL` | `https://your-backend.onrender.com` |
| `database.default.hostname` | *(from your MySQL provider)* |
| `database.default.database` | *(db name)* |
| `database.default.username` | *(db user)* |
| `database.default.password` | *(db password)* |
| `database.default.DBDriver` | `MySQLi` |
| `JWT_SECRET` | *(random long string)* |
| `JWT_EXPIRE` | `86400` |

5. Click **Deploy**
6. After deploy, run migrations by opening the Render **Shell**:
   ```bash
   php spark migrate
   ```

---

### Step 4 — Deploy Frontend on Render

1. Go to Render → **New → Static Site**
2. Connect your GitHub repo
3. Set these settings:
   - **Root Directory**: `frontend`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
4. Add **Environment Variable**:

| Key | Value |
|-----|-------|
| `VITE_API_BASE_URL` | `https://your-backend.onrender.com/api` |

5. Click **Deploy**

> ✅ The `public/_redirects` file is already included and fixes React Router page refresh 404 errors on Render.

---

## 🎨 Features

- ✅ JWT Authentication (Register / Login / Logout)
- ✅ Protected API routes with JWT middleware
- ✅ CORS enabled for cross-origin requests
- ✅ 1-to-1 relationship between `auth_user` and `teachers`
- ✅ Single POST API inserts into both tables transactionally
- ✅ React Router with protected routes
- ✅ DataTables with search, sort, and pagination
- ✅ Toast notifications
- ✅ Dark/Modern UI with purple-cyan gradient
- ✅ Fully responsive (mobile + desktop)
- ✅ Health check endpoint for Render
- ✅ React Router 404 fix for Render (`_redirects`)

---

## 🧪 Testing the App

1. Open the frontend URL
2. Click **Register** and create an account
3. **Login** with your credentials
4. Go to **Add Teacher** and fill in the form
5. View your data in **Users** and **Teachers** tables
6. Click **Logout** — you'll be redirected to Login

---

## 📦 Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend Framework | CodeIgniter 4 |
| Language | PHP 8.1+ |
| Authentication | JWT (firebase/php-jwt) |
| Database | MySQL 8 |
| Frontend Framework | React 18 + Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Routing | React Router DOM v6 |
| Tables | react-data-table-component |
| Notifications | react-hot-toast |
| Fonts | Syne + JetBrains Mono |

---

## 🔐 Security Notes

- Passwords are hashed using `password_hash()` with `PASSWORD_BCRYPT`
- JWT tokens expire after 24 hours
- All protected routes validate the Bearer token
- CORS headers are set to allow frontend communication
- Change `JWT_SECRET` to a long random string in production

---

## 📁 Database Export

The `backend/database.sql` file contains the complete schema.
To export your data after adding records:

```bash
mysqldump -u root -p teacher_db > backend/database.sql
```

---

## 👨‍💻 Author

Built as part of Full Stack Intern interview task.
