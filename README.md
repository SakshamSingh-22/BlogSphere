# BlogSphere 📝

A full-stack blogging platform built with the MERN stack (MongoDB, Express.js, React, and Node.js). BlogSphere allows users to create and publish blog posts, explore stories, interact with posts, and build their own profiles.

## ✨ Features

- **User Authentication** – Register and log in securely.
- **Automatic Login** – Users are logged in automatically after registration.
- **User Profiles** – Create a profile with a unique username, bio, location, and website.
- **Create Blog Posts** – Write, edit, and manage blog posts.
- **Explore Stories** – Browse published posts and discover content from other users.
- **Like & Dislike** – React independently to published posts.
- **Comments** – Add comments to posts and delete your own comments.
- **Draft Support** – Save posts as drafts before publishing.
- **Author Profiles** – Visit the profiles of blog authors.

## 🛠️ Tech Stack

**Frontend**
- React.js
- Vite
- React Router
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose
- JSON Web Tokens (JWT)
- bcryptjs

## 📁 Project Structure

```text
Blogging/
├── client/
│   ├── public/
│   └── src/
│       ├── Context/
│       ├── components/
│       ├── pages/
│       ├── App.jsx
│       └── main.jsx
│
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── .env
│
├── .gitignore
└── README.md
```

## 🚀 Getting Started

Follow these steps to run BlogSphere locally.

### 1. Clone the repository

```bash
git clone https://github.com/SakshamSingh-22/BlogSphere.git
cd BlogSphere
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure environment variables

Create a `.env` file inside the `server` folder.

Add the environment variables required by your backend:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

Use the exact variable names expected by your server configuration.

### 4. Start the backend

From the `server` folder:

```bash
npm run dev
```

### 5. Install frontend dependencies

Open another terminal:

```bash
cd client
npm install
```

### 6. Start the frontend

```bash
npm run dev
```

Open the local URL displayed by Vite, usually:

```text
http://localhost:5173
```

## 🔐 Authentication

BlogSphere uses JWT-based authentication to protect user-specific actions such as creating posts, editing profiles, reacting to posts, and commenting.

Passwords are hashed before being stored in the database.

## 🌱 Future Improvements

- Profile picture uploads
- Search and filtering
- Post categories and tags
- Pagination
- Rich text editor
- Responsive UI enhancements

## 👨‍💻 Author

**Saksham Singh**

GitHub: [@SakshamSingh-22](https://github.com/SakshamSingh-22)

---

Built with ❤️ using the MERN stack.