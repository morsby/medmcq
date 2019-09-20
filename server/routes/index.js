import express from 'express';
import swaggerJSDoc from 'swagger-jsdoc';
import path from 'path';
import authRoutes from './auth';
import examSetRoutes from './exam_sets';
import questionRoutes from './questions';
import specialtyRoutes from './specialties';
import semesterRoutes from './semesters';
import tagRoutes from './tags';
import userRoutes from './users';

const app = express();

// API DOCS
const swaggerDefinition = {
  info: {
    title: 'medMCQ',
    version: '1.0.0',
    description: 'API for medMCQ'
  },
  servers: [{ url: 'http://localhost:3001/api/' }],
  openapi: '3.0.0'
};
const options = {
  swaggerDefinition,
  apis: [path.resolve(__dirname, 'server.js'), './routes/*.js']
};

const swaggerSpec = swaggerJSDoc(options);

app.get('/spec.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

app.get('/docs', (req, res) => {
  res.sendFile(path.join(__dirname, '_redoc.html'));
});

// Define routes
// convert between snake_case and camelCase
// app.use(caseConverter());
app.use('/auth', authRoutes);
app.use('/exam_sets', examSetRoutes);
app.use('/questions', questionRoutes);
app.use('/semesters', semesterRoutes);
app.use('/specialties', specialtyRoutes);
app.use('/tags', tagRoutes);
app.use('/users', userRoutes);

module.exports = app;
