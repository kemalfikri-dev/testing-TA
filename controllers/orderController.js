const db = require('../config/db');

// ── READ - Tampilkan semua kategori ──
exports.index = async (req, res) => {
  try {
    const search = req.query.search || '';
    const userId = req.session.user.users_id;

    const[orders] = await db.query (`
      SELECT o.orders_id, u.name, m.menu_name, od.quantity, od.subtotal, o.status, o.date
      FROM orders o
      JOIN users u ON o.users_id = u.users_id
      JOIN order_details od ON o.orders_id = od.orders_id
      JOIN menus m ON od.menus_id = m.menus_id
      WHERE o.deleted_at is NULL 
      AND o.users_id = ?
      `[users_id]);
      res.render('orders/index', { orders });
  } catch (err){
    console.log(err);
    res.redirect('/')
  }
};

// ── SHOW ARCHIVE ──
exports.archive = async (req, res) => {
  try {
    const[orders] = await db.query (`
      SELECT o.orders_id, u.name, m.menu_name, od.quantity, od.subtotal, o.status, o.date
      FROM orders o
      JOIN users u ON o.users_id = u.users_id
      JOIN order_details od ON o.orders_id = od.orders_id
      JOIN menus m ON od.menus_id = m.menus_id
      WHERE o.deleted_at IS NOT NULL 
      `);
      res.render('orders/archive', { orders });
  } catch (err){
    console.log(err);
    res.redirect('/orders')
  }
};

// ── SHOW FORM CREATE ──
exports.showCreate = async (req, res) => {
  try {
    const [menus] = await db.query('SELECT * FROM menus');
    res.render('orders/create', { error: null, menus });
  } catch (err) {
    console.log(err);
    res.redirect('/orders');
  }
};

// ── PROCESS CREATE ──
exports.create = async (req, res) => {
   try {
    const { menus_id, quantity } = req.body;

    if (quantity < 1) {
      const [menus] = await db.query('SELECT * FROM menus');
      return res.render('orders/create', { error: 'Quantity tidak boleh kurang dari 1', menus });
    }

    // 1. Ambil harga menu dulu
    const [menu] = await db.query('SELECT * FROM menus WHERE menus_id = ?', [menus_id]);
    const price = menu[0].price;
    const subtotal = price * quantity;

    // 2. Insert ke orders dulu
    const [result] = await db.query(
      'INSERT INTO orders (users_id, status, total_harga) VALUES (?, ?, ?)',
      [req.session.user.users_id, 'pending', subtotal]
    );

    // 3. Ambil orders_id yang baru dibuat
    const orders_id = result.insertId;

    // 4. Insert ke order_details
    await db.query(
      'INSERT INTO order_details (orders_id, menus_id, quantity, subtotal) VALUES (?, ?, ?, ?)',
      [orders_id, menus_id, quantity, subtotal]
    );

    res.redirect('/orders');
  } catch (err) {
    console.log(err);
    res.render('orders/create', { error: 'Gagal buat order!', menus: [] });
  }
};  

// ── PROCESS EDIT ──
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    await db.query(
      'UPDATE orders SET status = ?  WHERE orders_id = ?', 
      [status, req.params.id]
    );
    res.redirect('/orders')
  } catch (err) {
    console.log(err);
    res.redirect('/orders')
  }
};

// -- SOFT DELETE --
exports.softDelete = async (req, res) => {
  try {
    await db.query(
      'UPDATE orders SET deleted_at = NOW() WHERE orders_id = ?', 
      [req.params.id]
    );
    res.redirect('/orders')
  } catch (err) {
    console.log(err);
    res.redirect('/orders')
  }
};

// -- RESTORE --
exports.restore = async (req, res) => {
  try {
    await db.query(
      'UPDATE orders SET deleted_at = NULL WHERE orders_id = ?', 
      [req.params.id]
    );
    res.redirect('/orders/archive')
  } catch (err) {
    console.log(err);
    res.redirect('/orders/archive')
  }
};

// ── DELETE ──
exports.hardDelete = async (req, res) => {
  try {
    await db.query(
      'DELETE FROM order_details WHERE orders_id = ?',
      [req.params.id]
    );
    await db.query(
      'DELETE FROM orders WHERE orders_id = ?',
      [req.params.id]
    );
    res.redirect('/orders')
  } catch (err) {
    console.log(err);
    res.redirect('/orders')
  }
};