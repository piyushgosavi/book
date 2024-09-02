const express = require('express');
const controller = require('../controllers/bookController');

const {isAuthenticated, isAuthorized} = require('../middlewares/authMiddleware');
const multer = require('multer');
const upload = multer();
const router = express.Router();

router.get('/', isAuthenticated,controller.getAllbook);
router.get('/:id',isAuthenticated,controller.getBookById);
router.post('/', isAuthenticated,isAuthorized('Author'),upload.single('image'),controller.createBook);
router.put('/:id',isAuthenticated,isAuthorized('Author'),upload.single('image'),controller.updateBook);
router.delete('/:id',isAuthenticated,isAuthorized('Author'),controller.deleteBook);


module.exports = router;