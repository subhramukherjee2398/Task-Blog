# Full-Stack Blog Application

A modern full-stack blog application built with **Express.js**, **React**, **Vite**, **Tailwind CSS**, **MongoDB**, and **JWT Authentication**.

## Features

- ✅ User Authentication (Sign up, Login, Logout) with JWT
- ✅ HTTP-only cookies for secure token storage
- ✅ Create, Read, Update, Delete blog posts
- ✅ Rich Text Editor for creating blog posts
- ✅ Only authors can edit/delete their posts
- ✅ Comments on blog posts
- ✅ Edit and delete your own comments
- ✅ Modern React with Vite for fast development
- ✅ Beautiful UI with Tailwind CSS
- ✅ RESTful API with Express.js
- ✅ MongoDB database with Mongoose ODM
- ✅ Auto-restart with nodemon during development
- ✅ Redux Toolkit for state management
- ✅ Responsive design

## Prerequisites

- Node.js (v16 or higher)
- npm
- MongoDB Atlas connection string (configured in .env)

## Project Structure

```
Blog-Project/
├── backend/                    # Express.js backend
│   ├── controllers/            # Request handlers (MVC pattern)
│   │   ├── postController.js   # Post CRUD operations
│   │   ├── userController.js   # User/Auth operations
│   │   └── commentController.js # Comment operations
│   ├── middleware/             # Custom middleware
│   │   └── auth.js             # JWT authentication
│   ├── models/                 # Mongoose schemas
│   │   ├── Post.js
│   │   ├── User.js
│   │   └── Comment.js
│   ├── routes/                 # Route definitions
│   │   ├── auth.js
│   │   ├── posts.js
│   │   ├── users.js
│   │   └── comments.js
│   ├── server.js               # Main server file
│   ├── .env                    # Environment variables
│   └── package.json
├── frontend/                   # React + Vite frontend
│   ├── src/
│   │   ├── pages/              # Page components
│   │   │   ├── auth/           # Authentication pages
│   │   │   │   ├── Login.jsx
│   │   │   │   ├── Register.jsx
│   │   │   │   └── index.js
│   │   │   ├── posts/          # Blog post pages
│   │   │   │   ├── PostList.jsx
│   │   │   │   ├── PostDetail.jsx
│   │   │   │   ├── CreatePost.jsx
│   │   │   │   └── index.js
│   │   │   ├── Home.jsx
│   │   │   └── index.js        # Pages barrel export
│   │   ├── store/              # Redux store
│   │   │   ├── slices/         # Redux slices
│   │   │   │   ├── authSlice.js
│   │   │   │   ├── postsSlice.js
│   │   │   │   └── commentsSlice.js
│   │   │   └── index.js        # Store configuration
│   │   ├── api.js              # Axios instance
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── package.json                # Root package.json
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm

### Installation

1. Install all dependencies:
```bash
npm run install-all
```

### Running the Application

**Option 1: Run both servers together**
```bash
npm run dev
```

**Option 2: Run servers separately**

Terminal 1 (Backend):
```bash
npm run dev:backend
```

Terminal 2 (Frontend):
```bash
npm run dev:frontend
```

### Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## API Endpoints

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/profile` | Update profile | Yes |

### Posts (MVC Structure)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Get all posts (paginated) | No |
| GET | `/api/posts?search=query` | Search posts | No |
| GET | `/api/posts/my-posts` | Get current user's posts | Yes |
| GET | `/api/posts/:slug` | Get single post by slug | No |
| POST | `/api/posts` | Create new post | Yes |
| PUT | `/api/posts/:slug` | Update post (author only) | Yes |
| DELETE | `/api/posts/:slug` | Delete post (author only) | Yes |

### Comments

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/comments/post/:postId` | Get all comments for a post | No |
| GET | `/api/comments/my-comments` | Get current user's comments | Yes |
| POST | `/api/comments` | Create new comment | Yes |
| PUT | `/api/comments/:id` | Update comment (author only) | Yes |
| DELETE | `/api/comments/:id` | Delete comment (author/post author/admin) | Yes |

### Query Parameters for GET /api/posts

- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)
- `search` - Search in title and content
- `author` - Filter by author ID

### Post Schema

```javascript
{
  title: String (required, 3-100 chars),
  slug: String (unique, auto-generated),
  content: String (required, min 10 chars),
  excerpt: String (max 200 chars),
  author: ObjectId (ref: User),
  authorName: String,
  status: 'draft' | 'published',
  views: Number,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment Schema

```javascript
{
  content: String (required, 1-1000 chars),
  post: ObjectId (ref: Post),
  user: ObjectId (ref: User),
  userName: String,
  userEmail: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Technologies Used

### Backend
- Express.js
- MongoDB with Mongoose
- JWT (jsonwebtoken) for authentication
- bcryptjs for password hashing
- cookie-parser for HTTP-only cookies
- CORS
- dotenv
- nodemon for auto-reload
- slugify for URL slugs

### Frontend
- React 18
- Vite
- Tailwind CSS
- React Router DOM
- **Redux Toolkit** for state management
- **React Quill** for rich text editing
- Axios

### Key Features Implemented
- ✅ **User Authentication** - Register, login, logout with JWT and HTTP-only cookies
- ✅ **Blog Posts CRUD** - Create, read, update, delete posts with slug-based URLs
- ✅ **Rich Text Editor** - Create posts with formatting (headings, bold, italic, lists, code blocks, links, images)
- ✅ **Comments System** - Add, edit, delete comments on posts
- ✅ **Authorization** - Only authors can edit/delete their posts and comments
- ✅ **View Counter** - Track post views
- ✅ **Pagination** - Paginated post listing
- ✅ **Search** - Full-text search on posts
- ✅ **Responsive Design** - Mobile-friendly UI with Tailwind CSS

## License

ISC
