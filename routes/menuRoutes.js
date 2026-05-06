const express = require('express');
const router = express.Router();
const menuController = require('../controllers/menuController');
const { isLogin, isAdmin } = require('../middleware/authMiddleware');

// -- INDEX -- 
router.get('/', isLogin, menuController.index);

// -- CREATE -- 
router.get('/create', isAdmin, menuController.showCreate);
router.post('/create', isAdmin, menuController.create);

// -- EDIT --
router.get('/edit/:id', isAdmin, menuController.showEdit);
router.post('/edit/:id', isAdmin, menuController.edit);

// -- DELETE dan RECOVERY--
router.post('/soft-delete/:id', isAdmin, menuController.softDelete);
router.post('/hard-delete/:id', isAdmin, menuController.hardDelete);
router.post('/recover-delete/:id', isAdmin, menuController.recoverDelete);


//--ARSIP--
router.get('/arsip', isAdmin, menuController.showArsip);

module.exports = router;