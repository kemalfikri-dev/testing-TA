const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { isLogin, isAdmin } = require('../middleware/authMiddleware');

// -- INDEX -- 
router.get('/', isLogin, orderController.index);

// -- ARCHIVE --
router.get('/archive', isAdmin, orderController.archive);

// -- CREATE -- 
// -- CREATE -- 
router.get('/create', isLogin, orderController.showCreate);
router.post('/create', isLogin, orderController.create);

// -- EDIT --
router.post('/update-status/:id', isAdmin, orderController.updateStatus);

// -- DELETE & RESTORE --
router.post('/soft-delete/:id', isAdmin, orderController.softDelete);
router.post('/restore/:id', isAdmin, orderController.restore);
router.post('/hard-delete/:id', isAdmin, orderController.hardDelete);

module.exports = router;