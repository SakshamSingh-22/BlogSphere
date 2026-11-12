
require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();

const connectDB = require('./config/db');

const logger = require('./middleware/logger');
const errorMiddleware = require('./middleware/errorMiddleware');

const postRoutes = require('./routes/postRoutes');
const authRoutes = require('./routes/authRoutes');
const profileRoutes = require('./routes/profileRoutes');

app.use(cors({
    origin: 'http://localhost:5173'
}));

// Parse incoming JSON requests
app.use(express.json());

// Request logger
app.use(logger);

// Welcome route
app.get('/', (req, res) => {
    res.send('Welcome to BlogSphere!');
});

// API routes
app.use('/api/posts', postRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/profiles', profileRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Start server after connecting to MongoDB
const startServer = async () => {
    try {
        await connectDB();

        app.listen(5000, () => {
            console.log('Server is running on port 5000');
        });
    } catch (error) {
        console.error('Server startup failed:', error.message);
        process.exit(1);
    }
};

startServer();
