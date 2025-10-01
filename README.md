# Todo App - Full Stack Application

A complete CRUD todo application with separate frontend and backend, using Next.js for the frontend and Node.js with Express for the backend.

## Project Structure

```
├── frontend/          # Next.js frontend application
│   ├── src/
│   │   ├── app/       # Next.js app directory
│   │   └── components/ # React components
│   └── package.json
├── backend/           # Node.js backend API
│   ├── controllers/   # Route controllers
│   ├── models/        # Database models
│   ├── routes/        # API routes
│   ├── config/        # Configuration files
│   └── server.js      # Main server file
└── README.md
```

## Features

- ✅ **Frontend**: Next.js with TypeScript and Tailwind CSS
- ✅ **Backend**: Node.js with Express and MongoDB
- ✅ **Database**: MongoDB with Mongoose ODM
- ✅ **Architecture**: Proper MVC structure (Models, Views, Controllers)
- ✅ **CRUD Operations**: Create, Read, Update, Delete todos
- ✅ **Responsive Design**: Custom color scheme (#f0e9d3, #f5cd4c, #000000)

## Quick Start

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)

### Database Setup
1. **Install MongoDB locally** or use MongoDB Atlas (cloud)
2. **Configure database connection** in `backend/.env`:
   ```env
   MONGODB_URI=mongodb://localhost:27017/todoapp
   ```
3. **Test database connection**:
   ```bash
   cd backend
   npm run test-db
   ```

### Backend Setup

1. **Navigate to backend directory:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the backend server:**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the frontend development server:**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:3000`

## API Endpoints

- `GET /api/todos` - Get all todos
- `GET /api/todos/:id` - Get single todo
- `POST /api/todos` - Create new todo
- `PUT /api/todos/:id` - Update todo
- `DELETE /api/todos/:id` - Delete todo
- `GET /api/health` - Health check

## Backend Architecture

### Controllers (`/backend/controllers/`)
- `todoController.js` - Handles all todo-related business logic

### Models (`/backend/models/`)
- `Todo.js` - MongoDB schema for todos

### Routes (`/backend/routes/`)
- `todoRoutes.js` - API route definitions

### Config (`/backend/config/`)
- `database.js` - MongoDB connection configuration

## Frontend Architecture

### Components (`/frontend/src/components/`)
- `TodoForm.tsx` - Form for creating new todos
- `TodoList.tsx` - List display and todo management

### Pages (`/frontend/src/app/`)
- `page.tsx` - Main application page

## Color Scheme

The application uses a custom color palette:
- **Background**: `#f0e9d3` (light cream)
- **Accent**: `#f5cd4c` (golden yellow)
- **Text**: `#000000` (black)

## Development

- Backend uses nodemon for auto-restart during development
- Frontend uses Next.js hot reload for instant updates
- Both applications can run simultaneously on different ports