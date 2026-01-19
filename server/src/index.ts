import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

import subjectCategoryRoutes from './routes/subjectCategoryRoutes';
import subjectRoutes from './routes/subjectRoutes';
import studentRoutes from './routes/studentRoutes';
import authRoutes from './routes/authRoutes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subject-categories', subjectCategoryRoutes);
app.use('/api/subjects', subjectRoutes);
// Temporarily public, will protect later or in respective routers
app.use('/api/students', studentRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('SOOD API v2 is running');
});

// Start server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
