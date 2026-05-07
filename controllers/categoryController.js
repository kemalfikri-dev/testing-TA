const db = require('../config/db');

// ── READ - Tampilkan semua kategori ──
exports.index = async (req, res) => {
  try {
    const [categories] = await db.query(
      'SELECT * FROM categories'
    );
    res.render('categories/index.ejs', { categories });
  } catch (err) {
    console.log(err);
    res.redirect('/');
  }
};

// ── SHOW FORM CREATE ──
exports.showCreate = (req, res) => {
  res.render('categories/create', { error: null})
};

// ── PROCESS CREATE ──
exports.create = async (req, res) => {
  try {
    const { categories_name } = req.body;
    await db.query(
      'INSERT INTO categories (categories_name) VALUES (?)', [categories_name]
    );
    res.redirect('/categories');
  } catch (err) {

    console.log(err);
    res.render('categories/create', {error: 'Gagal tambahkan kategori'});
  }
};

// ── SHOW FORM EDIT ──
exports.showEdit = async (req, res) => {
  try {
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE categories_id = ?', [req.params.id]
    );
    res.render('categories/edit', {category: categories[0], error: null});
  } catch (err) {
    console.log(err);
    res.redirect('/categories');
  }
};

// ── PROCESS EDIT ──
exports.edit = async (req, res) => {
  try {
    const { categories_name } = req.body;
    await db.query(
      'UPDATE categories SET categories_name = ? WHERE categories_id = ?', 
      [categories_name, req.params.id]
    );
    res.redirect('/categories')
  } catch (err) {
    console.log(err);
    res.redirect('/categories')
  }
};

// ── DELETE ──
exports.hardDelete = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM categories WHERE categories_id = ?', 
      [req.params.id]
    );
    res.redirect('/categories')
  } catch (err) {
    console.log(err);
    res.redirect('/categories')
  }
};