require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');
const ejs = require('ejs');

const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');

// 1. Inisialisasi app DULUAN
const app = express();

// 2. Baru set engine-nya
app.engine('ejs', ejs.__express);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));



// Middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Session setup
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Set to true if using HTTPS
}));

// Pass user data to all views
app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  next();
});

// Routes
app.use('/', publicRoutes);
app.use('/auth', authRoutes);
app.use('/admin', adminRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});



module.exports = app;