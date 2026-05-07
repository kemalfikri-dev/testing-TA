const db = require('../config/db');

// ── READ - Tampilkan semua kategori ──
exports.index = async (req, res) => {
  try {
    const search = req.query.search || '';

    const [menus] = await db.query(`
      SELECT m.*, c.categories_name 
      FROM menus m
      JOIN categories c ON m.categories_id = c.categories_id
      WHERE m.deleted_at IS NULL
      AND m.menu_name LIKE ?`
      , [`%${search}%`]);
    res.render('menus/index', { menus, search });
  } catch (err) {
    console.log(err);
    res.redirect('/')
  }
};

// ── SHOW ARCHIVE ──
exports.archive = async (req, res) => {
  try {
    const search = req.query.search || '';

    const [menus] = await db.query(`
      SELECT m.*, c.categories_name 
      FROM menus m
      JOIN categories c ON m.categories_id = c.categories_id
      WHERE m.deleted_at IS NOT NULL
      AND m.menu_name LIKE ?`
      , [`%${search}%`]);
    res.render('menus/archive', { menus, search });
  } catch (err) {
    console.log(err);
    res.redirect('/menus')
  }
};

// ── SHOW FORM CREATE ──
exports.showCreate = async (req, res) => {
  try {
    const [categories] = await db.query('SELECT * FROM categories');
    res.render('menus/create', { error: null, categories });
  } catch (err) {
    console.log(err);
    res.redirect('/menus');
  }
};

// ── PROCESS CREATE ──
exports.create = async (req, res) => {
  try {
    const { menu_name, price, description, categories_id } = req.body;

    if (price < 0) {
      const [categories] = await db.query('SELECT * FROM categories');
      return res.render('menus/create', { error: 'Harga tidak boleh negatif', categories });
    }

    await db.query(
      'INSERT INTO menus (menu_name, price, description, categories_id) VALUES (?, ?, ?, ?)',
      [menu_name, price, description, categories_id]
    );
    res.redirect('/menus');
  } catch (err) {
    // render balik ke create, kirim pesan error
    console.log(err);
    res.render('menus/create', { error: 'Gagal tambahkan kategori' });
  }
};

// ── SHOW FORM EDIT ──
exports.showEdit = async (req, res) => {
  try {
    const [menus] = await db.query(
      'SELECT * FROM menus WHERE menus_id = ?', [req.params.id]
    );
    const [categories] = await db.query('SELECT * FROM categories'); // ← tambah ini
    res.render('menus/edit', { menu: menus[0], categories, error: null });
  } catch (err) {
    // redirect ke /categories
    console.log(err);
    res.redirect('/menus');
  }
};

// ── PROCESS EDIT ──
exports.edit = async (req, res) => {
  try {
    const { menu_name, price, description, categories_id } = req.body;

    if (price < 0) {
      const [menus] = await db.query('SELECT * FROM menus WHERE menus_id = ?', [req.params.id]);
      const [categories] = await db.query('SELECT * FROM categories');
      return res.render('menus/edit', { menu: menus[0], categories, error: 'Harga tidak boleh negatif' });
    }

    await db.query(
      'UPDATE menus SET menu_name = ?, price = ?, description = ?, categories_id = ? WHERE menus_id = ?',
      [menu_name, price, description, categories_id, req.params.id]
    );
    res.redirect('/menus')
  } catch (err) {
    console.log(err);
    res.redirect('/menus')
  }
};

// -- SOFT DELETE --
exports.softDelete = async (req, res) => {
  try {
    await db.query(
      'UPDATE menus SET deleted_at = NOW() WHERE menus_id = ?',
      [req.params.id]
    );
    res.redirect('/menus')
  } catch (err) {
    console.log(err);
    res.redirect('/menus')
  }
};

// -- RESTORE --
exports.restore = async (req, res) => {
  try {
    await db.query(
      'UPDATE menus SET deleted_at = NULL WHERE menus_id = ?',
      [req.params.id]
    );
    res.redirect('/menus/archive')
  } catch (err) {
    console.log(err);
    res.redirect('/menus/archive')
  }
};
// ── DELETE ──
exports.hardDelete = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM order_details WHERE menus_id = ?',
      [req.params.id]
    );
    
    // Baru hapus menu
    await db.query(
      'DELETE FROM menus WHERE menus_id = ?',
      [req.params.id]
    );
    res.redirect('/menus/archive')
  } catch (err) {
    console.log(err);
    res.redirect('/menus/archive')
  }
};