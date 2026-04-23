  const express = require('express');
  const session = require('express-session');
  const path = require('path');
  require('dotenv').config();

  const app = express();

  // ── View Engine ──
  app.set('view engine', 'ejs');
  app.set('views', path.join(__dirname, 'views'));

  // ── Middleware ──
  app.use(express.urlencoded({ extended: true })); // baca data dari form HTML
  app.use(express.json()); // baca data JSON
  app.use(express.static(path.join(__dirname, 'public'))); // file statis (css, img)

  // ── Session ──
  app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 } // 1 hari
  }));

  // ── Biar views bisa akses data user session ──
  app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    next();
  });

  // ── Routes ──
  app.use('/auth', require('./routes/authRoutes'));
  app.use('/categories', require('./routes/categoryRoutes'));
  app.use('/menus', require('./routes/menuRoutes'));
  app.use('/orders', require('./routes/orderRoutes'));

  // ── Home ──
  app.get('/', (req, res) => {
    res.redirect('/menus');
  });

  // ── 404 ──
  app.use((req, res) => {
    res.status(404).send('Halaman tidak ditemukan');
  });

  // ── Jalankan Server ──
  const PORT = process.env.PORT || 8080;
  app.listen(PORT, () => {
    console.log(`Server jalan di http://localhost:${PORT}`);
  });
