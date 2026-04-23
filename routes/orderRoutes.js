const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isLogin, isAdmin } = require('../middleware/authMiddleware');

// -- INDEX -- 
router.get('/', isLogin, orderController.index);

// -- CREATE -- 
router.get('/create', isAdmin, orderController.showCreate);
router.post('/create', isAdmin, orderController.create);

// -- EDIT --
router.post('/update-status/:id', isAdmin, orderController.updateStatus);

// -- DELETE --
router.post('/soft-delete/:id', isAdmin, orderController.softDelete);
router.post('/hard-delete/:id', isAdmin, orderController.hardDelete);

module.exports = router;