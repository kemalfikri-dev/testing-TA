const db = require('../config/db');

// ── READ - Tampilkan semua kategori ──
exports.index = async (req, res) => {
  try {
    const search = req.query.search || '';

    const[orders] = await db.query (`
      SELECT o.orders_id, u.name, m.menu_name, od.quantity, od.subtotal, o.status, o.date
      FROM orders o
      JOIN users u ON o.users_id = u.users_id
      JOIN order_details od ON o.orders_id = od.orders_id
      JOIN menus m ON od.menus_id = m.menus_id
      WHERE o.deleted_at is NULL 
      `);
      res.render('orders/index', { orders });
  } catch (err){
    console.log(err);
    res.redirect('/')
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
    // destructuring categories_name dari req.body
    // query UPDATE categories berdasarkan req.params.id
    // redirect ke /categories
    const { status } = req.body;
    await db.query(
      'UPDATE orders SET status = ?  WHERE orders_id = ?', 
      [status, req.params.id]
    );
    res.redirect('/orders')
  } catch (err) {
    // redirect ke /categories
    console.log(err);
    res.redirect('/orders')
  }
};

// -- SOFT DELETE --
exports.softDelete = async (req, res) => {
  try {
    // query DELETE berdasarkan req.params.id
    // redirect ke /categories
    await db.query(
      'UPDATE orders SET deleted_at = NOW() WHERE orders_id = ?', 
      [req.params.id]
    );
    res.redirect('/orders')
  } catch (err) {
    // redirect ke /categories
    console.log(err);
    res.redirect('/orders')
  }
};

// ── DELETE ──
exports.hardDelete = async (req, res) => {
  try {
    // query DELETE berdasarkan req.params.id
    // redirect ke /categories
    await db.query(
      'DELETE FROM order_details WHERE orders_id = ?',
      [req.params.id]
    );

    // 2. Baru hapus orders
    await db.query(
      'DELETE FROM orders WHERE orders_id = ?',
      [req.params.id]
    );
    res.redirect('/orders')
  } catch (err) {
    // redirect ke /categories
    console.log(err);
    res.redirect('/orders')
  }
};