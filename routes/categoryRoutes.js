const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { isLogin, isAdmin } = require('../middleware/authMiddleware');

// -- INDEX -- 
router.get('/', isLogin, categoryController.index);

// -- CREATE -- 
router.get('/create', isAdmin, categoryController.showCreate);
router.post('/create', isAdmin, categoryController.create);

// -- EDIT --
router.get('/edit/:id', isAdmin, categoryController.showEdit);
router.post('/edit/:id', isAdmin, categoryController.edit);

// -- DELETE --
router.post('/delete/:id', isAdmin, categoryController.hardDelete);

module.exports = router;