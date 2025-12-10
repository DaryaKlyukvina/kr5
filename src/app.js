const express = require('express');
const path = require('path');
const clockRoutes = require('./routes/clockRoutes');
const logger = require('./middleware/logger');

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(logger); // кастомный middleware

// Маршруты API
app.use('/api/clock', clockRoutes);

module.exports = app;