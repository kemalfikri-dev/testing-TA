const db = require('../config/db');

// ── READ - Tampilkan semua kategori ──
exports.index = async (req, res) => {
  try {
    // query SELECT semua data dari tabel categories
    // render ke views/categories/index.ejs, kirim data categories
    const [categories] = await db.query(
      'SELECT * FROM categories'
    );
    res.render('categories/index.ejs', { categories });
  } catch (err) {
    console.log(err);
    res.redirect('/');
    // console.log error
    // redirect ke '/'
  }
};

// ── SHOW FORM CREATE ──
exports.showCreate = (req, res) => {
  // render ke views/categories/create.ejs, kirim error: null
  res.render('categories/create', { error: null})
};

// ── PROCESS CREATE ──
exports.create = async (req, res) => {
  try {
    // destructuring categories_name dari req.body
    // query INSERT ke tabel categories
    // redirect ke /categories
    const { categories_name } = req.body;
    await db.query(
      'INSERT INTO categories (categories_name) VALUES (?)', [categories_name]
    );
    res.redirect('/categories');
  } catch (err) {
    // render balik ke create, kirim pesan error
    console.log(err);
    res.render('categories/create', {error: 'Gagal tambahkan kategori'});
  }
};

// ── SHOW FORM EDIT ──
exports.showEdit = async (req, res) => {
  try {
    // query SELECT kategori berdasarkan req.params.id
    // render ke views/categories/edit.ejs, kirim category dan error: null
    const [categories] = await db.query(
      'SELECT * FROM categories WHERE categories_id = ?', [req.params.id]
    );
    res.render('categories/edit', {category: categories[0], error: null});
  } catch (err) {
    // redirect ke /categories
    console.log(err);
    res.redirect('/categories');
  }
};

// ── PROCESS EDIT ──
exports.edit = async (req, res) => {
  try {
    // destructuring categories_name dari req.body
    // query UPDATE categories berdasarkan req.params.id
    // redirect ke /categories
    const { categories_name } = req.body;
    await db.query(
      'UPDATE categories SET categories_name = ? WHERE categories_id = ?', 
      [categories_name, req.params.id]
    );
    res.redirect('/categories')
  } catch (err) {
    // redirect ke /categories
    console.log(err);
    res.redirect('/categories')
  }
};

// ── DELETE ──
exports.hardDelete = async (req, res) => {
  try {
    // query DELETE berdasarkan req.params.id
    // redirect ke /categories
    await db.query(
      'DELETE FROM categories WHERE categories_id = ?', 
      [req.params.id]
    );
    res.redirect('/categories')
  } catch (err) {
    // redirect ke /categories
    console.log(err);
    res.redirect('/categories')
  }
};