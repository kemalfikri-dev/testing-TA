const db = require('../config/db');
const bcrypt = require('bcrypt');

// ── SHOW REGISTER PAGE ──
exports.showRegister = (req, res) => {
  res.render('auth/register', { error: null });
};

// ── PROCESS REGISTER ──
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Cek email sudah ada atau belum
    const [existing] = await db.query(
      'SELECT * FROM users WHERE email = ?', [email]
    );

    if (existing.length > 0) {
      return res.render('auth/register', { error: 'Email sudah terdaftar!' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Simpan ke database
    await db.query(
      'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
      [name, email, hashedPassword]
    );

    res.redirect('/auth/login');

  } catch (err) {
    console.log(err);
    res.render('auth/register', { error: 'Terjadi kesalahan, coba lagi!' });
  }
};

// ── SHOW LOGIN PAGE ──
exports.showLogin = (req, res) => {
  res.render('auth/login', { error: null });
};

// ── PROCESS LOGIN ──
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Cari user di database
    const [users] = await db.query(
      'SELECT * FROM users WHERE email = ?', [email]
    );

    if (users.length === 0) {
      return res.render('auth/login', { error: 'Email tidak ditemukan!' });
    }

    const user = users[0];

    // Bandingkan password
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.render('auth/login', { error: 'Password salah!' });
    }

    // Simpan ke session
    req.session.user = {
      users_id: user.users_id,
      name: user.name,
      role: user.role
    };

    res.redirect('/menus');

  } catch (err) {
    console.log(err);
    res.render('auth/login', { error: 'Terjadi kesalahan, coba lagi!' });
  }
};

// ── LOGOUT ──
exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/auth/login');
};